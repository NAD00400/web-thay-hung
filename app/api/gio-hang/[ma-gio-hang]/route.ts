import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


// PUT API handler

export async function GET(req: NextRequest, { params }: { params: { 'ma-khach-hang': string } }) {
    const maKh = params['ma-khach-hang'];
    const searchParams = req.nextUrl.searchParams;
    const someFilter = searchParams.get('filter');
    try {
        const data = await prisma.gioHang.findMany({
            where: {
                ma_khach_hang: maKh,
                ...(someFilter && { someField: someFilter }), 
            },
        });
        return NextResponse.json({ data, message: 'Resource fetched successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch resource', details: (error as Error).message }, { status: 500 });
    }
}
