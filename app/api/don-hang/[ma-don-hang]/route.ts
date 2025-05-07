import { prisma } from '@/app/lib/prisma';
import { Select } from '@radix-ui/react-select';
import { m } from 'framer-motion';
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
        khach_hang: {
          select: {
            ma_khach_hang: true,
            ten_khach_hang: true,
            so_dien_thoai: true,
            dia_chi_khach_hang: true,
          },
        },
        chi_tiet_don_hang: {
          include: {
            san_pham: true,
            SoDoDatMay: true,
          },
        },
        giao_hang: {
          select: {
            ma_giao_hang: true,
            dia_chi_giao_hang: true,
            ngay_giao_du_kien: true,
            ngay_giao_thuc_te: true,
            phi_van_chuyen: true,
            trang_thai: true,
          },
        },
        thanh_toan: {
          select: {
            ma_thanh_toan: true,
            paymentMethod: true,
            paymentStatus: true,
            paymentType: true,
            transactionId: true,
          },
        },
        hoa_don: {
          select: {
            so_hoa_don: true,
            ma_don_hang: true,
            ngay_phat_hanh: true,
            ngay_het_han_thanh_toan: true,
            trang_thai_thanh_toan: true,
            tien_can_thanh_toan: true,
            tien_da_thanh_toan: true,
            thue: true,
            ngay_cap_nhat: true,
          },
        },
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
    await prisma.donHang.delete({
                where: { ma_don_hang: maDonHang as string },
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