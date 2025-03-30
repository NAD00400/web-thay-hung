'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function DangKyPage() {
    
    const [formData, setFormData] = useState({
        email_nguoi_dung: "",
        ten_nguoi_dung: "",
        sdt: "",
        mk1: "",
        mk2: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/nguoi-dung", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Đăng ký thất bại!");
            }

            alert("Đăng ký thành công!");
            setFormData({
                email_nguoi_dung: "",
                ten_nguoi_dung: "",
                sdt: "",
                mk1: "",
                mk2: "",
            });
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="max-w-md w-full shadow-lg p-6 bg-white rounded-lg">
                <CardHeader>
                    <h1 className="text-xl font-bold text-center ">Đăng Ký Người Dùng</h1>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        <div>
                            <Label htmlFor="ten_nguoi_dung" className='pl-1 mb-2'>Tên Người Dùng</Label>
                            <Input
                                type="text"
                                id="ten_nguoi_dung"
                                name="ten_nguoi_dung"
                                value={formData.ten_nguoi_dung}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="email_nguoi_dung" className='pl-1 mb-2'>Email</Label>
                            <Input
                                type="email"
                                id="email_nguoi_dung"
                                name="email_nguoi_dung"
                                value={formData.email_nguoi_dung}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="sdt" className='pl-1 mb-2'>sdt</Label>
                            <Input
                                type="text"
                                id="sdt"
                                name="sdt"
                                value={formData.sdt}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="mk1" className='pl-1 mb-2'>Mật Khẩu</Label>
                            <Input
                                type="password"
                                id="mk1"
                                name="mk1"
                                value={formData.mk1}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="mk2" className='pl-1 mb-2'>Nhập lại Mật Khẩu</Label>
                            <Input
                                type="password"
                                id="mk2"
                                name="mk2"
                                value={formData.mk2}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        cái ký tự bị dánh mờ rồi người dùng nhập lại để xác thực 
                        <Button type="submit" className="w-full mt-4" disabled={loading}>
                            {loading ? "Đang đăng ký..." : "Đăng Ký"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
