import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
//// viết thêm cho tôi api get ,put và delete bằng next js ts 13+ và dùng prisma và searchParams
const prisma = new PrismaClient();

// GET API: Fetch a customer by ID using searchParams
export async function GET(req: Request) {
    const url = new URL(req.url);
    const maKhachHang = url.searchParams.get('ma-khach-hang');

    if (!maKhachHang) {
        return NextResponse.json({ error: 'Missing ma-khach-hang parameter' }, { status: 400 });
    }

    try {
        const customer = await prisma.khachHang.findUnique({
            where: { ma_khach_hang: maKhachHang },
        });

        if (!customer) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        return NextResponse.json(customer);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
// PUT API: Update a customer by ID using searchParams
export async function PUT(req: Request) {
    const url = new URL(req.url);
    const maKhachHang = url.searchParams.get('ma-khach-hang');

    if (!maKhachHang) {
        return NextResponse.json({ error: 'Missing ma-khach-hang parameter' }, { status: 400 });
    }

    try {
        const {dia_chi_khach_hang,so_dien_thoai} = await req.json();
        const updatedCustomer = await prisma.khachHang.update({
            where: { ma_khach_hang: maKhachHang },
            data: {dia_chi_khach_hang,so_dien_thoai},
        });

        return NextResponse.json(updatedCustomer);
    } catch (error) {
        if ((error as any).code === 'P2025') {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE API: Delete a customer by ID using searchParams
export async function DELETE(req: Request) {
    const url = new URL(req.url);
    const maKhachHang = url.searchParams.get('ma-khach-hang');

    if (!maKhachHang) {
        return NextResponse.json({ error: 'Missing ma-khach-hang parameter' }, { status: 400 });
    }

    try {
        await prisma.khachHang.delete({
            where: { ma_khach_hang: maKhachHang },
        });

        return NextResponse.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        if ((error as any).code === 'P2025') {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
