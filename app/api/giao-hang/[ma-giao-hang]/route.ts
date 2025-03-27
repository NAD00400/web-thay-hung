import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// GET API
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const maGiaoHang = searchParams.get('ma-giao-hang');
    try {
        if (maGiaoHang) {
            const giaoHang = await prisma.giaoHang.findUnique({
                where: {
                    ma_giao_hang: maGiaoHang,
                },
            });
            if (!giaoHang) {
                return NextResponse.json({ error: 'Record not found' }, { status: 404 });
            }
            return NextResponse.json(giaoHang);
        } else {
            const giaoHangs = await prisma.giaoHang.findMany();
            return NextResponse.json(giaoHangs);
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch records', details: error }, { status: 500 });
    }
}
// DELETE API
export async function DELETE(req: NextRequest, ) {
    
    const { searchParams } = new URL(req.url);
    const maGiaoHang = searchParams.get('ma-giao-hang');
    try {
        const deletedRecord = await prisma.giaoHang.delete({
            where: {
                ma_giao_hang: maGiaoHang|| undefined,
            },
        });

        return NextResponse.json({ message: 'Record deleted successfully', deletedRecord });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete record', details: error }, { status: 500 });
    }
}

// PUT API
export async function PUT(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const maGiaoHang = searchParams.get('ma-giao-hang');
    const {dia_chi_giao_hang,ngay_giao_du_kien,ngay_giao_thuc_te,phi_van_chuyen,trang_thai} = await req.json();
    try {
        const updatedGH = await prisma.giaoHang.update({
            where: {
                ma_giao_hang: maGiaoHang || undefined,
            },
            data: {dia_chi_giao_hang,ngay_giao_du_kien,ngay_giao_thuc_te,phi_van_chuyen,trang_thai},
        });
        return NextResponse.json({ message: 'giao hang updated successfully', updatedGH  });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update giao hang', details: error }, { status: 500 });
    }
}