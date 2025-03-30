
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


// GET API
export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const maSoDo = url.searchParams.get('ma-so-do');

    if (!maSoDo) {
        return NextResponse.json({ error: 'Missing ma-so-do parameter' }, { status: 400 });
    }

    try {
        const soDo = await prisma.soDoDatMay.findUnique({
            where: { ma_so_do: maSoDo },
        });

        if (!soDo) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }

        return NextResponse.json(soDo);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch record' }, { status: 500 });
    }
}

// PUT API
export async function PUT(request: NextRequest) {
    const url = new URL(request.url);
    const maSoDo = url.searchParams.get('ma-so-do');

    if (!maSoDo) {
        return NextResponse.json({ error: 'Missing ma-so-do parameter' }, { status: 400 });
    }

    try {
        const data = await request.json();
        const updatedSoDo = await prisma.soDoDatMay.update({
            where: { ma_so_do: maSoDo },
            data,
        });

        return NextResponse.json(updatedSoDo);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
    }
}

// DELETE API
export async function DELETE(request: NextRequest) {
    const url = new URL(request.url);
    const maSoDo = url.searchParams.get('ma-so-do');

    if (!maSoDo) {
        return NextResponse.json({ error: 'Missing ma-so-do parameter' }, { status: 400 });
    }

    try {
        await prisma.soDoDatMay.delete({
            where: { ma_so_do: maSoDo },
        });

        return NextResponse.json({ message: 'Record deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
    }
}