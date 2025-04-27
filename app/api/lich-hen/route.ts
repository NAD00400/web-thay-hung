import { prisma } from '@/app/lib/prisma';

import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
    try {
        const appointments = await prisma.lichHenKhachHang.findMany({
            include: {
                khach_hang: {  // Lấy thông tin khách hàng từ khóa ngoại
                    include: {
                        nguoi_dung: true, // Lấy thông tin người dùng từ khách hàng
                    },
                },
            },
        });
        return NextResponse.json(appointments, { status: 200 });
    } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
        return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
    }
}

export async function POST(req: Request) {
  try {
    const { ma_khach_hang, ten_khach_hang, so_dien_thoai, dia_chi_khach_hang, ngay_hen } = await req.json();
    
    // Kiểm tra đầu vào
    if (!ngay_hen || (!ma_khach_hang && (!ten_khach_hang || !so_dien_thoai || !dia_chi_khach_hang))) {
      return NextResponse.json({ message: "Thiếu thông tin tạo lịch hẹn" }, { status: 400 });
    }

    let customerId: string;

    // Nếu đã có mã khách hàng
    if (ma_khach_hang) {
      // Kiểm tra xem khách hàng đã tồn tại
      const existingCustomer = await prisma.khachHang.findUnique({
        where: { ma_khach_hang }
      });

      if (!existingCustomer) {
        return NextResponse.json({ message: "Khách hàng không tồn tại" }, { status: 400 });
      }

      customerId = ma_khach_hang;  // Sử dụng mã khách hàng đã có
    } else {
      // Nếu không có mã khách hàng, tạo khách hàng mới
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(so_dien_thoai)) {
        return NextResponse.json({ message: "Số điện thoại không hợp lệ" }, { status: 400 });
      }

      // Kiểm tra khách hàng đã tồn tại qua số điện thoại
      const existingCustomer = await prisma.khachHang.findFirst({
        where: { so_dien_thoai }
      });

      if (existingCustomer) {
        return NextResponse.json({ message: "Khách hàng đã tồn tại với số điện thoại này" }, { status: 400 });
      }

      // Tạo khách hàng mới
      const newCustomer = await prisma.khachHang.create({
        data: { 
          ten_khach_hang, 
          so_dien_thoai, 
          dia_chi_khach_hang 
        }
      });

      customerId = newCustomer.ma_khach_hang;  // Lấy mã khách hàng mới
    }

    // Tạo lịch hẹn
    const timestamp = new Date(ngay_hen).toISOString();
    const lichHen = await prisma.lichHenKhachHang.create({
      data: {
        ma_khach_hang: customerId,
        ngay_hen: timestamp,
        trang_thai_lich_hen: 'CHO_XAC_NHAN',  // Có thể thay đổi trạng thái lịch hẹn tùy nhu cầu
        ngay_tao: new Date().toISOString(),
      }
    });

    return NextResponse.json({ message: "Tạo lịch hẹn thành công", data: lichHen });
  } catch (error) {
    console.error("Lỗi khi tạo lịch hẹn:", error);
    return NextResponse.json({ message: "Lỗi server khi tạo lịch hẹn" }, { status: 500 });
  }
}
