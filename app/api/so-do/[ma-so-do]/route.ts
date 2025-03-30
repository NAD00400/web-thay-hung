import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET API - Lấy thông tin sơ đồ đặt may theo mã số
export async function GET(req: NextRequest, { params }: { params: { "ma-so-do": string } }) {
    const { "ma-so-do": maSoDo } = params;

    if (!maSoDo) {
        return NextResponse.json({ error: "Missing ma-so-do parameter" }, { status: 400 });
    }

    try {
        const soDo = await prisma.soDoDatMay.findUnique({
            where: { ma_so_do: maSoDo },
        });

        if (!soDo) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        return NextResponse.json(soDo, { status: 200 });
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch record" }, { status: 500 });
    }
}

// PUT API - Cập nhật thông tin sơ đồ đặt may
export async function PUT(req: NextRequest, { params }: { params: { "ma-so-do": string } }) {
    const { "ma-so-do": maSoDo } = params;

    if (!maSoDo) {
        return NextResponse.json({ error: "Missing ma-so-do parameter" }, { status: 400 });
    }

    try {
        const data = await req.json(); // Sửa lỗi sai request.json()
        const updatedSoDo = await prisma.soDoDatMay.update({
            where: { ma_so_do: maSoDo },
            data,
        });

        return NextResponse.json(updatedSoDo, { status: 200 });
    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
    }
}

// DELETE API - Xóa sơ đồ đặt may theo mã số
export async function DELETE(req: NextRequest, { params }: { params: { "ma-so-do": string } }) {
    const { "ma-so-do": maSoDo } = params;

    if (!maSoDo) {
        return NextResponse.json({ error: "Missing ma-so-do parameter" }, { status: 400 });
    }

    try {
        await prisma.soDoDatMay.delete({
            where: { ma_so_do: maSoDo },
        });

        return NextResponse.json({ message: "Record deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
    }
}
