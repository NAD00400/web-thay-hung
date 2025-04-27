import { NextRequest, NextResponse } from 'next/server';
import qs from 'qs';
import crypto from 'crypto';
import dayjs from 'dayjs';

const vnp_TmnCode = process.env.VNP_TMNCODE!;
const vnp_HashSecret = process.env.VNP_HASH_SECRET!;
const vnp_Url = process.env.VNP_URL!;
const vnp_ReturnUrl = process.env.VNP_RETURN_URL!;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { amount, orderId, orderDescription, bankCode } = body;

  const createDate = dayjs().format('YYYYMMDDHHmmss');
  const ipAddr = req.headers.get('x-forwarded-for') || '127.0.0.1';

  const vnp_Params: Record<string, string> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderDescription,
    vnp_OrderType: 'other',
    vnp_Amount: (amount * 100).toString(), // nhân 100 theo VNPay
    vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = vnp_Params[key];
      return acc;
    }, {} as Record<string, string>);

  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac('sha512', vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  sortedParams['vnp_SecureHash'] = signed;
  const paymentUrl = `${vnp_Url}?${qs.stringify(sortedParams, { encode: true })}`;

  return NextResponse.json({ paymentUrl });
}
