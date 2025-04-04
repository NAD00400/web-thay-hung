// DonHangButton.tsx (Client Component)
"use client"; // Đánh dấu đây là Client Component

import { usePathname, useRouter } from "next/navigation";

export default function DonHangButton({ orderId }: { orderId: string }) {
    const router = useRouter();
  return (
    <button
      onClick={() => router.push(`/admin/don-hang/${orderId}`)}
     
      
      className="bg-indigo-400 text-white px-4 py-1 rounded-lg shadow-md hover:bg-indigo-700 transition"
    >
      Chi Tiết
    </button>
  );
}
