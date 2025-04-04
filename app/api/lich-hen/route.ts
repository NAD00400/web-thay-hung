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
export async function POST(req: NextRequest) {
  try {
    const { ngay_hen, trang_thai_lich_hen, ma_khach_hang, ten_khach_hang, so_dien_thoai, email } = await req.json();
    const ngayHenDate = new Date(ngay_hen);

    // Kiểm tra xem ngày hẹn có hợp lệ không
    if (isNaN(ngayHenDate.getTime())) {
      return NextResponse.json({ error: 'Invalid appointment date' }, { status: 400 });
    }

    // Kiểm tra xem khách hàng đã tồn tại chưa
    const existingCustomer = await prisma.khachHang.findUnique({
      where: { ma_khach_hang: ma_khach_hang },
    });

    if (!existingCustomer) {
      // Nếu khách hàng chưa tồn tại, tạo mới khách hàng và người dùng
      const newCustomer = await prisma.khachHang.create({
        data: {
          ten_khach_hang: ten_khach_hang,
          so_dien_thoai: so_dien_thoai,
          dia_chi_khach_hang: '', // Provide a default or meaningful value for the address
          nguoi_dung: {
            create: {
              ten_nguoi_dung: ten_khach_hang,
              email_nguoi_dung: email, // Sửa từ "emai" thành "email"
              firebaseId: 'firebaseId', // Bạn cần truyền firebaseId từ client nếu có
              vai_tro: 'KHACH_HANG', 
              link_anh_dai_dien: 'linkAnhDaiDien', // Có thể truyền ảnh đại diện từ client
            },
          },
        },
      });

      // Sau khi tạo khách hàng mới, tạo lịch hẹn cho khách hàng
      const newAppointment = await prisma.lichHenKhachHang.create({
        data: {
          ngay_tao: new Date(),
          ngay_hen: ngayHenDate || new Date(),
          trang: trang_thai_lich_hen || 'CHO_XAC_NHAN',
          ma_khach_hang: newCustomer.ma_khach_hang, // Dùng mã khách hàng mới tạo
        },
      });

      return NextResponse.json(newAppointment, { status: 201 });

    } else {
      // Nếu khách hàng đã tồn tại, chỉ tạo lịch hẹn mới cho khách hàng
      const newAppointment = await prisma.lichHenKhachHang.create({
        data: {
          ngay_tao: new Date(),
          ngay_hen: ngayHenDate || new Date(),
          trang: trang_thai_lich_hen || 'CHO_XAC_NHAN',
          ma_khach_hang: ma_khach_hang,
        },
      });

      return NextResponse.json(newAppointment, { status: 201 });
    }

  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}


