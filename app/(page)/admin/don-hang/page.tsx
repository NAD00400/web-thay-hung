"use client";

import React, { useEffect, useState } from "react";

// Interface cho dữ liệu đơn hàng
interface Order {
  ma_don_hang: string;
  ma_khach_hang: string;
  ngay_dat_hang: string;
  trang_thai_don_hang: string;
  tong_tien_don_hang: number;
  phuong_thuc_thanh_toan: string;
  thanh_toan_thanh_cong: boolean;
  ghi_chu: string | null;
  ngay_cap_nhat: string;
}

const OrderManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch dữ liệu đơn hàng từ API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/don-hang"); // Cập nhật API phù hợp
        const data: Order[] = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-indigo-300 p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Quản Lý Đơn Hàng Đặt May</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Mã Đơn Hàng</th>
              <th className="px-4 py-2 text-left">Mã Khách Hàng</th>
              <th className="px-4 py-2 text-left">Ngày Đặt</th>
              <th className="px-4 py-2 text-left">Trạng Thái</th>
              <th className="px-4 py-2 text-left">Tổng Tiền</th>
              <th className="px-4 py-2 text-left">Thanh Toán</th>
              <th className="px-4 py-2 text-left">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">Đang tải dữ liệu...</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.ma_don_hang} className="border-b">
                  <td className="px-4 py-2">{order.ma_don_hang}</td>
                  <td className="px-4 py-2">{order.ma_khach_hang}</td>
                  <td className="px-4 py-2">{new Date(order.ngay_dat_hang).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded ${getStatusColor(order.trang_thai_don_hang)}`}>
                      {getStatusText(order.trang_thai_don_hang)}
                    </span>
                  </td>
                  <td className="px-4 py-2">{order.tong_tien_don_hang.toLocaleString()} VND</td>
                  <td className="px-4 py-2">
                    {order.thanh_toan_thanh_cong ? (
                      <span className="text-green-600">Đã thanh toán</span>
                    ) : (
                      <span className="text-red-600">Chưa thanh toán</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                      Chi Tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Hàm xác định màu sắc cho trạng thái đơn hàng
const getStatusColor = (status: string): string => {
  switch (status) {
    case "CHO_XAC_NHAN":
      return "bg-yellow-200 text-yellow-800";
    case "DA_XAC_NHAN":
      return "bg-blue-200 text-blue-800";
    case "DANG_GIAO":
      return "bg-purple-200 text-purple-800";
    case "HOAN_THANH":
      return "bg-green-200 text-green-800";
    case "DA_HUY":
      return "bg-red-200 text-red-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

// Hàm hiển thị trạng thái đơn hàng
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    CHO_XAC_NHAN: "Chờ xác nhận",
    DA_XAC_NHAN: "Đã xác nhận",
    DANG_GIAO: "Đang giao",
    HOAN_THANH: "Hoàn thành",
    DA_HUY: "Đã hủy",
  };
  return statusMap[status] || "Không xác định";
};

export default OrderManagementPage;
