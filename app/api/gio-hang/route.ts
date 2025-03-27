import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET handler
export async function GET() {
    try {
        const gioHang = await prisma.gioHang.findMany();
        return NextResponse.json(gioHang);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch giaohang' }, { status: 500 });
    }
}

// POST handler
export async function POST(req: Request) {
    try {
        const  {ma_khach_hang,
            chi_tiet_gio_hang:{
                    // ma_gio_hang, // Removed as it is not a valid property
                    ma_san_pham_dat_may,
                    so_luong,
            }
            
            }  = await req.json();
        const newGiaohang = await prisma.gioHang.create({
            data: {
                ma_khach_hang,
                khach_hang: {
                    connect: { ma_khach_hang: ma_khach_hang }
                },
                chi_tiet_gio_hang: {
                    create: {
                        ma_san_pham_dat_may,
                        so_luong,
                    }
                }
            }
        });
        return NextResponse.json(newGiaohang, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create giao hang' }, { status: 500 });
    }
}