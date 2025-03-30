"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Email:", email, "Password:", password);
        // Gửi request API đăng nhập
    };

    return (
        <Card className="w-full max-w-md p-8 bg-neutral-50">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <Label htmlFor="email" className="pl-1 mb-2">
                        Email
                    </Label>
                    <Input
                        type="email"
                        id="email"
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <Label htmlFor="password" className="pl-1 mb-2">
                        Mật khẩu
                    </Label>
                    <Input
                        type="password"
                        id="password"
                        placeholder="Nhập mật khẩu của bạn"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <Button type="submit" className="w-full bg-neutral-950">
                    Đăng Nhập
                </Button>
            </form>
            <p className="mt-4 text-sm text-center text-neutral-600">
                Chưa có tài khoản?{" "}
                <Link href="/dang-ky" className="text-neutral-900 hover:underline">
                    Đăng ký
                </Link>
            </p>
        </Card>
    );
}
