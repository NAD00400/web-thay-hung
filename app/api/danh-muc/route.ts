import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest) {
    try {
        const categories = await prisma.danhMuc.findMany();
        return NextResponse.json(categories, { status: 200 });
    } catch (_error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { ten_danh_muc, url_image } = await req.json();
        const danh_muc_slug = generateSlug(ten_danh_muc);
        const newCategory = await prisma.danhMuc.create({
            data: { 
                ten_danh_muc,
                danh_muc_slug,
                url_image,
            },
        });
        return NextResponse.json(newCategory, { status: 201 });
    } catch (_error) {
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}

function generateSlug(ten_danh_muc: string): string {
    return ten_danh_muc
        .toLowerCase()
        .normalize('NFD') // <- giúp tách dấu tiếng Việt
        .replace(/[\u0300-\u036f]/g, '') // loại dấu
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}
