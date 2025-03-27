import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET handler
export async function GET() {
    try {
        const orders = await prisma.chiTietDonHang.findMany();
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

// POST handler
export async function POST(req: Request) {
    try {
        const  {ma_don_hang,
                ma_san_pham,
                so_luong,
                gia_tien,
            }  = await req.json();
        const newOrder = await prisma.chiTietDonHang.create({
            data: {
                ma_don_hang,
                ma_san_pham,
                so_luong,
                gia_tien,
            },
        });
        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}