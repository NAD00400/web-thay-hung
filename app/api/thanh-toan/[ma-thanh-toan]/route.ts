import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET API
export async function GET(req: NextRequest, { params }: { params: { 'ma-thanh-toan': string } }) {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || undefined;

    try {
        const payment = await prisma.thanhToan.findMany({
            where: {
                ma_thanh_toan: params['ma-thanh-toan'],
                ...(filter && { someField: { contains: filter } }), // Adjust `someField` as needed
            },
        });

        return NextResponse.json(payment);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching payment' }, { status: 500 });
    }
}

// PUT API
export async function PUT(req: NextRequest, { params }: { params: { 'ma-thanh-toan': string } }) {
    const {paymentMethod,paymentStatus,paymentType,transactionId} = await req.json();

    try {
        const updatedPayment = await prisma.thanhToan.update({
            where: { ma_thanh_toan: params['ma-thanh-toan'] },
            data: {paymentMethod,paymentStatus,paymentType,transactionId},
        });

        return NextResponse.json(updatedPayment);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating payment' }, { status: 500 });
    }
}

// DELETE API
export async function DELETE(req: NextRequest, { params }: { params: { 'ma-thanh-toan': string } }) {
    try {
        await prisma.thanhToan.delete({
            where: { ma_thanh_toan: params['ma-thanh-toan'] },
        });

        return NextResponse.json({ message: 'Payment deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting payment' }, { status: 500 });
    }
}