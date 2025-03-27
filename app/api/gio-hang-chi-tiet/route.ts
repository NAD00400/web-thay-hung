import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET API: Fetch all items
export async function GET() {
    try {
        const items = await prisma.chiTietGioHang.findMany();
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
    }
}

// POST API: Create a new item
export async function POST(req: Request) {
    try {
        const {
            ma_san_pham_dat_may, 
            so_luong, 
            ma_gio_hang,
        } = await req.json();
        const newItem = await prisma.chiTietGioHang.create({
            data: {
                ma_san_pham_dat_may, 
                so_luong, 
                ma_gio_hang,
            },
        });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
    }
}