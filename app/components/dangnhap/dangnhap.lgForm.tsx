// app/login/page.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { auth } from "@/app/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/lib/context";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/nguoi-dung/dang-nhap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_nguoi_dung: email, mat_khau: password }),
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        router.push("/");
      } else {
        const { error } = await res.json();
        alert(error || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const res = await fetch("/api/nguoi-dung", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ten_nguoi_dung: firebaseUser.displayName,
          email_nguoi_dung: firebaseUser.email,
          link_anh_dai_dien: firebaseUser.photoURL,
          firebaseId: firebaseUser.uid,
          vai_tro: "KHACH_HANG",
        }),
      });

      const userData = await res.json();
      setUser(userData);
      router.push("/");
    } catch (error) {
      console.error("Đăng nhập Google thất bại:", error);
    }
  };

  return (
    <Card className="w-full max-w-md p-8 bg-white shadow-lg">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Đăng Nhập
        </Button>
      </form>

      <div className="my-4 text-center text-sm text-gray-500">Hoặc</div>

      <Button className="w-full bg-blue-500" onClick={handleGoogleLogin}>
        Đăng nhập với Google
      </Button>

      <p className="mt-4 text-sm text-center">
        Chưa có tài khoản?{" "}
        <Link href="/dang-ky" className="text-blue-600 underline">
          Đăng ký
        </Link>
      </p>
    </Card>
  );
}
