import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
    const { ten_nguoi_dung, email_nguoi_dung, link_anh_dai_dien, firebaseId, vai_tro } = await req.json();
    try {
        const user = await prisma.nguoiDung.create({
            data: {
                email_nguoi_dung,
                firebaseId,
                ten_nguoi_dung,
                link_anh_dai_dien,
                vai_tro,
            },
        });
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
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



