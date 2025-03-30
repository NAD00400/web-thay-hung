"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function RemoveFromCartButton({ itemId }: { itemId: number }) {
    const [isRemoving, setIsRemoving] = useState(false);

    const handleRemove = async () => {
        setIsRemoving(true);
        await fetch(`/api/cart/remove`, {
            method: "POST",
            body: JSON.stringify({ id: itemId }),
        });
        setIsRemoving(false);
    };

    return (
        <Button variant="destructive" size="sm" onClick={handleRemove} disabled={isRemoving}>
            {isRemoving ? "Đang xóa..." : "Xóa"}
        </Button>
    );
}
