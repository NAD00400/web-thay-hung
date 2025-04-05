import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { ten_nguoi_dung, email_nguoi_dung, link_anh_dai_dien, firebaseId, vai_tro } = await req.json();

  try {
    // Kiểm tra nếu user đã tồn tại
    const existingUser = await prisma.nguoiDung.findUnique({
      where: { firebaseId },
    });

    if (existingUser) {
      return NextResponse.json(existingUser, { status: 200 });
    }

    const user = await prisma.nguoiDung.create({
      data: {
        
        ten_nguoi_dung,
        email_nguoi_dung,
        link_anh_dai_dien,
        firebaseId,
        vai_tro,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Lỗi tạo user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}


export async function GET() {
    try {
        const users = await prisma.nguoiDung.findMany();
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}



