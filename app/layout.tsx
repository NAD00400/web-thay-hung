"use client";
import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderComponent from "./components/menu/menu.user";
import FooterComponent from "./components/footer/footer.user";
import { UserProvider } from "./lib/context";

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
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Lấy đường dẫn hiện tại
  const isAdminRoute = pathname.startsWith("/admin"); // Kiểm tra nếu đang ở /admin

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <UserProvider>
        {!isAdminRoute && <HeaderComponent />}
        {children}
        {!isAdminRoute && <FooterComponent />}
      </UserProvider>
      </body>
    </html>
  );
}
