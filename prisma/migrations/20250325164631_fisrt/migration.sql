-- CreateEnum
CREATE TYPE "TrangThaiDonHang" AS ENUM ('CHO_XAC_NHAN', 'DANG_XU_LY', 'DANG_VAN_CHUYEN', 'DA_GIAO', 'DA_HUY');

-- CreateEnum
CREATE TYPE "PhuongThucThanhToan" AS ENUM ('ZALOPAY', 'CHUYEN_KHOAN', 'TIEN_MAT');

-- CreateEnum
CREATE TYPE "TrangThaiThanhToan" AS ENUM ('CHUA_THANH_TOAN', 'DA_THANH_TOAN', 'CHO_XAC_NHAN');

-- CreateEnum
CREATE TYPE "VaiTroNguoiDung" AS ENUM ('KHACH_HANG', 'ADMIN', 'NHAN_VIEN');

-- CreateTable
CREATE TABLE "ChiTietDonHang" (
    "ma_chi_tiet_don_hang" TEXT NOT NULL,
    "ma_don_hang" TEXT NOT NULL,
    "ma_san_pham" TEXT NOT NULL,
    "so_luong" INTEGER NOT NULL,
    "gia_tien" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ChiTietDonHang_pkey" PRIMARY KEY ("ma_chi_tiet_don_hang")
);

-- CreateTable
CREATE TABLE "ChiTietGioHang" (
    "ma_chi_tiet_gio_hang" TEXT NOT NULL,
    "ma_gio_hang" TEXT NOT NULL,
    "ma_san_pham_dat_may" TEXT NOT NULL,
    "so_luong" INTEGER NOT NULL,

    CONSTRAINT "ChiTietGioHang_pkey" PRIMARY KEY ("ma_chi_tiet_gio_hang")
);

-- CreateTable
CREATE TABLE "DanhMuc" (
    "ma_danh_muc" TEXT NOT NULL,
    "ten_danh_muc" TEXT NOT NULL,
    "danh_muc_slug" TEXT NOT NULL,
    "url_image" TEXT NOT NULL,

    CONSTRAINT "DanhMuc_pkey" PRIMARY KEY ("ma_danh_muc")
);

-- CreateTable
CREATE TABLE "DonHang" (
    "ma_don_hang" TEXT NOT NULL,
    "ma_khach_hang" TEXT NOT NULL,
    "ngay_dat_hang" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trang_thai_don_hang" "TrangThaiDonHang" NOT NULL,
    "tong_tien_don_hang" DOUBLE PRECISION NOT NULL,
    "phuong_thuc_thanh_toan" "PhuongThucThanhToan" NOT NULL,
    "thanh_toan_thanh_cong" BOOLEAN NOT NULL,
    "ghi_chu" TEXT,
    "ngay_cap_nhat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DonHang_pkey" PRIMARY KEY ("ma_don_hang")
);

-- CreateTable
CREATE TABLE "GiaoHang" (
    "ma_giao_hang" TEXT NOT NULL,
    "ma_don_hang" TEXT NOT NULL,
    "trang_thai" "TrangThaiDonHang" NOT NULL,
    "phi_van_chuyen" DOUBLE PRECISION NOT NULL,
    "dia_chi_giao_hang" TEXT NOT NULL,
    "ngay_giao_du_kien" TIMESTAMP(3),
    "ngay_giao_thuc_te" TIMESTAMP(3),

    CONSTRAINT "GiaoHang_pkey" PRIMARY KEY ("ma_giao_hang")
);

-- CreateTable
CREATE TABLE "GioHang" (
    "ma_gio_hang" TEXT NOT NULL,
    "ma_khach_hang" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GioHang_pkey" PRIMARY KEY ("ma_gio_hang")
);

-- CreateTable
CREATE TABLE "HoaDon" (
    "ma_hoa_don" TEXT NOT NULL,
    "ma_don_hang" TEXT NOT NULL,
    "so_hoa_don" TEXT NOT NULL,
    "tien_can_thanh_toan" DECIMAL(65,30) NOT NULL,
    "tien_da_thanh_toan" DECIMAL(65,30) NOT NULL,
    "thue" DECIMAL(65,30) NOT NULL,
    "ngay_phat_hanh" TIMESTAMP(3) NOT NULL,
    "ngay_het_han_thanh_toan" TIMESTAMP(3) NOT NULL,
    "ngay_cap_nhat" TIMESTAMP(3) NOT NULL,
    "trang_thanh_toan" "TrangThaiThanhToan" NOT NULL DEFAULT 'CHUA_THANH_TOAN',

    CONSTRAINT "HoaDon_pkey" PRIMARY KEY ("ma_hoa_don")
);

-- CreateTable
CREATE TABLE "KhachHang" (
    "ma_khach_hang" TEXT NOT NULL,
    "ma_nguoi_dung" TEXT NOT NULL,
    "so_dien_thoai" TEXT NOT NULL,
    "dia_chi_khach_hang" TEXT NOT NULL,

    CONSTRAINT "KhachHang_pkey" PRIMARY KEY ("ma_khach_hang")
);

-- CreateTable
CREATE TABLE "LichHenKhachHang" (
    "ma_lich_hen" TEXT NOT NULL,
    "ma_khach_hang" TEXT NOT NULL,
    "ngay_hen" TIMESTAMP(3) NOT NULL,
    "ngay_tao" TIMESTAMP(3) NOT NULL,
    "trang" TEXT NOT NULL,

    CONSTRAINT "LichHenKhachHang_pkey" PRIMARY KEY ("ma_lich_hen")
);

-- CreateTable
CREATE TABLE "NguoiDung" (
    "ma_nguoi_dung" TEXT NOT NULL,
    "email_nguoi_dung" TEXT NOT NULL,
    "ten_nguoi_dung" TEXT NOT NULL,
    "vai_tro" "VaiTroNguoiDung" NOT NULL DEFAULT 'KHACH_HANG',
    "ngay_tao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ngay_cap_nhat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "link_anh_dai_dien" TEXT,
    "firebaseId" TEXT NOT NULL,

    CONSTRAINT "NguoiDung_pkey" PRIMARY KEY ("ma_nguoi_dung")
);

-- CreateTable
CREATE TABLE "PhuLieuMayMac" (
    "ma_phu_lieu" TEXT NOT NULL,
    "vai_chinh" TEXT,
    "chi" TEXT,
    "nut" TEXT,
    "ngay_tao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "day_keo" TEXT,
    "ngay_cap_nhat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ren" TEXT,
    "vai_lot" TEXT,
    "hat_cuom" TEXT,
    "mech_dung" TEXT,

    CONSTRAINT "PhuLieuMayMac_pkey" PRIMARY KEY ("ma_phu_lieu")
);

-- CreateTable
CREATE TABLE "SanPhamDatMay" (
    "ma_san_pham_dat_may" TEXT NOT NULL,
    "ma_danh_muc" TEXT NOT NULL,
    "ten_san_pham" TEXT NOT NULL,
    "gia_tien" DOUBLE PRECISION NOT NULL,
    "mo_ta_san_pham" TEXT NOT NULL,
    "url_image" TEXT NOT NULL,
    "ngay_tao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ngay_cap_nhat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "co_san" BOOLEAN NOT NULL DEFAULT false,
    "ma_phu_lieu" TEXT,

    CONSTRAINT "SanPhamDatMay_pkey" PRIMARY KEY ("ma_san_pham_dat_may")
);

-- CreateTable
CREATE TABLE "SoDoDatMay" (
    "ma_so_do" TEXT NOT NULL,
    "ma_chi_tiet_don_hang" TEXT NOT NULL,
    "vong_nguc" DOUBLE PRECISION NOT NULL,
    "vong_co" DOUBLE PRECISION NOT NULL,
    "vong_eo" DOUBLE PRECISION NOT NULL,
    "be_ngang_vai" DOUBLE PRECISION NOT NULL,
    "vong_hong" DOUBLE PRECISION NOT NULL,
    "chieu_dai_ao" DOUBLE PRECISION NOT NULL,
    "chieu_dai_tu_vai_toi_eo" DOUBLE PRECISION NOT NULL,
    "chieu_dai_tay_ao" DOUBLE PRECISION NOT NULL,
    "vong_bap_tay" DOUBLE PRECISION NOT NULL,
    "vong_khuy_tay" DOUBLE PRECISION NOT NULL,
    "vong_co_tay" DOUBLE PRECISION NOT NULL,
    "chieu_dai_quan" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vong_dui" DOUBLE PRECISION NOT NULL,
    "vong_dau_goi" TEXT,
    "vong_ong_quan" TEXT,

    CONSTRAINT "SoDoDatMay_pkey" PRIMARY KEY ("ma_so_do")
);

-- CreateTable
CREATE TABLE "ThanhToan" (
    "ma_thanh_toan" TEXT NOT NULL,
    "ma_don_hang" TEXT NOT NULL,
    "paymentMethod" "PhuongThucThanhToan" NOT NULL,
    "paymentStatus" "TrangThaiThanhToan" NOT NULL,
    "transactionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentType" TEXT NOT NULL,

    CONSTRAINT "ThanhToan_pkey" PRIMARY KEY ("ma_thanh_toan")
);

-- CreateIndex
CREATE UNIQUE INDEX "DanhMuc_danh_muc_slug_key" ON "DanhMuc"("danh_muc_slug");

-- CreateIndex
CREATE UNIQUE INDEX "GiaoHang_ma_don_hang_key" ON "GiaoHang"("ma_don_hang");

-- CreateIndex
CREATE UNIQUE INDEX "HoaDon_ma_don_hang_key" ON "HoaDon"("ma_don_hang");

-- CreateIndex
CREATE UNIQUE INDEX "KhachHang_ma_nguoi_dung_key" ON "KhachHang"("ma_nguoi_dung");

-- CreateIndex
CREATE UNIQUE INDEX "NguoiDung_email_nguoi_dung_key" ON "NguoiDung"("email_nguoi_dung");

-- CreateIndex
CREATE UNIQUE INDEX "NguoiDung_firebaseId_key" ON "NguoiDung"("firebaseId");

-- CreateIndex
CREATE UNIQUE INDEX "SoDoDatMay_ma_chi_tiet_don_hang_key" ON "SoDoDatMay"("ma_chi_tiet_don_hang");

-- CreateIndex
CREATE UNIQUE INDEX "ThanhToan_ma_don_hang_key" ON "ThanhToan"("ma_don_hang");

-- CreateIndex
CREATE UNIQUE INDEX "ThanhToan_transactionId_key" ON "ThanhToan"("transactionId");

-- AddForeignKey
ALTER TABLE "ChiTietDonHang" ADD CONSTRAINT "ChiTietDonHang_ma_don_hang_fkey" FOREIGN KEY ("ma_don_hang") REFERENCES "DonHang"("ma_don_hang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChiTietDonHang" ADD CONSTRAINT "ChiTietDonHang_ma_san_pham_fkey" FOREIGN KEY ("ma_san_pham") REFERENCES "SanPhamDatMay"("ma_san_pham_dat_may") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChiTietGioHang" ADD CONSTRAINT "ChiTietGioHang_ma_gio_hang_fkey" FOREIGN KEY ("ma_gio_hang") REFERENCES "GioHang"("ma_gio_hang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonHang" ADD CONSTRAINT "DonHang_ma_khach_hang_fkey" FOREIGN KEY ("ma_khach_hang") REFERENCES "KhachHang"("ma_khach_hang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiaoHang" ADD CONSTRAINT "GiaoHang_ma_don_hang_fkey" FOREIGN KEY ("ma_don_hang") REFERENCES "DonHang"("ma_don_hang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GioHang" ADD CONSTRAINT "GioHang_ma_khach_hang_fkey" FOREIGN KEY ("ma_khach_hang") REFERENCES "KhachHang"("ma_khach_hang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoaDon" ADD CONSTRAINT "HoaDon_ma_don_hang_fkey" FOREIGN KEY ("ma_don_hang") REFERENCES "DonHang"("ma_don_hang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KhachHang" ADD CONSTRAINT "KhachHang_ma_nguoi_dung_fkey" FOREIGN KEY ("ma_nguoi_dung") REFERENCES "NguoiDung"("ma_nguoi_dung") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LichHenKhachHang" ADD CONSTRAINT "LichHenKhachHang_ma_khach_hang_fkey" FOREIGN KEY ("ma_khach_hang") REFERENCES "KhachHang"("ma_khach_hang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SanPhamDatMay" ADD CONSTRAINT "SanPhamDatMay_ma_danh_muc_fkey" FOREIGN KEY ("ma_danh_muc") REFERENCES "DanhMuc"("ma_danh_muc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SanPhamDatMay" ADD CONSTRAINT "SanPhamDatMay_ma_phu_lieu_fkey" FOREIGN KEY ("ma_phu_lieu") REFERENCES "PhuLieuMayMac"("ma_phu_lieu") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoDoDatMay" ADD CONSTRAINT "SoDoDatMay_ma_chi_tiet_don_hang_fkey" FOREIGN KEY ("ma_chi_tiet_don_hang") REFERENCES "ChiTietDonHang"("ma_chi_tiet_don_hang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThanhToan" ADD CONSTRAINT "ThanhToan_ma_don_hang_fkey" FOREIGN KEY ("ma_don_hang") REFERENCES "DonHang"("ma_don_hang") ON DELETE RESTRICT ON UPDATE CASCADE;
