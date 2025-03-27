import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET API
export async function GET(req: NextRequest, { params }: { params: { 'ma-lich-hen': string } }) {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || undefined;

    try {
        const maLichHen = params['ma-lich-hen'];
        const result = await prisma.lichHenKhachHang.findMany({
            where: {
                ma_lich_hen: maLichHen,
                ...(filter && { someField: { contains: filter } }), // Adjust `someField` as needed
            },
        });
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

// PUT API
export async function PUT(req: NextRequest, { params }: { params: { 'ma-lich-hen': string } }) {
    const maLichHen = params['ma-lich-hen'];
    const body = await req.json();

    try {
        const updatedRecord = await prisma.lichHenKhachHang.update({
            where: { ma_lich_hen: maLichHen },
            data: body,
        });
        return NextResponse.json(updatedRecord);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
    }
}

// DELETE API
export async function DELETE(req: NextRequest, { params }: { params: { 'ma-lich-hen': string } }) {
    const maLichHen = params['ma-lich-hen'];

    try {
        await prisma.lichHenKhachHang.delete({
            where: { ma_lich_hen: maLichHen },
        });
        return NextResponse.json({ message: 'Record deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
    }
}