-- DropForeignKey
ALTER TABLE "KhachHang" DROP CONSTRAINT "KhachHang_ma_nguoi_dung_fkey";

-- AlterTable
ALTER TABLE "KhachHang" ALTER COLUMN "ma_nguoi_dung" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "KhachHang" ADD CONSTRAINT "KhachHang_ma_nguoi_dung_fkey" FOREIGN KEY ("ma_nguoi_dung") REFERENCES "NguoiDung"("ma_nguoi_dung") ON DELETE SET NULL ON UPDATE CASCADE;
