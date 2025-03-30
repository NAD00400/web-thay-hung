'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CartActions({ itemId, isCheckout }: { itemId?: number; isCheckout?: boolean }) {
    const [isRemoving, setIsRemoving] = useState(false);
    const router = useRouter();

    const handleRemove = async () => {
        setIsRemoving(true);
        // Gửi yêu cầu xóa sản phẩm (Fake API)
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsRemoving(false);
        router.refresh(); // Làm mới trang để cập nhật dữ liệu từ Server Component
    };

    return isCheckout ? (
        <Button className="mt-4" onClick={() => router.push('/dat-hang')}>
            Đặt Hàng
        </Button>
    ) : (
        <Button variant="destructive" size="sm" onClick={handleRemove} disabled={isRemoving}>
            {isRemoving ? "Đang xóa..." : "Xóa"}
        </Button>
    );
}
