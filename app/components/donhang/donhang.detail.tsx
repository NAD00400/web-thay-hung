'use client'

import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import React from "react";

interface Product {
    ten_san_pham: string;
    url_image: string;
    gia_tien: number;
}

interface Measurement {
    vong_nguc: number;
    vong_eo: number;
    vong_hong: number;
}

interface OrderItem {
    san_pham: Product;
    so_luong: number;
    SoDoDatMay?: Measurement;
}

interface Order {
    ma_don_hang: string;
    ngay_dat_hang: string;
    phuong_thuc_giao_hang?: string;
    trang_thai_don_hang: string;
    tong_tien_don_hang: number;
    thanh_toan_thanh_cong: boolean;
    dia_chi_nhan_hang?: string;
    so_dien_thoai?: string;
    chi_tiet_don_hang: OrderItem[];
}

interface OrderDetailProps {
    order: Order | null;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order }) => {
    if (!order) {
        return <p className="text-center text-gray-500">Đang tải dữ liệu...</p>;
    }

    const goback = () => {
        redirect('/admin/don-hang');
    };

    return (
        <div className="w-full h-screen pb-8 px-8 pt-2 backdrop-blur-lg shadow-xl text-white bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
          {/* Nút quay lại */}
          <div className="mb-4">
            <Button onClick={goback} className="bg-white/20 hover:bg-white/30 text-white px-4  rounded-full">
              ← Trở về
            </Button>
          </div>
      
          {/* Vùng nội dung cuộn */}
          <div
  className="max-h-[85vh] overflow-y-auto pr-3 space-y-10"
  style={{scrollbarWidth: "none", msOverflowStyle: "none",}}
>
  <style jsx>{`div::-webkit-scrollbar {display: none; }`}</style>
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold">🧾 Chi Tiết Đơn Hàng</h1>
              <p className="text-white/70 text-lg">
                Mã đơn hàng: <span className="font-semibold text-white">{order.ma_don_hang}</span>
              </p>
            </div>
      
            {/* Thông tin đơn hàng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
              {[
                { label: '📅 Ngày đặt hàng', value: new Date(order.ngay_dat_hang).toLocaleDateString("vi-VN") },
                { label: '🚚 Phương thức giao hàng', value: order.phuong_thuc_giao_hang || "Không xác định" },
                { label: '📦 Trạng thái đơn hàng', value: order.trang_thai_don_hang },
                {
                  label: '💰 Tổng tiền',
                  value: `${order.tong_tien_don_hang.toLocaleString("vi-VN")} VND`,
                  className: 'text-yellow-300',
                },
                {
                  label: '💳 Thanh toán',
                  value: order.thanh_toan_thanh_cong ? "Đã thanh toán" : "Chưa thanh toán",
                  className: order.thanh_toan_thanh_cong ? 'text-green-400' : 'text-red-400',
                },
                { label: '📍 Địa chỉ giao hàng', value: order.dia_chi_nhan_hang || "Không có thông tin" },
                { label: '📞 Số điện thoại', value: order.so_dien_thoai || "N/A" },
              ].map((item, index) => (
                <div key={index} className="bg-white/10 p-5 rounded-xl shadow-inner border border-white/10">
                  <p className="text-white/80 mb-1">{item.label}</p>
                  <p className={`font-semibold ${item.className || 'text-white'}`}>{item.value}</p>
                </div>
              ))}
            </div>
      
            {/* Danh sách sản phẩm */}
            <div>
              <h2 className="text-3xl font-semibold text-center mb-6">🧵 Sản phẩm đặt may</h2>
              <div className="space-y-6">
                {order.chi_tiet_don_hang.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row items-center gap-6 bg-white/5 p-6 rounded-2xl shadow-lg border border-white/10"
                  >
                    {/* Ảnh sản phẩm */}
                    <img
                      src={item.san_pham?.url_image || "/placeholder.jpg"}
                      alt={item.san_pham?.ten_san_pham || "Không có hình ảnh"}
                      className="w-32 h-32 object-cover rounded-xl border border-white/20"
                    />
      
                    {/* Thông tin sản phẩm */}
                    <div className="flex-1 text-center md:text-left space-y-1">
                      <h3 className="text-xl font-semibold">{item.san_pham?.ten_san_pham}</h3>
                      <p className="text-white/80">
                        💵 Giá:{" "}
                        <span className="font-semibold">
                          {item.san_pham?.gia_tien?.toLocaleString("vi-VN")} VND
                        </span>
                      </p>
                      <p className="text-white/80">
                        📦 Số lượng: <span className="font-semibold">{item.so_luong}</span>
                      </p>
                      {item.SoDoDatMay && (
                        <p className="text-white/80">
                          📏 Số đo:{" "}
                          {item.SoDoDatMay.vong_nguc} - {item.SoDoDatMay.vong_eo} - {item.SoDoDatMay.vong_hong}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
       
};

export default OrderDetail;
