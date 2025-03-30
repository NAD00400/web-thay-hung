import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET handler
export async function GET() {
    try {
        const soDo = await prisma.soDoDatMay.findMany();
        return NextResponse.json(soDo, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch soDo' }, { status: 500 });
    }
}

// POST handler
export async function POST(req: NextRequest) {
    try {
        const {
            ma_chi_tiet_don_hang,
                be_ngang_vai,
                chieu_dai_ao,
                chieu_dai_quan,
                chieu_dai_tay_ao,
                chieu_dai_tu_vai_toi_eo,
                vong_bap_tay,
                vong_eo,
                vong_co,
                vong_hong,
                vong_nguc,
                vong_co_tay,
                vong_dui,
                vong_khuy_tay,
                vong_dau_goi,
                vong_ong_quan,
        } = await req.json();
        const newSoDo = await prisma.soDoDatMay.create({
            data: {
                be_ngang_vai,
                chieu_dai_ao,
                chieu_dai_quan,
                chieu_dai_tay_ao,
                chieu_dai_tu_vai_toi_eo,
                vong_bap_tay,
                vong_eo,
                vong_co,
                vong_nguc,
                vong_co_tay,
                vong_dui,
                vong_hong,
                vong_khuy_tay,
                vong_dau_goi,
                vong_ong_quan,
                chi_tiet_don_hang:{
                    connect:{
                        ma_chi_tiet_don_hang: ma_chi_tiet_don_hang}
                },
            },
        });
        return NextResponse.json(newSoDo, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create soDo' }, { status: 500 });
    }
}

