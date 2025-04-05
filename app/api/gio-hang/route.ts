import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

// GET handler
export async function GET() {
    try {
        const gioHang = await prisma.gioHang.findMany();
        return NextResponse.json(gioHang);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch giaohang' }, { status: 500 });
    }
}