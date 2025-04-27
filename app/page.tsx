'use client';
import Image from "next/image";
import Link from "next/link";
import StorySection from "./components/cuahang/cuahang.storys";
import ContactSection from "./components/cuahang/cuahang.contact";
import BookingSection from "./components/lichhen/BookingSection";
import SanPhamList from "./components/sanpham/sanpham.list";
import SanPhamPage from "./(page)/san-pham/page";
import { useUser } from "./lib/context";

export default function Home() {
  const {user}= useUser()
  console.log(user);
  
  return (
  <>
    <div className="min-h-screen bg-gray-100"
    >
      {/* Hero Section */}
      <section 
          className="relative text-white text-center bg-cover bg-center h-screen flex flex-col justify-center items-center"
          style={{ backgroundImage: "url('https://brojqgdjcljbprhn.public.blob.vercel-storage.com/background/z6454049196361_946d115cd94d2e5f3f85f84dc551a230-UDCnYr7aN9TvVcWOFxSNH02FPuw4UD.jpg')" }}>
        <div className="sticky top-0 left-0 w-full">
                
                <p className="mt-4 text-2xl text-neutral-600 ">We provide the best solutions for your needs.</p>
                <button className="mt-6 px-6 py-2 bg-white text-neutral-700 font-semibold rounded-full shadow-lg hover:bg-neutral-100">
                  Đặt may ngay
                </button>
        </div>
      </section>
      <StorySection />

      <BookingSection />
      
      <ContactSection />
      
    </div>
  </>
  );
  
}
