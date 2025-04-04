import { prisma } from "@/app/lib/prisma";

async function main() {
  console.log("Seeding database...");

  // 🌱 Tạo dữ liệu giả cho bảng nguoi_dung
  const user = await prisma.nguoiDung.create({
    data: {
      email_nguoi_dung: "user222222@example.com",
      ten_nguoi_dung: "Nguyen Van A",
      vai_tro: "KHACH_HANG",
      link_anh_dai_dien: "https://brojqgdjcljbprhn.public.blob.vercel-storage.com/products/1741070068726-DALL%C2%B7E%202025-03-03%2012.53.06%20-%20A%20contemporary%20Vietnamese%20%C3%A1o%20d%C3%A0i%20for%20office%20wear%2C%20featuring%20a%20dark%20green%20fabric%20with%20subtle%20floral%20embroidery%20on%20the%20chest.%20The%20design%20is%20sleek%20with%20a-hVcSOlrM1vfLrpOD00dyn3ybZUIQAZ.webp",
      firebaseId: "firebase124422",
    },
  });

  // 🌱 Tạo khách hàng dựa trên user
  const customer = await prisma.khachHang.create({
    data: {
      ten_khach_hang: "Lê Thị Tuyết",
      ma_nguoi_dung: user.ma_nguoi_dung,
      so_dien_thoai: "0123456789",
      dia_chi_khach_hang: "123 Đường ABC, TP.HCM",
    },
  });

  // 🌱 Tạo danh mục sản phẩm
  const category = await prisma.danhMuc.create({
    data: {
      ten_danh_muc: "Áo Dài",
      danh_muc_slug: "ao-dai",
      url_image: "https://brojqgdjcljbprhn.public.blob.vercel-storage.com/products/1741070032523-DALL%C2%B7E%202025-03-03%2012.55.11%20-%20A%20polished%20Vietnamese%20%C3%A1o%20d%C3%A0i%20for%20office%20wear%2C%20crafted%20in%20a%20deep%20navy%20blue%20with%20subtle%20silver%20embroidery%20along%20the%20neckline.%20The%20design%20is%20sleek%20and%20pr-djvT7wOIhWq8iwRYCHFZhowBv2Hfem.webp",
    },
  });

  // 🌱 Tạo sản phẩm đặt may
  const product = await prisma.sanPhamDatMay.create({
    data: {
      ma_danh_muc: category.ma_danh_muc,
      ten_san_pham: "Áo Dài Truyền Thống",
      gia_tien: 500000,
      mo_ta_san_pham: "Áo dài truyền thống Việt Nam",
      url_image: "https://example.com/ao-dai-traditional.jpg",
      co_san: false,
    },
  });

  // 🌱 Tạo giỏ hàng
  const cart = await prisma.gioHang.create({
    data: {
      ma_khach_hang: customer.ma_khach_hang,
    },
  });

  // 🌱 Thêm sản phẩm vào giỏ hàng
  await prisma.chiTietGioHang.create({
    data: {
      ma_gio_hang: cart.ma_gio_hang,
      ma_san_pham_dat_may: product.ma_san_pham_dat_may,
      so_luong: 2,
    },
  });

  // 🌱 Tạo đơn hàng
  const order = await prisma.donHang.create({
    data: {
      ma_khach_hang: customer.ma_khach_hang,
      trang_thai_don_hang: "CHO_XAC_NHAN",
      tong_tien_don_hang: 1000000,
      phuong_thuc_thanh_toan: "TIEN_MAT",
      thanh_toan_thanh_cong: false,
    },
  });

  // 🌱 Thêm sản phẩm vào đơn hàng
  const order_detail =await prisma.chiTietDonHang.create({
    data: {
      ma_don_hang: order.ma_don_hang,
      ma_san_pham: product.ma_san_pham_dat_may,
      so_luong: 2,
      gia_tien: 500000,
    },
  });

  // 🌱 Tạo hóa đơn
  await prisma.hoaDon.create({
    data: {
      ma_don_hang: order.ma_don_hang,
      so_hoa_don: "HD-0001",
      tien_can_thanh_toan: 1000000,
      tien_da_thanh_toan: 0,
      thue: 0.1,
      ngay_phat_hanh: new Date(),
      ngay_het_han_thanh_toan: new Date(),
      trang_thanh_toan: "CHUA_THANH_TOAN",
      ngay_cap_nhat: new Date(),
    },
  });

  // 🌱 Tạo lịch hẹn khách hàng
  await prisma.lichHenKhachHang.create({
    data: {
    
      ma_khach_hang: customer.ma_khach_hang,
      ngay_hen: new Date(),
      ngay_tao: new Date(),
      trang: "Chờ xác nhận",
    },
  });

  // 🌱 Tạo thanh toán
  await prisma.thanhToan.create({
    data: {
      ma_don_hang: order.ma_don_hang,
      paymentMethod: "TIEN_MAT",
      paymentStatus: "CHUA_THANH_TOAN",
      transactionId: "txn_123456",
      paymentType: "Full",
    },
  });

  // 🌱 Tạo thông tin giao hàng
  await prisma.giaoHang.create({
    data: {
      ma_don_hang: order.ma_don_hang,
      trang_thai: "CHO_XAC_NHAN",
      phi_van_chuyen: 30000,
      dia_chi_giao_hang: "123 Đường ABC, TP.HCM",
    },
  });

  // 🌱 Tạo số đo đặt may
  await prisma.soDoDatMay.create({
    data: {
      ma_chi_tiet_don_hang: order_detail.ma_chi_tiet_don_hang,
      vong_nguc: 90,
      vong_co: 40,
      vong_eo: 70,
      be_ngang_vai: 45,
      vong_hong: 95,
      chieu_dai_ao: 120,
      chieu_dai_tu_vai_toi_eo: 40,
      chieu_dai_tay_ao: 60,
      vong_bap_tay: 30,
      vong_khuy_tay: 20,
      vong_co_tay: 18,
      chieu_dai_quan: 100,
      vong_dui: 50,
      vong_dau_goi: "30",
      vong_ong_quan: "25",
    },
  });
  await prisma.phuLieuMayMac.create({
    data: {
      vai_chinh: "Cotton 100%",
      chi: "Chỉ may polyester",
      nut: "Nút gỗ tròn",
      day_keo: "Dây kéo nhựa",
      ren: "Ren thêu họa tiết",
      vai_lot: "Lụa mềm cao cấp",
      hat_cuom: "Hạt cườm ngọc trai",
      mech_dung: "Mếch vải cứng",
      ngay_tao: new Date(),
      ngay_cap_nhat: new Date(),
    },
  });
  console.log("Seeding completed!");
}

// Chạy seeding
main()
  .catch((e) => {
    console.error("Seeding error: ", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

//   Khi bạn cập nhật file schema.prisma, bạn cần thực hiện các bước sau:

// Tạo migration mới:
// Chạy lệnh như npx prisma migrate dev --name <migration_name> để tạo migration mới và cập nhật cấu trúc cơ sở dữ liệu theo file schema.
// Cập nhật Prisma Client:
// Sau khi migration chạy xong, bạn cần chạy lệnh npx prisma generate để cập nhật (hoặc tái sinh) Prisma Client với những thay đổi mới trong schema.
// Lưu ý rằng bạn không cần phải cài đặt lại gói @prisma/client nếu đã cài, chỉ cần generate lại client sau khi thay đổi schema.

// npx tsx prisma/seed.ts  để chạy file seed.ts
// npx prisma migrate dev --name <migration_name> để tạo migration mới
// npx prisma generate để cập nhật Prisma Client
// npm install @prisma/client cài lại gói @prisma/client
// npx prisma studio để mở Prisma Studio
// npx prisma migrate reset để xóa tất cả migration và reset cơ sở dữ liệu
// npx prisma migrate deploy để deploy migration lên cơ sở dữ liệu
// npx prisma migrate resolve để giải quyết xung đột migration
// npx prisma db push để push schema lên cơ sở dữ liệu
// npx prisma db pull để pull schema từ cơ sở dữ liệu






