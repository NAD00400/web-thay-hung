/*
  Warnings:

  - A unique constraint covering the columns `[ma_san_pham_dat_may]` on the table `PhuLieuMayMac` will be added. If there are existing duplicate values, this will fail.
  - Made the column `ma_nguoi_dung` on table `KhachHang` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `ma_san_pham_dat_may` to the `PhuLieuMayMac` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChiTietDonHang" DROP CONSTRAINT "ChiTietDonHang_ma_don_hang_fkey";

-- DropForeignKey
ALTER TABLE "DonHang" DROP CONSTRAINT "DonHang_ma_khach_hang_fkey";

-- DropForeignKey
ALTER TABLE "GiaoHang" DROP CONSTRAINT "GiaoHang_ma_don_hang_fkey";

-- DropForeignKey
ALTER TABLE "GioHang" DROP CONSTRAINT "GioHang_ma_khach_hang_fkey";

-- DropForeignKey
ALTER TABLE "HoaDon" DROP CONSTRAINT "HoaDon_ma_don_hang_fkey";

-- DropForeignKey
ALTER TABLE "LichHenKhachHang" DROP CONSTRAINT "LichHenKhachHang_ma_khach_hang_fkey";

-- DropForeignKey
ALTER TABLE "SanPhamDatMay" DROP CONSTRAINT "SanPhamDatMay_ma_phu_lieu_fkey";

-- DropForeignKey
ALTER TABLE "SoDoDatMay" DROP CONSTRAINT "SoDoDatMay_ma_chi_tiet_don_hang_fkey";

-- DropForeignKey
ALTER TABLE "ThanhToan" DROP CONSTRAINT "ThanhToan_ma_don_hang_fkey";

-- AlterTable
ALTER TABLE "KhachHang" ALTER COLUMN "ma_nguoi_dung" SET NOT NULL;

-- AlterTable
ALTER TABLE "PhuLieuMayMac" ADD COLUMN     "ma_san_pham_dat_may" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PhuLieuMayMac_ma_san_pham_dat_may_key" ON "PhuLieuMayMac"("ma_san_pham_dat_may");

-- AddForeignKey
ALTER TABLE "ChiTietDonHang" ADD CONSTRAINT "ChiTietDonHang_ma_don_hang_fkey" FOREIGN KEY ("ma_don_hang") REFERENCES "DonHang"("ma_don_hang") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChiTietGioHang" ADD CONSTRAINT "ChiTietGioHang_ma_san_pham_dat_may_fkey" FOREIGN KEY ("ma_san_pham_dat_may") REFERENCES "SanPhamDatMay"("ma_san_pham_dat_may") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonHang" ADD CONSTRAINT "DonHang_ma_khach_hang_fkey" FOREIGN KEY ("ma_khach_hang") REFERENCES "KhachHang"("ma_khach_hang") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiaoHang" ADD CONSTRAINT "GiaoHang_ma_don_hang_fkey" FOREIGN KEY ("ma_don_hang") REFERENCES "DonHang"("ma_don_hang") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GioHang" ADD CONSTRAINT "GioHang_ma_khach_hang_fkey" FOREIGN KEY ("ma_khach_hang") REFERENCES "KhachHang"("ma_khach_hang") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoaDon" ADD CONSTRAINT "HoaDon_ma_don_hang_fkey" FOREIGN KEY ("ma_don_hang") REFERENCES "DonHang"("ma_don_hang") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LichHenKhachHang" ADD CONSTRAINT "LichHenKhachHang_ma_khach_hang_fkey" FOREIGN KEY ("ma_khach_hang") REFERENCES "KhachHang"("ma_khach_hang") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhuLieuMayMac" ADD CONSTRAINT "PhuLieuMayMac_ma_san_pham_dat_may_fkey" FOREIGN KEY ("ma_san_pham_dat_may") REFERENCES "SanPhamDatMay"("ma_san_pham_dat_may") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoDoDatMay" ADD CONSTRAINT "SoDoDatMay_ma_chi_tiet_don_hang_fkey" FOREIGN KEY ("ma_chi_tiet_don_hang") REFERENCES "ChiTietDonHang"("ma_chi_tiet_don_hang") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThanhToan" ADD CONSTRAINT "ThanhToan_ma_don_hang_fkey" FOREIGN KEY ("ma_don_hang") REFERENCES "DonHang"("ma_don_hang") ON DELETE CASCADE ON UPDATE CASCADE;
