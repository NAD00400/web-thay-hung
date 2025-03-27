import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET API
export async function GET() {
    try {
        const payments = await prisma.thanhToan.findMany();
        return NextResponse.json(payments);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
    }
}

// POST API
export async function POST(req: Request) {
    try {
        const {paymentMethod,paymentStatus,paymentType,transactionId ,ma_don_hang} = await req.json();
        const newPayment = await prisma.thanhToan.create({
            data: {paymentMethod, paymentStatus, paymentType, transactionId, don_hang: { connect: { ma_don_hang: ma_don_hang } }},
        });
        return NextResponse.json(newPayment, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
    }
}