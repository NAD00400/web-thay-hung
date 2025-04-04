"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { auth } from "../../lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation"; 
import { useUser } from "@/app/lib/context";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { user, setUser } = useUser(); // Ensure setUser exists in the context type

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Email:", email, "Password:", password);
        // Gửi request API đăng nhập (nếu dùng email/password)
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;

            // Gửi thông tin đến API để lưu user vào DB
            const res = await fetch("/api/nguoi-dung", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ten_nguoi_dung: firebaseUser.displayName,
                    email_nguoi_dung: firebaseUser.email,
                    link_anh_dai_dien: firebaseUser.photoURL,
                    firebaseId: firebaseUser.uid,
                    vai_tro: "khach_hang",
                }),
            });

            const userData = await res.json();
            setUser?.(userData); // lưu vào context nếu có

            router.push("/"); // Chuyển hướng
        } catch (error) {
            console.error("Đăng nhập Google thất bại:", error);
        }
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

            <div className="my-4 flex items-center justify-center">
                <span className="text-xs text-neutral-500">Hoặc</span>
            </div>

            <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded"
            >
                Đăng nhập với Google
            </button>

            <p className="mt-4 text-sm text-center text-neutral-600">
                Chưa có tài khoản?{" "}
                <Link href="/dang-ky" className="text-neutral-900 hover:underline">
                    Đăng ký
                </Link>
            </p>
        </Card>
    );
}
