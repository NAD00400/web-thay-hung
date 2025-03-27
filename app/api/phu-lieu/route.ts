import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    return await getPhuLieus(req);
}

export async function POST(req: NextRequest) {
    return await createPhuLieu(req);
}



async function getPhuLieus(req: NextRequest) {
    try {
        const phuLieus = await prisma.phuLieuMayMac.findMany();
        return NextResponse.json(phuLieus, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch phu lieus' }, { status: 500 });
    }
}

async function createPhuLieu(req: NextRequest) {
    try {
        const body = await req.json();
        const { chi, day_keo, hat_cuom, mech_dung, nut, ren, san_pham, vai_chinh, vai_lot } = body;
        const newPhuLieu = await prisma.phuLieuMayMac.create({
            data: {
                chi, day_keo, hat_cuom, mech_dung, nut, ren, vai_chinh, vai_lot,
            },
        });
        return NextResponse.json(newPhuLieu, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create phu lieu' }, { status: 500 });
    }
}
