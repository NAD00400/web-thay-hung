import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
// GET API Route
export async function GET(req: NextRequest, { params }: { params: { "ma-don-hang": string } }) {
    const { "ma-don-hang": maDonHang} = params; 

    if (!maDonHang) {
        return NextResponse.json({ error: 'Missing ma-don-hang parameter' }, { status: 400 });
    }

    const order = await prisma.danhMuc.findUnique({
        where: { ma_danh_muc: maDonHang as string },
    });

    if (!order) {
        return NextResponse.json({ error: `Order ${maDonHang} not found` }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
}
// DELETE API Route
export async function DELETE(req: NextRequest, { params }: { params: { "ma-don-hang": string } }) {
    const { "ma-don-hang": maDonHang} = params; 
    await prisma.danhMuc.delete({
                where: { ma_danh_muc: maDonHang as string },
            });
    return NextResponse.json({ message: `Order ${maDonHang} deleted successfully` }, { status: 200 });
}

// PUT API Route
export async function PUT(req: NextRequest, { params }: { params: { "ma-don-hang": string } }) {
    const { "ma-don-hang": maDonHang} = params; 
    const body = await req.json();

    // Logic to update the order by maDonHang with the data in body
    // Example: await updateOrder(maDonHang, body);

    return NextResponse.json({ message: `Order ${maDonHang} updated successfully` }, { status: 200 });
}