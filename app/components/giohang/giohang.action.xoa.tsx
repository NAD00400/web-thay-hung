"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, ShoppingCart } from "lucide-react";

export default function CartActions({ itemId, isCheckout }: { itemId?: number; isCheckout?: boolean }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    setIsRemoving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsRemoving(false);
    router.refresh();
  };

  return isCheckout ? (
    <button
      onClick={() => router.push("/dat-hang")}
      className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800 transition"
    >
      <div className="flex items-center justify-center gap-2">
        <ShoppingCart className="w-4 h-4" />
        <span>Đặt hàng</span>
      </div>
    </button>
  ) : (
    <button
      onClick={handleRemove}
      disabled={isRemoving}
      className={`flex items-center gap-2 px-3 py-1 text-sm rounded-md border border-red-500 text-red-500 hover:bg-red-100 transition ${
        isRemoving ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {isRemoving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      {isRemoving ? "Đang xóa..." : "Xóa"}
    </button>
  );
}
