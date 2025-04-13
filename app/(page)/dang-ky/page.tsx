'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function DangKyPage() {
    const [formData, setFormData] = useState({
        email_nguoi_dung: "",
        ten_nguoi_dung: "",
        mk1: "",
        mk2: "",
        captcha: "",
        generatedCaptcha: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const generateCaptcha = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            generatedCaptcha: generateCaptcha(),
        }));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateInputs = () => {
        if (formData.mk1 !== formData.mk2) {
            setError("Mật khẩu nhập lại không khớp.");
            return false;
        }
        if (formData.captcha !== formData.generatedCaptcha) {
            setError("Mã Captcha không đúng.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!validateInputs()) return;

        setLoading(true);

        const bodyToSend = {
            email_nguoi_dung: formData.email_nguoi_dung,
            ten_nguoi_dung: formData.ten_nguoi_dung,
            mat_khau: formData.mk1,
        };

        try {
            const response = await fetch("/api/nguoi-dung/dang-ky-thu-cong", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyToSend),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Đăng ký thất bại!");
            }

            alert("Đăng ký thành công!");
            setFormData({
                email_nguoi_dung: "",
                ten_nguoi_dung: "",
                mk1: "",
                mk2: "",
                captcha: "",
                generatedCaptcha: generateCaptcha(),
            });
        } catch (error) {
            setError(error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 mt-4">
            <Card className="max-w-md w-full shadow-sm p-6 bg-white rounded-lg">
                <CardHeader>
                    <h1 className="text-xl font-bold text-center">Đăng Ký Người Dùng</h1>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="ten_nguoi_dung">Tên Người Dùng</Label>
                            <Input type="text" id="ten_nguoi_dung" name="ten_nguoi_dung" value={formData.ten_nguoi_dung} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label htmlFor="email_nguoi_dung">Email</Label>
                            <Input type="email" id="email_nguoi_dung" name="email_nguoi_dung" value={formData.email_nguoi_dung} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label htmlFor="mk1">Mật Khẩu</Label>
                            <Input type="password" id="mk1" name="mk1" value={formData.mk1} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label htmlFor="mk2">Nhập lại Mật Khẩu</Label>
                            <Input type="password" id="mk2" name="mk2" value={formData.mk2} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label htmlFor="captcha">Captcha</Label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="text"
                                    id="captcha"
                                    name="captcha"
                                    value={formData.captcha}
                                    onChange={handleChange}
                                    placeholder="Nhập mã captcha"
                                    required
                                />
                                <span className="bg-gray-200 px-4 py-2 rounded text-black font-mono">
                                    {formData.generatedCaptcha}
                                </span>
                                <Button type="button" onClick={() => setFormData((prev) => ({ ...prev, generatedCaptcha: generateCaptcha() }))}>
                                    Tạo lại
                                </Button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full mt-4" disabled={loading}>
                            {loading ? "Đang đăng ký..." : "Đăng Ký"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
