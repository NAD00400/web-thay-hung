// /api/khach-hang/tim-kiem.ts
import { prisma } from "@/app/lib/prisma"
import { log } from "console"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
      const { so_dien_thoai } = await req.json();
  
      if (!so_dien_thoai?.trim()) {
        return NextResponse.json({ message: "Số điện thoại không hợp lệ" }, { status: 400 });
      }
  
      const khachHang = await prisma.khachHang.findFirst({
        where: { so_dien_thoai: so_dien_thoai.trim() },
      });
  
      if (!khachHang) {
        return NextResponse.json({ message: "Khách hàng không tìm thấy" }, { status: 404 });
      }
  
      return NextResponse.json(khachHang);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm khách hàng:", error);
      return NextResponse.json({ message: "Lỗi server khi tìm kiếm khách hàng" }, { status: 500 });
    }
  }
  