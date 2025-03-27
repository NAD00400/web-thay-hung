import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET handler
export async function GET() {
    try {
        const giaohang = await prisma.giaoHang.findMany();
        return NextResponse.json(giaohang);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch giaohang' }, { status: 500 });
    }
}

// POST handler
export async function POST(req: Request) {
    try {
        const  {
            ma_don_hang,
            dia_chi_giao_hang,
            phi_van_chuyen,
            trang_thai,
            ngay_giao_du_kien,
            ngay_giao_thuc_te
            }  = await req.json();
        const newGiaohang = await prisma.giaoHang.create({
            data: {
                ma_don_hang,
                dia_chi_giao_hang,
                phi_van_chuyen,
                trang_thai,
                ngay_giao_du_kien,
                ngay_giao_thuc_te
            },
        });
        return NextResponse.json(newGiaohang, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create giao hang' }, { status: 500 });
    }
}