"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderComponent from "./components/menu";
import FooterComponent from "./components/footer";



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
  
  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HeaderComponent/>
        {children}
        <FooterComponent/>
      </body>
    </html>
  );
}
