import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
// viết thêm cho tôi api get bằng next js ts 13+ và dùng prisma và searchParams
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('ma-danh-muc');

        if (id) {
            const category = await prisma.danhMuc.findUnique({
                where: { ma_danh_muc: id as string },
            });

            if (!category) {
                return NextResponse.json({ error: 'Category not found' }, { status: 404 });
            }

            return NextResponse.json(category, { status: 200 });
        } else {
            const categories = await prisma.danhMuc.findMany();
            return NextResponse.json(categories, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('ma-danh-muc');
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
        const id = searchParams.get('ma-danh-muc');
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