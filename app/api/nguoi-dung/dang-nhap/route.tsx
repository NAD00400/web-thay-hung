// app/api/dang-nhap/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email_nguoi_dung, mat_khau } = body;

    if (!email_nguoi_dung || !mat_khau) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc." }, { status: 400 });
    }

    const user = await prisma.nguoiDung.findUnique({ where: { email_nguoi_dung } });

    if (!user || user.mat_khau !== mat_khau) {
      return NextResponse.json({ error: "Email hoặc mật khẩu không đúng." }, { status: 400 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return NextResponse.json({ error: "Lỗi máy chủ." }, { status: 500 });
  }
}
