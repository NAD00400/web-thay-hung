import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// viết cho tôi api get post bằng next js ts 13+ và dùng prisma


const prisma = new PrismaClient();

// GET API: Fetch all customers
export async function GET() {
    try {
        const customers = await prisma.khachHang.findMany();
        return NextResponse.json(customers);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }
}

// POST API: Create a new customer
export async function POST(request: Request) {
    try {
        const {ma_nguoi_dung,so_dien_thoai,dia_chi_khach_hang} = await request.json();
        const newCustomer = await prisma.khachHang.create({
            data: {
                ma_nguoi_dung,
                so_dien_thoai,
                dia_chi_khach_hang,
            },
        });
        return NextResponse.json(newCustomer, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
    }
}