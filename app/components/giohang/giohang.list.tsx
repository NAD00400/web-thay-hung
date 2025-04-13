"use client";
import OrderModal from "./giohang.action.dathang";
import CartActions from "@/app/components/giohang/giohang.action.xoa";
import { useUser } from "@/app/lib/context";
import {
  fetchGioHangByCustomerId,
  fetchKhachHangByNguoiDungId,
  fetchNguoiDungByFirebaseId
} from "@/app/lib/fetchData";
import { Card } from "@/components/ui/card";
import { useEffect, useState, useCallback } from "react";
import QuantityAdjuster from "./giohang.action.sua";
import { Button } from "@/components/ui/button";

// Các kiểu dữ liệu trả về từ API
interface SanPham {
  ten_san_pham: string;
  url_image: string;
  gia_tien: number;
}

interface CartItemApi {
  ma_chi_tiet_gio_hang: string;
  ma_gio_hang: string;
  ma_san_pham_dat_may: string;
  san_pham: SanPham;
  so_luong: number;
}

interface CartResponse {
  ma_gio_hang: string;
  ma_khach_hang: string;
  chi_tiet_gio_hang: CartItemApi[];
}

export default function GioHangClient() {
  const [isOpenDatHang, setIsOpenDatHang] = useState(false);
  const { user, loading } = useUser();
  const [cartItems, setCartItems] = useState<CartItemApi[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>(null);

  // Định nghĩa hàm fetch dữ liệu riêng
  const fetchCartData = useCallback(async () => {
    if (!user || loading) return;
    try {
      setIsLoading(true);
      // Lấy thông tin người dùng từ Firebase
      const firebaseId = user.uid;
      const fetchedUserData = await fetchNguoiDungByFirebaseId(firebaseId);
      if (!fetchedUserData?.ma_nguoi_dung) {
        throw new Error("Không tìm thấy người dùng trong hệ thống.");
      }
      setUserData(fetchedUserData);

      // Lấy thông tin khách hàng
      const fetchedCustomerData = await fetchKhachHangByNguoiDungId(fetchedUserData.ma_nguoi_dung);
      setCustomerData(fetchedCustomerData);

      // Lấy giỏ hàng của khách hàng (API trả về một mảng các giỏ hàng)
      const cartResponse: CartResponse[] = await fetchGioHangByCustomerId(fetchedCustomerData.ma_khach_hang);

      // Lấy phần tử đầu tiên nếu có
      const cart: CartItemApi[] = cartResponse?.[0]?.chi_tiet_gio_hang || [];
      console.log("Local cart variable:", cart);
      setCartItems(cart);

      // Tính tổng tiền dựa trên giá của sản phẩm và số lượng
      if (cart.length > 0) {
        const total = cart.reduce(
          (sum, item) => sum + item.san_pham.gia_tien * item.so_luong,
          0
        );
        setTotalPrice(total);
      } else {
        setTotalPrice(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user, loading]);

  useEffect(() => {
    fetchCartData();
  }, [user, loading, fetchCartData]);

  // Debug: in log khi cartItems cập nhật
  useEffect(() => {
    console.log("Updated cartItems:", cartItems);
  }, [cartItems]);

  async function updateCartQuantity(itemId: string, newQuantity: number) {
    try {
      const res = await fetch(`/api/gio-hang-chi-tiet/update-quantity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ma_chi_tiet_gio_hang: itemId,
          so_luong_moi: newQuantity,
        }),
      });
  
      const result = await res.json();
  
      if (!res.ok) {
        console.error("Server error:", result);
        throw new Error("Failed to update quantity");
      }
  
      console.log("Updated quantity:", result);
      // Sau khi update thành công, gọi lại hàm fetchCartData để làm mới dữ liệu
      await fetchCartData();
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
    }
  }

  if (!user && !loading)
    return <p className="text-center text-red-500">Bạn chưa đăng nhập.</p>;

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 p-4 animate-pulse">
        {/* LEFT: Danh sách sản phẩm */}
        <div className="w-full lg:w-2/3 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="flex gap-4 p-4 border border-neutral-200 rounded-xl">
              <div className="w-24 h-24 bg-gray-200 rounded-md" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="flex gap-2 mt-4">
                  <div className="h-8 w-24 bg-gray-200 rounded" />
                  <div className="h-8 w-16 bg-gray-200 rounded" />
                </div>
              </div>
            </Card>
          ))}
        </div>
  
        {/* RIGHT: Tổng cộng */}
        <div className="w-full lg:w-1/3">
          <Card className="p-6 space-y-4 sticky top-6">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-5 bg-gray-200 rounded w-1/2" />
            <div className="h-10 bg-gray-200 rounded w-full mt-4" />
          </Card>
        </div>
      </div>
    );
  }
  

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      {/* LEFT: Danh sách sản phẩm */}
      <div className="w-full lg:w-2/3 space-y-4">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <Card key={item.ma_chi_tiet_gio_hang} className="flex gap-4 p-4 shadow-sm rounded-xl border border-neutral-200">
              <img
                src={item.san_pham.url_image}
                alt={item.san_pham.ten_san_pham}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-base">{item.san_pham.ten_san_pham}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Giá: {item.san_pham.gia_tien.toLocaleString()} VND
                  </p>
                  <p className="text-sm text-gray-500">Số lượng: {item.so_luong}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <QuantityAdjuster
                    itemId={item.ma_chi_tiet_gio_hang}
                    currentQuantity={item.so_luong}
                    onUpdate={(newQuantity) => {
                      updateCartQuantity(item.ma_chi_tiet_gio_hang, newQuantity);
                    }}
                  />
                  <CartActions itemId={parseInt(item.ma_chi_tiet_gio_hang, 10)} />
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">Giỏ hàng trống</p>
        )}
      </div>
  
      {/* RIGHT: Thông tin tổng cộng */}
      <div className="w-full lg:w-1/3">
        <Card className="p-6 shadow-xl sticky top-6">
          <h2 className="text-xl font-semibold mb-4">Tổng cộng</h2>
          <p className="text-lg text-neutral-800 mb-2">
            {totalPrice.toLocaleString()} VND
          </p>
    
          {/* Nút mở modal OrderModal */}
          {cartItems.length > 0 && (
            <Button className="w-full mt-4" onClick={() => setIsOpenDatHang(true)}>
              Đặt hàng
            </Button>
          )}
        </Card>
      </div>
  
      <OrderModal
        isOpen={isOpenDatHang}
        onClose={() => setIsOpenDatHang(false)}
        products={cartItems.map(item => ({
          ten_san_pham: item.san_pham.ten_san_pham,
          url_image: item.san_pham.url_image,
          so_luong: item.so_luong,
          gia_tien: item.san_pham.gia_tien,
        }))}
      />
    </div>
  );
}
