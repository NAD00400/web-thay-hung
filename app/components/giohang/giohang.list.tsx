'use client';
import CartActions from "@/app/components/giohang/giohang.action.xoa";
import { useUser } from "@/app/lib/context";
import {
  fetchGioHangByCustomerId,
  fetchKhachHangByNguoiDungId,
  fetchNguoiDungByFirebaseId
} from "@/app/lib/fetchData";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import QuantityAdjuster from "./giohang.action.sua";

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
  const { user, loading } = useUser();
  const [cartItems, setCartItems] = useState<CartItemApi[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>(null);

  useEffect(() => {
    if (!user || loading) return;

    const fetchData = async () => {
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
        console.log("cartResponse", JSON.stringify(cartResponse, null, 2));

        // Lấy phần tử đầu tiên nếu có
        const cart: CartItemApi[] = cartResponse?.[0]?.chi_tiet_gio_hang || [];
        console.log("Local cart variable:", cart);
        setCartItems(cart);

        // Tính tổng tiền dựa trên giá trong san_pham và số lượng
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
    };

    fetchData();
  }, [user, loading]);

  // Sử dụng useEffect để log khi cartItems cập nhật (để kiểm tra)
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
          so_luong: newQuantity,
        }),
      });
  
      const result = await res.json();
  
      if (!res.ok) {
        console.error("Server error:", result);
        throw new Error("Failed to update quantity");
      }
  
      console.log("Updated quantity:", result);
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
    }
  }  
  
  if (!user && !loading)
    return <p className="text-center text-red-500">Bạn chưa đăng nhập.</p>;

  if (isLoading)
    return <p className="text-center text-gray-400">Đang tải giỏ hàng...</p>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <Card key={item.ma_chi_tiet_gio_hang} className="shadow-lg">
              <CardHeader>
                <CardTitle>{item.san_pham.ten_san_pham}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={item.san_pham.url_image}
                  alt={item.san_pham.ten_san_pham}
                  className="w-full h-64 object-cover"
                />
                <p>
                  Giá: {item.san_pham.gia_tien.toLocaleString()} VND
                </p>
                <p>Số lượng: {item.so_luong}</p>
              </CardContent>
              <CardFooter>
              <QuantityAdjuster
                itemId={item.ma_chi_tiet_gio_hang}
                currentQuantity={item.so_luong}
                onUpdate={(newQuantity) => {
                  // Gọi API cập nhật số lượng
                  updateCartQuantity(item.ma_chi_tiet_gio_hang, newQuantity);
                }}
              />

                <CartActions itemId={parseInt(item.ma_chi_tiet_gio_hang, 10)} />
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">Giỏ hàng trống</p>
        )}
      </div>
      <div className="mt-6 p-4 border-t">
        <h2 className="text-xl font-semibold">
          Tổng cộng: {totalPrice.toLocaleString()} VND
        </h2>
        {cartItems.length > 0 && <CartActions isCheckout />}
      </div>
    </>
  );
}
