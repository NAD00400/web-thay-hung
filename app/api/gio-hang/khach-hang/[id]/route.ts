import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        // Fetch cart data from the database using Prisma
        const customerCart = await prisma.gioHang.findMany({
            where: { ma_khach_hang: id },
            include: { chi_tiet_gio_hang:{
                include: {
                    san_pham:true, // Include product details if needed
                }
            } }, // Adjust based on your Prisma schema
        });

        if (customerCart.length > 0) {
            return NextResponse.json(customerCart);
        } else {
            return NextResponse.json({ message: 'Cart not found for the given customer ID' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
