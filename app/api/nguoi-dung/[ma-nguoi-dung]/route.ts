import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { 'ma-nguoi-dung': string } }) {
    const { 'ma-nguoi-dung': maNguoiDung } = params;
    try {
        await prisma.nguoiDung.delete({
            where: { ma_nguoi_dung: maNguoiDung as string },
        });
        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { 'ma-nguoi-dung': string } }) {
    const { 'ma-nguoi-dung': maNguoiDung } = params;
    const { ten_nguoi_dung, email_nguoi_dung, link_anh_dai_dien, firebaseId, vai_tro } = await req.json();
    try {
        const user = await prisma.nguoiDung.update({
            where: { ma_nguoi_dung: maNguoiDung as string },
            data: {
                email_nguoi_dung,
                firebaseId,
                ten_nguoi_dung,
                link_anh_dai_dien,
                vai_tro,
            },
        });
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}