import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET API
// export async function GET(req: NextRequest, { params }: { params: { 'ma-lich-hen': string } }) {
//     const { searchParams } = new URL(req.url);
//     const filter = searchParams.get('filter') || undefined;

//     try {
//         const maLichHen = params['ma-lich-hen'];
//         const result = await prisma.lichHenKhachHang.findMany({
//             where: {
//                 ma_lich_hen: maLichHen,
//                 ...(filter && { someField: { contains: filter } }), // Adjust `someField` as needed
//             },
//         });
//         return NextResponse.json(result);
//     } catch (error) {
//         return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
//     }
// }

// PUT API
export async function PUT(req: NextRequest, { params }: { params: { 'ma-lich-hen': string } }) {
  const maLichHen = params['ma-lich-hen'];
  const body = await req.json();

  console.log('Received body:', body); // Kiểm tra dữ liệu nhận được từ frontend

  try {
    const updatedRecord = await prisma.lichHenKhachHang.update({
      where: { ma_lich_hen: maLichHen },
      data: body,
    });

    console.log('Updated record:', updatedRecord); // Kiểm tra dữ liệu đã được cập nhật

    return NextResponse.json({ success: true, data: updatedRecord });
  } catch (error) {
    console.error('Error updating record:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}


// DELETE API
export async function DELETE(
  req: NextRequest,
  { params }: { params: { 'ma-lich-hen': string } }
) {
  const ma_lich_hen = params['ma-lich-hen']; 

  if (!ma_lich_hen) {
    return NextResponse.json({ success: false, message: 'Thiếu mã lịch hẹn' }, { status: 400 });
  }

  try {
    await prisma.lichHenKhachHang.delete({
      where: { ma_lich_hen },
    });

    return NextResponse.json({ success: true, message: 'Xóa lịch hẹn thành công' }, { status: 200 });
  } catch (error) {
    console.error('Lỗi khi xóa lịch hẹn:', error);
    return NextResponse.json({ success: false, message: 'Xóa lịch hẹn thất bại' }, { status: 500 });
  }
}