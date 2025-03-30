import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Retrieve records with optional query parameters
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const maChiTiet = searchParams.get('ma-chi-tiet');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    try {
        if (maChiTiet) {
            const record = await prisma.chiTietGioHang.findUnique({
                where: { ma_chi_tiet_gio_hang: maChiTiet },
            });

            if (!record) {
                return NextResponse.json({ error: 'Record not found' }, { status: 404 });
            }

            return NextResponse.json(record, { status: 200 });
        } else {
            const records = await prisma.chiTietGioHang.findMany({
                take: limit,
                skip: offset,
            });

            return NextResponse.json(records, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to retrieve records' }, { status: 500 });
    }
}
// PUT: Update a record
export async function PUT(req: Request, { params }: { params: { 'ma-chi-tiet': string } }) {
    const maChiTiet = params['ma-chi-tiet'];
    const body = await req.json();

    try {
        const updatedRecord = await prisma.chiTietGioHang.update({
            where: { ma_chi_tiet_gio_hang: maChiTiet },
            data: body,
        });

        return NextResponse.json(updatedRecord, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
    }
}

// DELETE: Delete a record
export async function DELETE(req: Request, { params }: { params: { 'ma-chi-tiet': string } }) {
    const maChiTiet = params['ma-chi-tiet'];

    try {
        await prisma.chiTietGioHang.delete({
            where: { ma_chi_tiet_gio_hang: maChiTiet },
        });

        return NextResponse.json({ message: 'Record deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
    }
}