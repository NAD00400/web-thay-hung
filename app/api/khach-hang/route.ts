import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

// GET API: Fetch all customers
export async function GET() {
    try {
        const customers = await prisma.khachHang.findMany({
            include: {
                nguoi_dung: {
                    select: {
                        email_nguoi_dung: true,
                    },
                },
                don_hang: {
                    select: {
                        ma_don_hang: true,
                        chi_tiet_don_hang: {
                            select: {
                                san_pham: {
                                    select: {
                                        ten_san_pham: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        return NextResponse.json(customers);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }
}

// POST API: Create a new customer
export async function POST(request: Request) {
    try {
        const {so_dien_thoai,dia_chi_khach_hang ,ten_khach_hang} = await request.json();
        const newCustomer = await prisma.khachHang.create({
            data: {
                ten_khach_hang,
                
                so_dien_thoai,
                dia_chi_khach_hang,
            },
        });
        return NextResponse.json(newCustomer, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
    }
}