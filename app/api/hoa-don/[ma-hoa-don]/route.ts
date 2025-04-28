import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET API
export async function GET(req: NextRequest, { params }: { params: { 'ma-hoa-don': string } }) {
    const { 'ma-hoa-don': maHoaDon } = params;

    try {
        const hoaDon = await prisma.hoaDon.findUnique({
            where: { ma_hoa_don: maHoaDon },
        });

        if (!hoaDon) {
            return NextResponse.json({ error: 'Hóa đơn không tồn tại' }, { status: 404 });
        }

        return NextResponse.json(hoaDon);
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi khi lấy hóa đơn' }, { status: 500 });
    }
}

// PUT API
export async function PUT(req: NextRequest, { params }: { params: { 'ma-hoa-don': string } }) {
    const { 'ma-hoa-don': maHoaDon } = params;
    const {
        trang_thai_thanh_toan,
        tien_da_thanh_toan,
        tien_can_thanh_toan,
        thue,
        ngay_het_han_thanh_toan,
    } = await req.json();

    try {
        const updatedHoaDon = await prisma.hoaDon.update({
            where: { ma_hoa_don: maHoaDon },
            data: {
                ngay_cap_nhat: new Date(),
                trang_thai_thanh_toan,
                tien_da_thanh_toan,
                tien_can_thanh_toan,
                thue,
                ngay_het_han_thanh_toan,
            }
        });

        return NextResponse.json(updatedHoaDon);
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi khi cập nhật hóa đơn' }, { status: 500 });
    }
}

// DELETE API
export async function DELETE(req: NextRequest, { params }: { params: { 'ma-hoa-don': string } }) {
    const { 'ma-hoa-don': maHoaDon } = params;

    try {
        await prisma.hoaDon.delete({
            where: { ma_hoa_don: maHoaDon },
        });

        return NextResponse.json({ message: 'Xóa hóa đơn thành công' });
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi khi xóa hóa đơn' }, { status: 500 });
    }
}