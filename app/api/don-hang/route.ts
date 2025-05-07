import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
    try {
        const donHangs = await prisma.donHang.findMany({
          select: {
            ma_don_hang: true,
            ngay_dat_hang: true,
            trang_thai_don_hang: true,
            ghi_chu: true,
            ngay_cap_nhat: true,
            ma_khach_hang: true,
          },
          orderBy: { ngay_dat_hang: 'desc' },
        });
        return NextResponse.json(donHangs, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch don hang' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      ma_khach_hang,
      phuong_thuc_thanh_toan,
      chi_tiet_don_hang,
      ghi_chu,
      thanh_toan,
      giao_hang,
    } = body;
    const donHang = await prisma.donHang.create({
      data: {
        ma_khach_hang,
        trang_thai_don_hang: 'CHO_XAC_NHAN',
        phuong_thuc_thanh_toan,
        ghi_chu: ghi_chu || null,
      },
    });

    // 2. Tạo chi tiết đơn hàng + số đo nếu có
    for (const item of chi_tiet_don_hang) {
      const chiTiet = await prisma.chiTietDonHang.create({
        data: {
          ma_don_hang: donHang.ma_don_hang,
          ma_san_pham: item.ma_san_pham,
          so_luong: item.so_luong,
          gia_tien: item.gia_tien,
        },
      });
      
      // DÙNG đúng khóa PK của chi_tiet_don_hang
      await prisma.soDoDatMay.create({
        data: {
          ma_chi_tiet_don_hang: chiTiet.ma_chi_tiet_don_hang,
          vong_nguc: item.so_do.vong_nguc,
          vong_eo: item.so_do.vong_eo,
          vong_hong: item.so_do.vong_hong,
          be_ngang_vai: item.so_do.be_ngang_vai,
          chieu_dai_ao: item.so_do.chieu_dai_ao,
          chieu_dai_quan: item.so_do.chieu_dai_quan,
        },
      });      
    }

    // 3. Tạo giao hàng
    await prisma.giaoHang.create({
      data: {
        ma_don_hang: donHang.ma_don_hang,
        trang_thai: 'CHO_XAC_NHAN',
        phi_van_chuyen: giao_hang.phi_van_chuyen || 0,
        dia_chi_giao_hang: giao_hang.dia_chi_giao_hang,
        ngay_giao_du_kien: giao_hang.ngay_giao_du_kien || null,
      },
    });

    // 4. Tạo thanh toán
    await prisma.thanhToan.create({
      data: {
        ma_don_hang: donHang.ma_don_hang,
        paymentMethod: thanh_toan.paymentMethod || 'COD',
        paymentStatus: thanh_toan.paymentStatus || 'CHUA_THANH_TOAN',
        transactionId: thanh_toan.transactionId || "",
        paymentType: thanh_toan.paymentType || "THANH_TOAN_TOAN_BO",
      },
    });

    return NextResponse.json({ success: true, donHang }, { status: 201 });
  } catch (error) {
    console.error('Lỗi tạo đơn hàng:', error);
    return NextResponse.json({ error: 'Lỗi tạo đơn hàng' }, { status: 500 });
  }
}

