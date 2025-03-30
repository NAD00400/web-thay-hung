import { prisma } from '@/app/lib/prisma';

import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
    try {
        const appointments = await prisma.lichHenKhachHang.findMany();
        return NextResponse.json(appointments, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { 
        ngay_hen, 
        trang_thai_lich_hen, 
        ma_khach_hang } = await req.json();
    try {
        const newAppointment = await prisma.lichHenKhachHang.create({
            data: {
                ngay_tao: new Date(),
                ngay_hen,
                trang: trang_thai_lich_hen || 'CHO_XAC_NHAN',
                ma_khach_hang,
            },
        });
        return NextResponse.json(newAppointment, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
    }
}