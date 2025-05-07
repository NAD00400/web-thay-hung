"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser } from "@/app/lib/context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { log } from "console";
type SoDoType = {
  vong_nguc: number;
  vong_eo: number;
  vong_hong: number;
  be_ngang_vai: number;
  chieu_dai_ao: number;
  chieu_dai_quan: number;
};
export default function TrangThanhToanVaGioHang() {
  const { user } = useUser();
  const isGuest = !user;
  const router = useRouter();
  const [dsSoDo, setDsSoDo] = useState<Record<string, SoDoType>>({});
  
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hoTen, setHoTen] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [phuongThucThanhToan, setPhuongThucThanhToan] = useState("cod");
  const [cachthucnhanhang, setCachthucnhanhang] = useState("taicuahang");
  const [tuvansodo, setTuvansodo] = useState("co");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [hasSynced, setHasSynced] = useState(false);
  // Load giỏ hàng
   useEffect(() => {
      async function syncTempCartToDatabase() {
        if (hasSynced || !user?.customer?.ma_khach_hang) return;
    
        const tempCart = JSON.parse(sessionStorage.getItem("temp_cart") || "[]");
        if (tempCart.length === 0) return;
    
        try {
          for (const item of tempCart) {
            await fetch("/api/gio-hang", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                productId: item.id,
                customerId: user.customer.ma_khach_hang,
              }),
            });
          }
          sessionStorage.removeItem("temp_cart");
          alert("Đã đồng bộ giỏ hàng tạm thời vào tài khoản!");
          setHasSynced(true); // ✅ Ngăn chạy lại
        } catch (error) {
          console.error("Lỗi khi đồng bộ giỏ hàng:", error);
        }
      }
    
      syncTempCartToDatabase();
    }, [user?.customer?.ma_khach_hang, hasSynced]);
  
  useEffect(() => {
    if (isGuest) {
      const storedCart = JSON.parse(sessionStorage.getItem("temp_cart") || "[]");
      setCartItems(storedCart);
      
    } else {
      const userCart = user.customer?.GioHang?.[0]?.chi_tiet_gio_hang || [];
      setCartItems(userCart);
    }
  }, [user]);

  // Tổng tiền
  const totalPrice = cartItems.reduce((total, item) => {
    const price = item?.san_pham?.gia_tien ?? item?.price ?? 0;
    return total + item.so_luong * price;
  }, 0);
  const anySelected = cartItems.some(item => item.isSelected);
  // Cập nhật số lượng
  const handleUpdateQuantity = async (id: string | number, newQuantity: number) => {
    if (newQuantity < 1) return;

    if (isGuest) {
      const updatedCart = cartItems.map((item, index) =>
        index === id ? { ...item, so_luong: newQuantity } : item
      );
      sessionStorage.setItem("temp_cart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
    } else {
      try {
        const res = await fetch("/api/gio-hang-chi-tiet/update-quantity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ma_chi_tiet_gio_hang: id, so_luong_moi: newQuantity }),
        });

        if (res.ok) {
          const { data } = await res.json();
          setCartItems(prev =>
            prev.map(item =>
              item.ma_chi_tiet_gio_hang === id ? { ...item, so_luong: data.so_luong } : item
            )
          );
        } else {
          console.error("Lỗi khi cập nhật:", await res.json());
        }
      } catch (err) {
        console.error("Lỗi mạng:", err);
      }
    }
  };

  // Xoá sản phẩm
  const handleDeleteItem = async (id: string | number) => {
    if (isGuest) {
      const updatedCart = cartItems.filter((_, index) => index !== id);
      sessionStorage.setItem("temp_cart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
    } else {
      try {
        const res = await fetch(`/api/gio-hang-chi-tiet/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setCartItems(prev => prev.filter(item => item.ma_chi_tiet_gio_hang !== id));
        } else {
          console.error("Lỗi khi xoá:", await res.json());
        }
      } catch (err) {
        console.error("Lỗi mạng:", err);
      }
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!hoTen.trim()) newErrors.hoTen = "Họ tên không được để trống.";
    if (!soDienThoai.trim()) newErrors.soDienThoai = "SĐT không được để trống.";
    if (!diaChi.trim()) newErrors.diaChi = "Địa chỉ không được để trống.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
// Trong component của em
    async function handlePlaceOrder() {
      if (!validate()) {
        alert("Vui lòng kiểm tra lại thông tin.");
        return;
      }
      setIsLoading(true);
      try {
        const maKhachHang = user?.customer?.ma_khach_hang || null; // hoặc để null với guest
        const chiTietDonHang = cartItems
  .filter(item => item.isSelected)
  .map((item, index) => {
    const idKey = isGuest ? index.toString() : item.ma_chi_tiet_gio_hang;

    // Lấy ma_san_pham từ sản phẩm
    const maSanPham = item.san_pham?.ma_san_pham_dat_may;
    if (!maSanPham) {
      throw new Error("Không xác định được mã sản phẩm cho item " + idKey);
    }

    // Default số đo
    const defaultSoDo: SoDoType = {
      vong_nguc: 0,
      vong_eo: 0,
      vong_hong: 0,
      be_ngang_vai: 0,
      chieu_dai_ao: 0,
      chieu_dai_quan: 0,
    };
    const soDo = dsSoDo[idKey] ?? defaultSoDo;

    return {
      ma_san_pham: maSanPham,
      so_luong: item.so_luong,
      gia_tien: item.san_pham?.gia_tien ?? item.price,
      so_do: soDo,
    };
  });

        const ghiChu = '';
        const thanhToan = {
          paymentMethod: phuongThucThanhToan,
          paymentStatus: "CHUA_THANH_TOAN",
          transactionId: "",
          paymentType: "THANH_TOAN_TOAN_BO",
        };
        // Giao hàng: tại cửa hàng
        const giaoHang = {
          phi_van_chuyen: 0,
          dia_chi_giao_hang: "Nhận tại cửa hàng",
          ngay_giao_du_kien: null,
        };

        const res = await fetch("/api/don-hang", {    // đổi đường dẫn cho đúng file POST handler
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ma_khach_hang: maKhachHang,
            phuong_thuc_thanh_toan: phuongThucThanhToan,
            chi_tiet_don_hang: chiTietDonHang,
            ghi_chu: ghiChu,
            thanh_toan: thanhToan,
            giao_hang: giaoHang,
          }),
        });
        const data = await res.json();
        if (data) {
          alert("Đặt hàng thành công!");
          router.push(`./don-hang/${data.donHang.ma_don_hang}`);
        } else {
          console.error(data);
          alert("Lỗi khi tạo đơn hàng: " + (data.error || "Không xác định"));
        }
      } catch (err) {
        console.error(err);
        alert("Lỗi mạng khi tạo đơn hàng.");
      } finally {
        setIsLoading(false);
      }
    }

  async function handlePayment() {
    // Nếu chọn lấy tại cửa hàng thì đặt hàng
    if (cachthucnhanhang === "taicuahang") {
      await handlePlaceOrder();
      return;
    }
    
    // Ngược lại vẫn quay về flow VNPAY
    if (!validate()) {
      alert("Vui lòng kiểm tra lại thông tin.");
      return;
    }
    if (cachthucnhanhang === "taicuahang" && !anySelected) {
      alert("Vui lòng chọn ít nhất một sản phẩm để đặt hàng.");
      return;
    }
    for (const [index, item] of cartItems.entries()) {
      if (item.isSelected) {
        const idKey = isGuest ? index.toString() : item.ma_chi_tiet_gio_hang;
        if (!dsSoDo[idKey]) {
          alert(`Chưa nhập số đo cho sản phẩm ${item.san_pham?.ten_san_pham || item.name}`);
          return;
        }
      }
    }
    
    setIsLoading(true);
    try {
      const orderId = crypto.randomUUID?.() || `DH-${Date.now()}`;
      const res = await fetch("/api/create-payment-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
          orderId,
          orderDescription: `Thanh toán đơn hàng ${orderId}`,
        }),
      });
      const { paymentUrl } = await res.json();
      if (paymentUrl) window.location.href = paymentUrl;
      else alert("Không tạo được link thanh toán.");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi gọi VNPay API.");
    } finally {
      setIsLoading(false);
    }
  }

  
  const handleToggleSelect = (index: number) => {
    setCartItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], isSelected: !copy[index].isSelected };
      return copy;
    });
  };
  function handleChange(
    idKey: string,
    field: keyof SoDoType,
    value: number
  ) {
    setDsSoDo(prev => ({
      ...prev,
      [idKey]: {
        ...prev[idKey],
        [field]: value,
      },
    }));
  }
  
  
  return (
    <div
      className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 "
    >
      {/* Danh sách giỏ hàng */}
      <section className="space-y-4">
  {cartItems.length > 0 ? (
    cartItems.map((item, index) => {
      console.log("Item:", item);
      
      // 1. Tính idKey duy nhất
      const idKey = isGuest
        ? index.toString()
        : item.ma_chi_tiet_gio_hang;

      // 2. Khởi tạo các biến
      const isSelected = item.isSelected ?? false;
      const name = isGuest ? item.name : item.san_pham?.ten_san_pham;
      const image = isGuest ? item.image : item.san_pham?.url_image;
      const price = item?.san_pham?.gia_tien ?? item?.price ?? 0;
      const quantity = item.so_luong;

      return (
        <div
          key={idKey}
          className="rounded-lg p-4 mb-6 space-y-4 border bg-gradient-to-r from-[#070030] to-[#000000]"
        >
          {/* === PHẦN ẢNH, TÊN, SỐ LƯỢNG, XOÁ, CHECKBOX === */}
          <div className="flex items-start gap-4">
            {/* Checkbox */}
            
            {/* Card nội dung */}
            <div className="flex flex-1 justify-between items-start gap-6">
              {/* Ảnh + Thông tin */}
              <div className="flex gap-4">
                <img
                  src={image}
                  alt={name || "Sản phẩm"}
                  className="w-24 h-24 object-cover rounded-md border"
                  style={{ borderColor: "#666" }}
                />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">{name}</h3>
                  <p className="text-sm text-gray-300">
                    {price.toLocaleString()} VND
                  </p>
                </div>
              </div>

              {/* Số lượng */}
              <div className="flex items-center gap-2 bg-white rounded-lg border">
                <Button
                  size="icon"
                  variant="outline"
                  className="border-none rounded-l-lg hover:text-gray-800"
                  onClick={() => handleUpdateQuantity(idKey, quantity - 1)}
                >
                  –
                </Button>
                <span className="px-4 text-sm border-l border-r border-gray-300">
                  {quantity}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  className="border-none rounded-r-lg hover:text-gray-800"
                  onClick={() => handleUpdateQuantity(idKey, quantity + 1)}
                >
                  +
                </Button>
              </div>

              {/* Nút Xoá */}
              <Button
                variant="outline"
                className="hover:bg-gray-600 hover:text-white"
                onClick={() => handleDeleteItem(idKey)}
              >
                Xoá
              </Button>
              <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleToggleSelect(index)}
              className="accent-white w-5 h-5 mt-1"
            />
            </div>
          </div>

          {/* === PHẦN THÔNG TIN SỐ ĐO === */}
          {isSelected && (
            <div
              className="rounded-md p-4 bg-[#030014]"
              style={{ border: "1px solid #555" }}
            >
              <h4 className="text-sm font-semibold text-white mb-3">
                Thông tin số đo
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "vong_nguc",
                  "vong_eo",
                  "vong_hong",
                  "be_ngang_vai",
                  "chieu_dai_ao",
                  "chieu_dai_quan",
                ].map((field) => (
                  <div key={field}>
                    <label className="block text-sm text-white capitalize mb-1">
                      {field.replaceAll("_", " ")}
                    </label>
                    <input
                      type="number"
                      value={dsSoDo[idKey]?.[field as keyof SoDoType] ?? 0}
                      onChange={(e) =>
                        handleChange(
                          idKey,
                          field as keyof SoDoType,
                          Number(e.target.value)
                        )
                      }
                      className="w-full bg-white text-black rounded-md px-3 py-2 text-sm focus:outline-none"
                      style={{ border: "1px solid #ccc" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    })
  ) : (
    <p className="text-gray-500 text-center">Giỏ hàng trống</p>
  )}
</section>


  
      {/* Form thanh toán */}
      <motion.section
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6 rounded-xl border space-y-6 sticky top-20 h-fit shadow-none text-white"
        style={{
          backgroundImage: "url('https://brojqgdjcljbprhn.public.blob.vercel-storage.com/imgBg/V%E1%BA%A3i%20l%E1%BB%A5a%20%C4%91en%20v%E1%BB%9Bi%20n%E1%BA%BFp%20g%E1%BA%A5p-2oiYvTXDlZNGB9FL8X3QnbiM6JJYj0.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >

        <h2 className="text-2xl  font-bold mb-4">Thông tin thanh toán</h2>
  
        <div className="space-y-3 ">
          <div>
            <Label htmlFor="hoTen">Họ tên</Label>
            <Input
              id="hoTen"
              value={hoTen}
              onChange={(e) => setHoTen(e.target.value)}
              className="mt-1"
            />
            {errors.hoTen && (
              <p className="text-sm text-destructive mt-1">{errors.hoTen}</p>
            )}
          </div>
          <div>
            <Label htmlFor="soDienThoai">Số điện thoại</Label>
            <Input
              id="soDienThoai"
              value={soDienThoai}
              onChange={(e) => setSoDienThoai(e.target.value)}
              className="mt-1"
            />
            {errors.soDienThoai && (
              <p className="text-sm text-destructive mt-1">
                {errors.soDienThoai}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="diaChi">Địa chỉ giao hàng</Label>
            <Input
              id="diaChi"
              value={diaChi}
              onChange={(e) => setDiaChi(e.target.value)}
              className="mt-1"
            />
            {errors.diaChi && (
              <p className="text-sm text-destructive mt-1">{errors.diaChi}</p>
            )}
          </div>
        </div>
        <div>
          <Label className="mb-2 block">Tư vấn số đo (nếu chưa có số đo hoặc thay đổi)</Label>
          <RadioGroup
            value={tuvansodo}
            onValueChange={setTuvansodo}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2"><div className="flex items-center space-x-2">
              <RadioGroupItem value="co" id="co" className="text-white "/>
              <Label htmlFor="co">Có</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="khong" id="khong"  className="text-white "  />
              <Label htmlFor="khong">Không</Label>
            </div>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label className="mb-2 block">Phương thức thanh toán</Label>
          <RadioGroup
            value={phuongThucThanhToan}
            onValueChange={setPhuongThucThanhToan}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cod" id="cod"  className="text-white "  />
              <Label htmlFor="cod">Thanh toán bằng tiềng mặt</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="vnpay" id="vnpay" className="text-white " disabled/>
              <Label htmlFor="vnpay">Thanh toán qua VNPay <span className="text-gray-500"> ( đang phát triển )</span></Label>
            </div>
            
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label className="mb-2 block">Cách thức nhận hàng</Label>
          <RadioGroup
            defaultValue={cachthucnhanhang}
            onValueChange={setCachthucnhanhang}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="taicuahang" id="taicuahang"  className="text-white "  />
              <Label htmlFor="taicuahang">Nhận hàng tại cửa hàng</Label>
            </div>
              <RadioGroupItem value="ghtk" id="ghtk" className="text-white " disabled/>
              <Label htmlFor="ghtk">Giao Hàng tiết kiệm <span className="text-gray-500"> ( đang phát triển )</span></Label>
            </div>
          </RadioGroup>
        </div>
        
  
        <div className="pt-4 border-t flex items-center justify-between">
          <p className="text-xl font-semibold text-white">
            Tổng: {totalPrice.toLocaleString()} VND
          </p>
          <Button
            className="text-black"
            onClick={handlePayment}
            disabled={isLoading || !anySelected}
            style={{
              backgroundImage:
                "url('https://brojqgdjcljbprhn.public.blob.vercel-storage.com/imgBg/V%E1%BA%A3i%20l%E1%BB%A5a%20%C4%91en%20v%E1%BB%9Bi%20n%E1%BA%BFp%20g%E1%BA%A5p-2oiYvTXDlZNGB9FL8X3QnbiM6JJYj0.png')",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            {isLoading && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-black" />
            )}
            {cachthucnhanhang === "taicuahang" ? "Đặt hàng" : "Thanh toán"}
          </Button>
        </div>
      </motion.section>
    </div>
  );
}