import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
      const url = new URL(req.url);
      const paths = url.pathname.split('/');
      const ma_don_hang = paths[paths.length - 1]; // lấy mã đơn hàng từ URL
  
      console.log("ma_don_hang:", ma_don_hang);
  
      const donHang = await prisma.donHang.findUnique({
        where: { ma_don_hang },
        include: {
          khach_hang: true,
          chi_tiet_don_hang: {
            include: {
              san_pham: true,
              SoDoDatMay: true,
            },
          },
          giao_hang: true,
          thanh_toan: true,
          hoa_don: true,
        },
      });
  
      if (!donHang) {
        return NextResponse.json({ error: "Đơn hàng không tồn tại" }, { status: 404 });
      }
  
      return NextResponse.json(donHang);
    } catch (error) {
      console.error("Lỗi Prisma:", error);
      return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
    }
  }


// DELETE API Route
export async function DELETE(req: NextRequest, { params }: { params: { "ma-don-hang": string } }) {
    const { "ma-don-hang": maDonHang} = params; 
    await prisma.danhMuc.delete({
                where: { ma_danh_muc: maDonHang as string },
            });
    return NextResponse.json({ message: `Order ${maDonHang} deleted successfully` }, { status: 200 });
}

// PUT API Route
export async function PUT(req: NextRequest, { params }: { params: { "ma-don-hang": string } }) {
    const { "ma-don-hang": maDonHang} = params; 
    const body = await req.json();
    // Logic to update the order by maDonHang with the data in body
    // Example: await updateOrder(maDonHang, body);
    return NextResponse.json({ message: `Order ${maDonHang} updated successfully` }, { status: 200 });
}