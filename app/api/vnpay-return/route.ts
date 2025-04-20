import { NextRequest, NextResponse } from 'next/server';
import qs from 'qs';
import crypto from 'crypto';
import { prisma } from '@/app/lib/prisma';


const vnp_HashSecret = process.env.VNP_HASH_SECRET!;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());

  const secureHash = params['vnp_SecureHash'];
  delete params['vnp_SecureHash'];
  delete params['vnp_SecureHashType'];

  // B1: Sắp xếp tham số
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {} as Record<string, string>);

  // B2: Tạo chữ ký mới
  const signData = qs.stringify(sortedParams, { encode: false });
  const signed = crypto
    .createHmac('sha512', vnp_HashSecret)
    .update(Buffer.from(signData, 'utf-8'))
    .digest('hex');

  // B3: So sánh chữ ký
  if (secureHash !== signed) {
    console.error('❌ VNPay SecureHash mismatch!', { secureHash, signed });
    return NextResponse.redirect('/loi-xac-thuc-chu-ky');
  }

  const responseCode = params['vnp_ResponseCode'];
  const txnRef = params['vnp_TxnRef'];
  const transactionId = params['vnp_TransactionNo'];

  console.log('[✅ VNPay Callback]', {
    responseCode,
    txnRef,
    transactionId,
    amount: params['vnp_Amount'],
    bankCode: params['vnp_BankCode'],
    time: params['vnp_PayDate'],
  });

  if (responseCode !== '00') {
    return NextResponse.redirect(`/thanh-toan-that-bai?code=${responseCode}`);
  }

  try {
    const donHang = await prisma.donHang.findUnique({
      where: { ma_don_hang: txnRef },
    });

    if (!donHang) {
      console.error('❌ Không tìm thấy đơn hàng!');
      return NextResponse.redirect('/khong-tim-thay-don-hang');
    }

    // B4: Cập nhật đơn hàng
    await prisma.donHang.update({
      where: { ma_don_hang: txnRef },
      data: {
        trang_thai_don_hang: 'CHO_XAC_NHAN',
        thanh_toan_thanh_cong: true,
        ngay_cap_nhat: new Date(),
      },
    });

    // B5: Tạo bản ghi thanh toán
    await prisma.thanhToan.create({
      data: {
        ma_don_hang: txnRef,
        paymentMethod: "VNPAY",
        paymentStatus: "DA_THANH_TOAN",
        transactionId: params['vnp_TransactionNo'],
        paymentDate: new Date(),
        paymentType: 'VNPAY',
      },
    });

    return NextResponse.redirect(`/thanh-toan-thanh-cong?ma=${txnRef}`);
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật đơn hàng hoặc thanh toán:', err);
    return NextResponse.redirect('/loi-he-thong');
  }
}
