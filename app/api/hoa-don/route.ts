import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET API: Fetch all hoa-don
export async function GET() {
    try {
        const hoaDon = await prisma.hoaDon.findMany();
        return NextResponse.json(hoaDon);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch hoa-don' }, { status: 500 });
    }
}

// POST API: Create a new hoa-don
export async function POST(request: NextRequest) {
    try {
        const {
            ma_don_hang,
            thue,
            so_hoa_don,
            tien_can_thanh_toan, // Replace with appropriate value
            tien_da_thanh_toan
        } = await request.json();
        const ngayHetHanThanhToan = new Date();
        ngayHetHanThanhToan.setDate(ngayHetHanThanhToan.getDate() + 3);
        
        const newHoaDon = await prisma.hoaDon.create({
            data: {
                ngay_het_han_thanh_toan: ngayHetHanThanhToan,
                so_hoa_don: so_hoa_don,
                ngay_phat_hanh: new Date(),
                thue: thue,
                trang_thanh_toan: 'CHO_XAC_NHAN',
                tien_can_thanh_toan, // Replace with appropriate value
                tien_da_thanh_toan, // Replace with appropriate value
                ngay_cap_nhat: new Date(),
                don_hang: { connect: { ma_don_hang: ma_don_hang } },
            },
        });
        return NextResponse.json(newHoaDon, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create hoa-don' }, { status: 500 });
    }
}