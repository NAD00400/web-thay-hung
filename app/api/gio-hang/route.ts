import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, customerId } = body;

    if (!productId || !customerId) {
      return NextResponse.json({ error: 'Thiếu thông tin productId hoặc customerId' }, { status: 400 });
    }

    let cart = await prisma.gioHang.findFirst({
      where: { ma_khach_hang: customerId },
    });

    if (!cart) {
      cart = await prisma.gioHang.create({
        data: {
          ma_khach_hang: customerId,
        },
      });
    }

    const cartItem = await prisma.chiTietGioHang.findFirst({
      where: {
        ma_gio_hang: cart.ma_gio_hang,
        ma_san_pham_dat_may: productId,
      },
    });

    if (cartItem) {
      await prisma.chiTietGioHang.update({
        where: { ma_chi_tiet_gio_hang: cartItem.ma_chi_tiet_gio_hang },
        data: { so_luong: cartItem.so_luong + 1 },
      });
    } else {
      await prisma.chiTietGioHang.create({
        data: {
          ma_gio_hang: cart.ma_gio_hang,
          ma_san_pham_dat_may: productId,
          so_luong: 1,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lỗi khi thêm vào giỏ hàng:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const gioHang = await prisma.gioHang.findMany();
    return NextResponse.json(gioHang);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gioHang' }, { status: 500 });
  }
}
