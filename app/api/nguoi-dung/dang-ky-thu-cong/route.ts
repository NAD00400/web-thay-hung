import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { ten_nguoi_dung, email_nguoi_dung, mat_khau } = body;

        if (!ten_nguoi_dung || !email_nguoi_dung || !mat_khau) {
            return NextResponse.json({ error: 'Thiếu thông tin bắt buộc.' }, { status: 400 });
        }

        const existingUser = await prisma.nguoiDung.findUnique({
            where: { email_nguoi_dung },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Email đã được sử dụng.' }, { status: 400 });
        }

        // Tạo firebaseId ngẫu nhiên nếu chưa có
        const generateFirebaseId = () => {
            return 'firebase-' + Math.random().toString(36).substr(2, 9); // tạo firebaseId ngẫu nhiên
        };
        
        const newUser = await prisma.nguoiDung.create({
            data: {
                ten_nguoi_dung,
                email_nguoi_dung,
                link_anh_dai_dien: 'https://example.com/default-avatar.png', // Ví dụ ảnh đại diện mặc định
                firebaseId: generateFirebaseId(), // Dùng firebaseId ngẫu nhiên
                vai_tro: 'KHACH_HANG', // Vai trò mặc định
                mat_khau,
            },
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        return NextResponse.json({ error: 'Lỗi máy chủ.' }, { status: 500 });
    }
}
