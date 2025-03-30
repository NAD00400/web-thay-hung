'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function DatHangPage() {
    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cod");

    const products = [
        { id: 1, name: "Sản phẩm A", price: 100000, quantity: 1 },
        { id: 2, name: "Sản phẩm B", price: 200000, quantity: 2 },
    ];

    const handleOrderSubmit = () => {
        console.log("Address:", address);
        console.log("Payment Method:", paymentMethod);
        console.log("Products:", products);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
            <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Đặt Hàng</h1>

                {/* Product Details */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">Chi tiết sản phẩm</h2>
                    <div className="space-y-2">
                        {products.map((product) => (
                            <div key={product.id} className="p-4 border rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-gray-600">Số lượng: {product.quantity}</p>
                                </div>
                                <p className="font-bold">{product.price.toLocaleString()}₫</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Address Input */}
                <div className="mb-4">
                    <Label className="mb-2">Địa chỉ nhận hàng</Label>
                    <Input
                        placeholder="Nhập địa chỉ nhận hàng"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>

                {/* Payment Method */}
                <div className="mb-4">
                    <Label className="mb-2">Phương thức thanh toán</Label>
                    <RadioGroup
                        onValueChange={setPaymentMethod}
                        value={paymentMethod}
                        className="space-y-2"
                    >
                        <div className="flex items-center gap-2">
                            <input type="radio" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                            <span>Thanh toán khi nhận hàng (COD)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="radio" value="bank" checked={paymentMethod === "bank"} onChange={() => setPaymentMethod("bank")} />
                            <span>Chuyển khoản ngân hàng</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="radio" value="momo" checked={paymentMethod === "momo"} onChange={() => setPaymentMethod("momo")} />
                            <span>Ví MoMo</span>
                        </div>
                    </RadioGroup>
                </div>

                {/* Submit Button */}
                <Button className="w-full mt-4" onClick={handleOrderSubmit}>
                    Đặt hàng
                </Button>
            </div>
        </div>
    );
}
