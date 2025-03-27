import { PrismaClient } from "@prisma/client/extension";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET API
export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const maSoDo = url.searchParams.get('ma-so-do');

    if (!maSoDo) {
        return NextResponse.json({ error: 'Missing ma-so-do parameter' }, { status: 400 });
    }

    try {
        const soDo = await prisma.soDo.findUnique({
            where: { id: maSoDo },
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
        const updatedSoDo = await prisma.soDo.update({
            where: { id: maSoDo },
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
        await prisma.soDo.delete({
            where: { id: maSoDo },
        });

        return NextResponse.json({ message: 'Record deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
    }
}