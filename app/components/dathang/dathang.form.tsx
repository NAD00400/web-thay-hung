"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleOrderSubmit } from "./dathang.action";



export default function OrderForm() {
    const [status, setStatus] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        const response = await handleOrderSubmit(formData);
        if (response.success) {
            setStatus("Đặt hàng thành công!");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Address Input */}
            <div>
                <Label>Địa chỉ nhận hàng</Label>
                <Input name="address" placeholder="Nhập địa chỉ nhận hàng" required className="mt-2"/>
            </div>

            {/* Payment Method */}
            <div>
                <Label>Phương thức thanh toán</Label>
                <div className="space-y-2">
                    <label className="flex items-center gap-2">
                        <input type="radio" name="paymentMethod" value="cod" defaultChecked />
                        Thanh toán khi nhận hàng (COD)
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="radio" name="paymentMethod" value="bank" />
                        Chuyển khoản ngân hàng
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="radio" name="paymentMethod" value="momo" />
                        Ví MoMo
                    </label>
                </div>
            </div>

            <Button type="submit" className="w-full mt-4">
                Đặt hàng
            </Button>

            {status && <p className="text-green-600 mt-2">{status}</p>}
        </form>
    );
}
