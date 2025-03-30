import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


// PUT API handler
// export async function PUT(req: NextRequest, { params }: { params: { 'ma-gio-hang': string } }) {
//     const maGioHang = params['ma-gio-hang'];
//     const searchParams = req.nextUrl.searchParams;

//     // Example: Extracting a search param
//     const someParam = searchParams.get('someParam');

//     try {
//         // Update the resource in the database
//         const updatedData = await prisma.gioHang.update({
//             where: { ma_gio_hang },
//             data: { : someParam }, // Replace `someField` with your actual field name
//         });

//         return NextResponse.json({ updatedData, message: 'Resource updated successfully' }, { status: 200 });
//     } catch (error) {
//         return NextResponse.json({ error: 'Failed to update resource', details: error.message }, { status: 500 });
//     }
// }
// GET API handler
export async function GET(req: NextRequest, { params }: { params: { 'ma-gio-hang': string } }) {
    const maGioHang = params['ma-gio-hang'];
    const searchParams = req.nextUrl.searchParams;

    // Example: Extracting a search param
    const someFilter = searchParams.get('filter');

    try {
        // Fetch the resource from the database with optional filtering
        const data = await prisma.gioHang.findMany({
            where: {
                ma_gio_hang: maGioHang,
                ...(someFilter && { someField: someFilter }), // Replace `someField` with your actual field name
            },
        });

        return NextResponse.json({ data, message: 'Resource fetched successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch resource', details: (error as Error).message }, { status: 500 });
    }
}
// DELETE API handler
export async function DELETE(req: NextRequest, { params }: { params: { 'ma-gio-hang': string } }) {
    const maGioHang = params['ma-gio-hang'];

    try {
        // Delete the resource from the database
        const deletedData = await prisma.gioHang.delete({
            where: { ma_gio_hang: maGioHang },
        });

        return NextResponse.json({ deletedData, message: 'Resource deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete resource', details: (error as Error).message }, { status: 500 });
    }
}