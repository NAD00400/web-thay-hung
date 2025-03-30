import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
    try {
        const donHangs = await prisma.donHang.findMany();
        return NextResponse.json(donHangs, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch don hang' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { 
            ma_khach_hang,
            trang_thai_don_hang,
            tong_tien_don_hang,
            phuong_thuc_thanh_toan,
            thanh_toan_thanh_cong,
            chi_tiet_don_hang,
        } = body;
        const newDonHang = await prisma.donHang.create({
            data: {
                ma_khach_hang,
                trang_thai_don_hang,
                tong_tien_don_hang,
                phuong_thuc_thanh_toan,
                thanh_toan_thanh_cong,
                chi_tiet_don_hang: {
                    createMany: {
                        data: chi_tiet_don_hang.map((item: any) => ({ 
                            ma_san_pham: item.ma_san_pham,
                            so_luong: item.so_luong,
                            gia_tien: item.gia_tien
                        })),
                    },
                },
            },
            include: {
                chi_tiet_don_hang: true,
            },
        });
        return NextResponse.json(newDonHang, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create don hang' }, { status: 500 });
    }
}
