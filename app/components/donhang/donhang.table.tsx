'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

// Hàm xác định màu sắc cho trạng thái đơn hàng
type OrderStatus = 'CHO_XAC_NHAN' | 'DA_XAC_NHAN' | 'DANG_GIAO' | 'HOAN_THANH' | 'DA_HUY';

const getStatusColor = (status: OrderStatus) => {
  const statusColors: Record<OrderStatus, string> = {
    CHO_XAC_NHAN: 'bg-neutral-200 text-neutral-700',
    DA_XAC_NHAN: 'bg-blue-200 text-blue-800',
    DANG_GIAO: 'bg-purple-200 text-purple-800',
    HOAN_THANH: 'bg-green-200 text-green-800',
    DA_HUY: 'bg-red-200 text-red-800',
  };
  return statusColors[status];
};

const getStatusText = (status: string | number): string => {
  const statusMap: Record<OrderStatus, string> = {
    CHO_XAC_NHAN: 'Chờ xác nhận',
    DA_XAC_NHAN: 'Đã xác nhận',
    DANG_GIAO: 'Đang giao',
    HOAN_THANH: 'Hoàn thành',
    DA_HUY: 'Đã hủy',
  };
  return statusMap[status as OrderStatus] || 'Không xác định';
};
interface Order {
  so_dien_thoai: string;
  dia_chi_nhan_hang: string;
  ma_don_hang: string;
  ma_khach_hang: string;
  ngay_dat_hang: string;
  trang_thai_don_hang: OrderStatus;
  tong_tien_don_hang: number;
  phuong_thuc_thanh_toan: string;
  thanh_toan_thanh_cong: boolean;
  ghi_chu?: string | null;
  ngay_cap_nhat: string;
  khach_hang: {
    ma_khach_hang: string;
    ten_khach_hang: string;
    ma_nguoi_dung: string;
    so_dien_thoai: string;
    dia_chi_khach_hang: string;
    nguoi_dung: {
      ma_nguoi_dung: string;
      email_nguoi_dung: string;
      ten_nguoi_dung: string;
      vai_tro: string;
      ngay_tao: string;
      ngay_cap_nhat: string;
      link_anh_dai_dien: string;
      firebaseId: string;
    };
  };
  chi_tiet_don_hang: {
    ma_chi_tiet_don_hang: string;
    ma_don_hang: string;
    ma_san_pham: string;
    so_luong: number;
    gia_tien: number;
    san_pham: {
      ma_san_pham_dat_may: string;
      ma_danh_muc: string;
      ten_san_pham: string;
      gia_tien: number;
      mo_ta_san_pham: string;
      url_image: string;
      ngay_tao: string;
      ngay_cap_nhat: string;
      co_san: boolean;
      ma_phu_lieu?: string | null;
    };
  }[];
}

export default function DonHangDropdown({ dataOrder }: { dataOrder: Order[] }) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  return (
    <div className="p-6">
      <table className="min-w-full table-auto bg-white/40 backdrop-blur-lg shadow-lg rounded-xl overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            {['Mã Đơn Hàng', 'Mã Khách Hàng', 'Ngày Đặt', 'Trạng Thái', 'Tổng Tiền', 'Thanh Toán', 'Hành Động'].map(
              (header) => (
                <th key={header} className="px-4 py-3 text-left font-semibold text-gray-800 border-b border-neutral-200">
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {dataOrder && dataOrder.length > 0 ? (
            dataOrder.map((order) => (
              <>
                <tr
                  key={order.ma_don_hang}
                  className="border-b border-neutral-200 bg-white hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => setExpandedOrder(expandedOrder === order.ma_don_hang ? null : order.ma_don_hang)}
                >
                  <td className="px-4 py-3">{order.ma_don_hang}</td>
                  <td className="px-4 py-3">{order.ma_khach_hang}</td>
                  <td className="px-4 py-3">{new Date(order.ngay_dat_hang).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-lg font-medium ${getStatusColor(order.trang_thai_don_hang)}`}>
                      {getStatusText(order.trang_thai_don_hang)}
                    </span>
                  </td>
                  <td className="px-4 py-3">{order.tong_tien_don_hang.toLocaleString()} VND</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${order.thanh_toan_thanh_cong ? 'text-green-700' : 'text-red-700'}`}>
                      {order.thanh_toan_thanh_cong ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button className="bg-blue-500 text-white px-3 py-1 rounded">Chi tiết</Button>
                  </td>
                </tr>
                {expandedOrder === order.ma_don_hang && (
                  <tr className="bg-gray-50">
                    <td colSpan={7} className="p-4">
                      <div className="bg-white p-4 shadow rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Chi Tiết Đơn Hàng: {order.ma_don_hang}</h2>
                        <p>📍 Địa chỉ giao hàng: {order.dia_chi_nhan_hang || 'Không có thông tin'}</p>
                        <p>📞 Số điện thoại: {order.so_dien_thoai || 'N/A'}</p>
                        <p>💳 Phương thức thanh toán: {order.phuong_thuc_thanh_toan || 'Không rõ'}</p>
                        <p>📝 Ghi chú: {order.ghi_chu || 'Không có ghi chú'}</p>
                        <h3 className="text-lg font-semibold mt-4">Thông tin khách hàng:</h3>
                        <p>👤 Tên khách hàng: {order.khach_hang?.ten_khach_hang || 'Không rõ'}</p>
                        <p>📧 Email: {order.khach_hang?.nguoi_dung?.email_nguoi_dung || 'Không rõ'}</p>
                        <p>🏠 Địa chỉ: {order.khach_hang?.dia_chi_khach_hang || 'Không rõ'}</p>
                        <h3 className="text-lg font-semibold mt-4">Sản phẩm đặt may:</h3>
                        {order.chi_tiet_don_hang?.map((detail, index) => (
                          <div key={index} className="border p-3 mt-2 rounded-lg flex justify-between gap-2">
                            <div>
                              <p>🧵 {detail.san_pham?.ten_san_pham}</p>
                              <p>💵 Giá: {detail.san_pham?.gia_tien?.toLocaleString('vi-VN')} VND</p>
                              <p>📦 Số lượng: {detail.so_luong}</p>
                              <p>🖋️ Mô tả: {detail.san_pham?.mo_ta_san_pham || 'Không có mô tả'}</p>
                            </div>
                            <img
                              src={detail.san_pham?.url_image || '/placeholder-image.png'}
                              alt={detail.san_pham?.ten_san_pham || 'Hình sản phẩm'}
                              className="w-20 h-20 object-cover mt-2 rounded"
                            />
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-800">
                Không có đơn hàng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}