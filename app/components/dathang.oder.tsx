"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CheckoutButton() {
    const router = useRouter();

    return (
        <Button className="mt-4" onClick={() => router.push("/dat-hang")}>
            Đặt Hàng
        </Button>
    );
}
