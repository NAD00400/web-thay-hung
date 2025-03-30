import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET API
export async function GET(req: NextRequest, { params }: { params: { "ma-chi-tiet": string } }) {
    const { "ma-chi-tiet": maChiTiet} = params; 
    try {
        const record = await prisma.chiTietDonHang.findUnique({
            where: {
                ma_chi_tiet_don_hang: maChiTiet || undefined,
            },
        });

        if (!record) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Record retrieved successfully', record });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to retrieve record', details: error }, { status: 500 });
    }
}
// DELETE API
export async function DELETE(req: NextRequest, { params }: { params: { "ma-chi-tiet": string } }, ) {
    
    const { "ma-chi-tiet": maChiTiet} = params; 
    try {
        const deletedRecord = await prisma.chiTietDonHang.delete({
            where: {
                ma_chi_tiet_don_hang: maChiTiet || undefined,
            },
        });

        return NextResponse.json({ message: 'Record deleted successfully', deletedRecord });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete record', details: error }, { status: 500 });
    }
}

// PUT API
export async function PUT(req: NextRequest, { params }: { params: { "ma-chi-tiet": string } }) {
    const { "ma-chi-tiet": maChiTiet} = params; 
    const body = await req.json();
    try {
        const updatedRecord = await prisma.chiTietDonHang.update({
            where: {
                ma_chi_tiet_don_hang: maChiTiet || undefined,
            },
            data: body,
        });

        return NextResponse.json({ message: 'Record updated successfully', updatedRecord });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update record', details: error }, { status: 500 });
    }
}