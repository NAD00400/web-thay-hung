/*
  Warnings:

  - You are about to drop the column `thanh_toan_thanh_cong` on the `DonHang` table. All the data in the column will be lost.
  - You are about to drop the column `tong_tien_don_hang` on the `DonHang` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DonHang" DROP COLUMN "thanh_toan_thanh_cong",
DROP COLUMN "tong_tien_don_hang";
