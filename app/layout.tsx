"use client";

import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = usePathname();
  const isActive = (path: string) => router === path;
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-white shadow-md py-4 opacity-70 fixed top-0 left-0 w-full backdrop-blur-md z-50 transition-all duration-300">
          <div className="container mx-auto flex justify-between items-center px-4">
            <h1 className="text-xl font-bold text-gray-800">Nhà May Thiên Kim</h1>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link
                    href="/"
                    className={`text-gray-700 hover:text-neutral-900 ${
                      isActive("/") ? "text-neutral-900 font-bold" : ""
                    }`}
                  >
                    Trang Chủ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/san-pham"
                    className={`text-gray-700 hover:text-neutral-900  ${
                      isActive("/san-pham") ? "text-neutral-900 font-bold" : ""
                    }`}
                  >
                    Sản Phẩm
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dich-vu"
                    className={`text-gray-700 hover:text-neutral-900  ${
                      isActive("/dich-vu") ? "text-neutral-900 font-bold" : ""
                    }`}
                  >
                    Dịch Vụ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cua-hang"
                    className={`text-gray-700 hover:text-neutral-900  ${
                      isActive("/cua-hang") ? "text-neutral-900 font-bold" : ""
                    }`}
                  >
                    Cửa Hàng
                  </Link>
                </li>
              </ul>
            </nav>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link
                    href="/dang-nhap"
                    className={`text-gray-700 hover:text-neutral-900 ${
                      isActive("/dang-nhap") ? "text-neutral-900" : ""
                    }`}
                  >
                    Đăng Nhập
                  </Link>
                </li>
                <li>
                  <Link
                    href="/san-pham"
                    className={`text-gray-700 hover:text-neutral-900 ${
                      isActive("/giohang") ? "text-neutral-900 font-bold" : ""
                    }`}
                  >
                    Giỏ Hàng
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {children}
        <footer className="bg-neutral-20000 text-neutral-900 py-6 text-center h-24">
          <p>&copy; {new Date().getFullYear()} My Website. All Rights Reserved.</p>
        </footer>
      </body>
    </html>
  );
}
