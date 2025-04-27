// app/api/nguoi-dung/[firebaseId]/route.ts
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
  params: {
    firebaseId: string;
  };
};

export async function GET(req: Request, { params }: Params) {
  const { firebaseId } = params;

  if (!firebaseId) {
    return NextResponse.json({ error: "Thiếu Firebase ID" }, { status: 400 });
  }

  try {
    const nguoiDung = await prisma.nguoiDung.findUnique({
      where: { firebaseId },
    });
    const khachHang = await prisma.khachHang.findUnique({
      where: { ma_nguoi_dung: nguoiDung?.ma_nguoi_dung },
      include:{
        GioHang: {
          include: {
            chi_tiet_gio_hang: {
              include: {
                san_pham: true,
              },
            },
          },
        },
      }
    });
    if (!khachHang) {
      return NextResponse.json({ error: "Không tìm thấy khach hang" }, { status: 404 });
    }
    const data={
      user:nguoiDung,
      customer:khachHang
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  }
}
