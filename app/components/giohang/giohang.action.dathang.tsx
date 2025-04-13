"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export interface ProductItem {
  ten_san_pham: string;
  url_image: string;
  so_luong: number;
  gia_tien: number;
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
}

export default function OrderModal({ isOpen, onClose, products }: OrderModalProps) {
  // Các state cho thông tin form
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("TIEN_MAT"); // Mặc định là TIEN_MAT
  const [orderNote, setOrderNote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // State cho multi-step form (5 bước: 0 -> 4)
  const [currentStep, setCurrentStep] = useState<number>(0);
  const totalSteps = 4; 

  const totalQuantity = products.reduce((acc, p) => acc + p.so_luong, 0);
  const totalPrice = products.reduce((acc, p) => acc + p.gia_tien * p.so_luong, 0);

  // Điều hướng bước tiếp theo, kèm validate các trường bắt buộc của từng bước
  const handleNext = () => {
    if (currentStep === 0) {
      if (!fullName || !phone) {
        toast.error("Vui lòng nhập đầy đủ Họ và tên cũng như Số điện thoại!");
        return;
      }
    }
    if (currentStep === 1) {
      if (!address) {
        toast.error("Vui lòng nhập đầy đủ địa chỉ giao hàng!");
        return;
      }
    }
    // Các bước 2 và 3 có thể không bắt buộc (orderNote là tùy chọn)
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Xử lý đặt hàng sau khi người dùng xác nhận bước cuối cùng (bước 4)
  const handleCheckout = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/don-hang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ho_ten: fullName,
          so_dien_thoai: phone,
          dia_chi: address,
          phuong_thuc_thanh_toan: paymentMethod,
          ghi_chu: orderNote,
          san_pham: products,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(data);
        throw new Error(data?.message || "Đặt hàng thất bại");
      }
      toast.success("Đặt hàng thành công!");
      onClose();
      // Reset form
      setCurrentStep(0);
      setFullName("");
      setPhone("");
      setAddress("");
      setPaymentMethod("TIEN_MAT");
      setOrderNote("");
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="min-w-[800px] w-full p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Danh sách sản phẩm */}
          <div>
            <DialogHeader>
              <DialogTitle>Danh Sách Sản Phẩm</DialogTitle>
              <DialogDescription>Danh sách sản phẩm bạn đã chọn</DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              {products.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-gray-100 p-4 rounded-xl">
                  <Image
                    src={item.url_image}
                    alt={item.ten_san_pham}
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.ten_san_pham}</div>
                    <div className="text-sm text-gray-500">${item.gia_tien} / sản phẩm</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">SL: {item.so_luong}</div>
                    <div className="font-semibold text-indigo-600">
                      ${(item.so_luong * item.gia_tien).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form đặt hàng dạng multi-step */}
          <div className="bg-indigo-950 text-white p-6 rounded-xl space-y-4">
            <h2 className="text-xl font-bold">Thanh Toán</h2>
            <div className="space-y-3">
              {currentStep === 0 && (
                <>
                  <div>
                    <Label htmlFor="name">Họ Và Tên</Label>
                    <Input
                      id="name"
                      className="text-white mt-2"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Số Điện Thoại</Label>
                    <Input
                      id="phone"
                      className="text-white mt-2"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Địa Chỉ Giao Hàng</Label>
                    <Input
                      id="address"
                      className="text-white mt-2"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* {currentStep === 1 && (
                <>
                  
                </>
              )} */}    

              {currentStep === 1 && (
                <>
                  <div>
                    <Label htmlFor="payment">Phương Thức Thanh Toán</Label>
                    <select
                      id="payment"
                      className="text-white mt-2 w-full p-2 rounded border-white"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}

                    >
                      <option value="ZALOPAY" className="text-black">VNPay</option>
                      <option value="TIEN_MAT" className="text-black">tiền mặt</option>
                    </select>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div>
                    <Label htmlFor="note">Ghi Chú Đơn Hàng (Tùy chọn)</Label>
                    <Input
                      id="note"
                      className="text-white mt-2"
                      placeholder="Nhập ghi chú nếu có..."
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                    />
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div className="text-sm pt-2 text-white">
                    <div><strong>Họ và tên:</strong> {fullName}</div>
                    <div><strong>Số điện thoại:</strong> {phone}</div>
                    <div><strong>Địa chỉ:</strong> {address}</div>
                    <div><strong>Phương thức thanh toán:</strong> {paymentMethod}</div>
                    <div>
                      <strong>Tổng số lượng:</strong> {totalQuantity} - 
                      <strong> Tổng tiền:</strong> ${totalPrice.toLocaleString()}
                    </div>
                    {orderNote && <div><strong>Ghi chú:</strong> {orderNote}</div>}
                  </div>
                </>
              )}
            </div>

            <DialogFooter className="flex justify-between">
              {currentStep > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  className="text-black border-white"
                  onClick={handleBack}
                >
                  Quay lại
                </Button>
              ) : (
                <div /> // Giữ khoảng cách
              )}

              {currentStep < totalSteps - 1 ? (
                <Button
                  type="button"
                  className="bg-green-400 hover:bg-green-500 text-black font-bold"
                  onClick={handleNext}
                >
                  Tiếp theo
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    className="bg-green-400 hover:bg-green-500 text-black font-bold"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    {loading ? "Đang xử lý..." : "Đặt hàng"}
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline" className=" text-blue-900 border-white">
                      Đóng
                    </Button>
                  </DialogClose>
                </>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
