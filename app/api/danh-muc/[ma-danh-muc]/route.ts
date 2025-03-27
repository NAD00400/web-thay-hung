import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        await prisma.danhMuc.delete({
            where: { ma_danh_muc: id as string },
        });
        return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const { ten_danh_muc, url_image } = await req.json();
        const danh_muc_slug = generateSlug(ten_danh_muc);
        const updatedCategory = await prisma.danhMuc.update({
            where: { ma_danh_muc: id as string },
            data: {
                ten_danh_muc,
                danh_muc_slug,
                url_image,
            },
        });
        return NextResponse.json(updatedCategory, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}
function generateSlug(ten_danh_muc: string): string {
    return ten_danh_muc
        .toLowerCase()
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}