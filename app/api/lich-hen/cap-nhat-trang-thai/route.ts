import { prisma } from "@/app/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { ma_lich_hen, trang_thai_lich_hen } = body;
  
      if (!ma_lich_hen || !trang_thai_lich_hen) {
        return NextResponse.json(
          { message: 'Thiếu ma_lich_hen hoặc trang_thai_lich_hen' },
          { status: 400 }
        );
      }
  
      const lichHen = await prisma.lichHenKhachHang.update({
        where: { ma_lich_hen },
        data: { trang: trang_thai_lich_hen },
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
