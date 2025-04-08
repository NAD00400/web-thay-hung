import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
  try {
    const { ma_chi_tiet_gio_hang, so_luong_moi } = await req.json();

    if (!ma_chi_tiet_gio_hang || typeof so_luong_moi !== 'number') {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ.' },
        { status: 400 }
      );
    }

    if (so_luong_moi < 1) {
      return NextResponse.json(
        { error: 'Số lượng phải lớn hơn 0.' },
        { status: 400 }
      );
    }

    const existingItem = await prisma.chiTietGioHang.findUnique({
      where: { ma_chi_tiet_gio_hang },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Chi tiết giỏ hàng không tồn tại.' },
        { status: 404 }
      );
    }

    // Cập nhật số lượng
    const updated = await prisma.chiTietGioHang.update({
      where: { ma_chi_tiet_gio_hang },
      data: { so_luong: so_luong_moi },
    });

    return NextResponse.json({
      message: 'Cập nhật thành công',
      data: updated,
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật số lượng giỏ hàng:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi cập nhật giỏ hàng.' },
      { status: 500 }
    );
  }
}
