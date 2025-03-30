import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/app/lib/prisma';


// Handle GET request
export async function GET() {
    try {
        const products = await prisma.sanPhamDatMay.findMany();
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

// Handle POST request
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            ten_san_pham,
            mo_ta_san_pham,
            gia_tien,
            url_image,
            co_san,
            ma_danh_muc,
            ma_phu_lieu,
            danh_muc
        } = body;

        const newProduct = await prisma.sanPhamDatMay.create({
            data: {
                ten_san_pham,
                mo_ta_san_pham,
                gia_tien,
                url_image,
                co_san,
                ma_danh_muc,
                ma_phu_lieu,
                danh_muc: {
                    connect: { ma_danh_muc: danh_muc.ma_danh_muc },
                },
            }
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
