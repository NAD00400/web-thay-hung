"use client";


import { useUser } from "@/app/lib/context";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GioHangClient() {

  const { user } = useUser();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      const storedCart = JSON.parse(sessionStorage.getItem("temp_cart") || "[]");
      setCartItems(storedCart);
    } else {
      const userCart = user.customer?.GioHang?.[0]?.chi_tiet_gio_hang || [];
      setCartItems(userCart);
    }
  }, [user]);

  const totalPrice = cartItems.reduce(
    (total: number, item: any) =>
      total + item.so_luong * item.san_pham.gia_tien,
    0
  );

  const handleUpdateQuantity = async (ma_chi_tiet_gio_hang: string, newQuantity: number) => {
    if (newQuantity < 1) return;
  
    try {
      const res = await fetch("/api/gio-hang-chi-tiet/update-quantity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ma_chi_tiet_gio_hang, so_luong_moi: newQuantity }),
      });
  
      if (res.ok) {
        const data = await res.json();
        const updatedItem = data.data;
  
        setCartItems(prev =>
          prev.map(item =>
            item.ma_chi_tiet_gio_hang === ma_chi_tiet_gio_hang
              ? { ...item, so_luong: updatedItem.so_luong }
              : item
          )
        );
      } else {
        const err = await res.json();
        console.error("Lỗi khi cập nhật:", err.error);
      }
    } catch (err) {
      console.error("Lỗi mạng:", err);
    }
  };
  
  const handleDeleteItem = async (ma_chi_tiet_gio_hang: string) => {
    try {
      const res = await fetch(`/api/gio-hang-chi-tiet/${ma_chi_tiet_gio_hang}`, {
        method: "DELETE",
      });
  
      if (res.ok) {
        setCartItems(prev =>
          prev.filter(item => item.ma_chi_tiet_gio_hang !== ma_chi_tiet_gio_hang)
        );
      } else {
        const err = await res.json();
        console.error("Lỗi khi xoá:", err.error);
      }
    } catch (err) {
      console.error("Lỗi mạng:", err);
    }
  };  

  const handlePayment = async () => {
    if (cartItems.length === 0) return;
    setIsLoading(true);

    try {
      // Tạo orderId (hoặc lấy từ DB nếu bạn đã tạo đơn trước)
      const orderId =
        typeof crypto?.randomUUID === "function"
          ? crypto.randomUUID()
          : `DH-${Date.now()}`;
      const orderDescription = `Thanh toán đơn hàng ${orderId}`;

      const res = await fetch("/api/create-payment-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
          orderId,
          orderDescription,
          // nếu bạn muốn cho user chọn ngân hàng, truyền thêm bankCode ở đây
          // bankCode: selectedBankCode,
        }),
      });

      const data = await res.json();
      if (data.paymentUrl) {
        // Cách 1: dùng next/router
        // router.push(data.paymentUrl);

        // Cách 2: dùng window.location để redirect hẳn ra ngoài VNPay
        window.location.href = data.paymentUrl;
      } else {
        console.error("Không nhận được paymentUrl:", data);
      }
    } catch (error) {
      console.error("Lỗi khi gọi VNPay API:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      <div className="w-full lg:w-2/3 space-y-4">
        {cartItems.length > 0 ? (
          cartItems.map((item: any) => (
            <Card
              key={item.ma_chi_tiet_gio_hang}
              className="flex gap-4 p-4 rounded-xl border border-neutral-200 bg-white bg-opacity-40 backdrop-blur-lg"
              style={{
                backgroundImage: "url('https://brojqgdjcljbprhn.public.blob.vercel-storage.com/background/ChatGPT%20Image%2016_04_38%2019%20thg%204%2C%202025-GdY4eAayivsK57dCZKLgg35MYbD0t9.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: "auto", // để đảm bảo background bao phủ hết chiều cao
              }}
              
            >
              <img
                src={item.san_pham.url_image}
                alt={item.san_pham.ten_san_pham}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-base text-white">
                    {item.san_pham.ten_san_pham}
                  </h3>
                  <p className="text-sm text-gray-200 mt-1">
                    Giá: {item.san_pham.gia_tien.toLocaleString()} VND
                  </p>
                  <p className="text-sm text-gray-200">
                    Số lượng: {item.so_luong}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-2 justify-start items-center">
                    <Button
                      className="bg-neutral-950 text-white hover:bg-neutral-800 hover:text-white"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleUpdateQuantity(item.ma_chi_tiet_gio_hang, item.so_luong - 1)
                      }
                    >
                      -
                    </Button>
                    <span className="text-white font-medium">{item.so_luong}</span>
                    <Button
                      className="bg-neutral-950 text-white hover:bg-neutral-800 hover:text-white"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleUpdateQuantity(item.ma_chi_tiet_gio_hang, item.so_luong + 1)
                      }
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="ml-2"
                    onClick={() => handleDeleteItem(item.ma_chi_tiet_gio_hang)}
                  >
                    Xoá
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">
            {user ? "Giỏ hàng trống" : "Giỏ hàng tạm thời trống"}
          </p>
        )}
      </div>

      <div className="w-full lg:w-1/3" >
        <Card className="p-6 sticky top-6 bg-white bg-opacity-40 backdrop-blur-lg rounded-xl border border-neutral-200" style={{
                backgroundImage: "url('https://brojqgdjcljbprhn.public.blob.vercel-storage.com/background/ChatGPT%20Image%2016_04_38%2019%20thg%204%2C%202025-GdY4eAayivsK57dCZKLgg35MYbD0t9.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: "auto",
              }}>
          <h2 className="text-xl font-semibold mb-4 text-white">Tổng cộng</h2>
          <p className="text-lg text-neutral-800 mb-2 font-bold">
            {totalPrice.toLocaleString()} VND
          </p>
          {cartItems.length > 0 && (
            <Button
            className="w-full mt-4"
            onClick={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? "Đang chuyển tới VNPay..." : "Đặt hàng & Thanh toán"}
          </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
function uuidv4() {
  throw new Error("Function not implemented.");
}

