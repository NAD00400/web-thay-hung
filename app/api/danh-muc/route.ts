import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const categories = await prisma.danhMuc.findMany();
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
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
                danh_muc_slug: danh_muc_slug,
                url_image,
            },
        });
        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
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
