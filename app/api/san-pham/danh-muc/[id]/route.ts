import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: 'Danh mục ID không được để trống' }, { status: 400 });
    }

    try {
        const products = await prisma.sanPhamDatMay.findMany({
            where: {
                danh_muc: { ma_danh_muc: id },
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        return NextResponse.json({ error: 'Lỗi khi lấy sản phẩm' }, { status: 500 });
    }
}