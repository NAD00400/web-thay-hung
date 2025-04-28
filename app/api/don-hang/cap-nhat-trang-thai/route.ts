import { prisma } from "@/app/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { ma_don_hang, trang_thai_don_hang } = body;
  
      if (!ma_don_hang || !trang_thai_don_hang) {
        return NextResponse.json(
          { message: 'Thiếu ma_lich_hen hoặc trang_thai_lich_hen' },
          { status: 400 }
        );
      }
  
      const lichHen = await prisma.donHang.update({
        where: { ma_don_hang },
        data: { trang_thai_don_hang: trang_thai_don_hang },
      });

      return NextResponse.json({ message: 'Cập nhật thành công', lichHen });
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái lịch hẹn:', error);
      return NextResponse.json(
        { message: 'Lỗi server khi cập nhật trạng thái' },
        { status: 500 }
      );
    }
}
