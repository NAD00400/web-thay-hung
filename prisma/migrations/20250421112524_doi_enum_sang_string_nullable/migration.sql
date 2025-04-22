/*
  Warnings:

  - The `trang_thai_don_hang` column on the `DonHang` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `phuong_thuc_thanh_toan` column on the `DonHang` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `trang_thanh_toan` on the `HoaDon` table. All the data in the column will be lost.
  - You are about to drop the column `chieu_dai_tay_ao` on the `SoDoDatMay` table. All the data in the column will be lost.
  - You are about to drop the column `chieu_dai_tu_vai_toi_eo` on the `SoDoDatMay` table. All the data in the column will be lost.
  - You are about to drop the column `vong_bap_tay` on the `SoDoDatMay` table. All the data in the column will be lost.
  - You are about to drop the column `vong_co` on the `SoDoDatMay` table. All the data in the column will be lost.
  - You are about to drop the column `vong_co_tay` on the `SoDoDatMay` table. All the data in the column will be lost.
  - You are about to drop the column `vong_dau_goi` on the `SoDoDatMay` table. All the data in the column will be lost.
  - You are about to drop the column `vong_dui` on the `SoDoDatMay` table. All the data in the column will be lost.
  - You are about to drop the column `vong_khuy_tay` on the `SoDoDatMay` table. All the data in the column will be lost.
  - You are about to drop the column `vong_ong_quan` on the `SoDoDatMay` table. All the data in the column will be lost.
  - Changed the type of `trang_thai` on the `GiaoHang` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `trang_thai_thanh_toan` to the `HoaDon` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `paymentMethod` on the `ThanhToan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `paymentStatus` on the `ThanhToan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "DonHang" DROP COLUMN "trang_thai_don_hang",
ADD COLUMN     "trang_thai_don_hang" TEXT,
DROP COLUMN "phuong_thuc_thanh_toan",
ADD COLUMN     "phuong_thuc_thanh_toan" TEXT;

-- AlterTable
ALTER TABLE "GiaoHang" DROP COLUMN "trang_thai",
ADD COLUMN     "trang_thai" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "HoaDon" DROP COLUMN "trang_thanh_toan",
ADD COLUMN     "trang_thai_thanh_toan" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NguoiDung" ALTER COLUMN "firebaseId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SoDoDatMay" DROP COLUMN "chieu_dai_tay_ao",
DROP COLUMN "chieu_dai_tu_vai_toi_eo",
DROP COLUMN "vong_bap_tay",
DROP COLUMN "vong_co",
DROP COLUMN "vong_co_tay",
DROP COLUMN "vong_dau_goi",
DROP COLUMN "vong_dui",
DROP COLUMN "vong_khuy_tay",
DROP COLUMN "vong_ong_quan";

-- AlterTable
ALTER TABLE "ThanhToan" DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" TEXT NOT NULL,
DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" TEXT NOT NULL;

-- DropEnum
DROP TYPE "PhuongThucThanhToan";

-- DropEnum
DROP TYPE "TrangThaiDonHang";

-- DropEnum
DROP TYPE "TrangThaiThanhToan";
