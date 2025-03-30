import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    try {
        const body = await req.json();
        const { chi, day_keo, hat_cuom, mech_dung, nut, ren, san_pham, vai_chinh, vai_lot } = body;
        const updatedPhuLieu = await prisma.phuLieuMayMac.update({
            where: { ma_phu_lieu: id },
            data: { chi, day_keo, hat_cuom, mech_dung, nut, ren, san_pham, vai_chinh, vai_lot },
        });
        return NextResponse.json(updatedPhuLieu, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update phu lieu' }, { status: 500 });
    }
}
export async function DELETE(req: NextRequest, { params }: { params: { 'ma-phu-lieu': string } }) {
    const { 'ma-phu-lieu': maPhuLieu } = params;
    if (!maPhuLieu) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    try {
        await prisma.phuLieuMayMac.delete({
            where: { ma_phu_lieu: maPhuLieu },
        });
        return NextResponse.json(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete phu lieu' }, { status: 500 });
    }
}
