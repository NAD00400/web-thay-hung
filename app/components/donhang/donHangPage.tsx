'use client';

import ChiTietDonHangList from '@/app/components/donhang/ChiTietDonHangList';
import DonHangInfo from '@/app/components/donhang/DonHangInfo';
import GiaoHangInfo from '@/app/components/donhang/GiaoHangInfo';
import ThanhToanInfo from '@/app/components/donhang/ThanhToanInfo';
import { Card, CardContent } from '@/components/ui/card';

export default function DonHangPage({ data }: { data: any }) {
  const { giao_hang, thanh_toan, chi_tiet_don_hang, ...donHang } = data;

  if (!data) {
    return <div className="text-white p-6">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="min-h-screen pt-20 px-6 py-10 text-white bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cột trái: Thông tin đơn hàng + chi tiết đơn hàng */}
        <div className="space-y-6 col-span-1 md:col-span-2 lg:col-span-1">
          <Card className="rounded-xl border border-white/20 bg-white/5">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-lg text-gray-500 font-semibold mb-2">Thông tin đơn hàng</h2>
              <DonHangInfo donHang={donHang} />
              <h2 className="text-lg text-gray-500 font-semibold mb-2">Chi tiết đơn hàng</h2>
              <ChiTietDonHangList chiTietDonHang={chi_tiet_don_hang} />
            </CardContent>
          </Card>
        </div>

        {/* Cột phải: Giao hàng + Thanh toán */}
        <div className="space-y-6 col-span-1 lg:col-span-2">
          <Card className="rounded-xl border border-white/20 bg-white/5">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg text-gray-500 font-semibold">Thông tin giao hàng</h2>
              <GiaoHangInfo giaoHang={giao_hang} />
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-white/20 bg-white/5">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg text-gray-500 font-semibold">Thông tin thanh toán</h2>
              <ThanhToanInfo thanhToan={thanh_toan} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
