'use client';
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
  <>
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section 
          className="relative text-white text-center bg-cover bg-center h-screen flex flex-col justify-center items-center"
          style={{ backgroundImage: "url('https://brojqgdjcljbprhn.public.blob.vercel-storage.com/background/DALL%C2%B7E%202025-03-28%2011.19.20%20-%20A%20traditional%20Ao%20Dai%20clothing%20store%20with%20a%20clean%20white%20theme.%20The%20store%20showcases%20elegant%20Ao%20Dai%20dresses%20on%20mannequins%20and%20neatly%20arranged%20shelves.%20Th-QVEf1RRT5sPkEin6guNdURnjCWP7po.webp')" }}>
        <div className="sticky top-0 left-0 w-full">
                
                <p className="mt-4 text-2xl text-neutral-600 ">We provide the best solutions for your needs.</p>
                <button className="mt-6 px-6 py-2 bg-white text-neutral-700 font-semibold rounded-full shadow-lg hover:bg-neutral-100">
                  Đặt may ngay
                </button>
        </div>
      </section>
    </div>
  </>
  );
  
}
