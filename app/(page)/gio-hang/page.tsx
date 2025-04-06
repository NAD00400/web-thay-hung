import GioHangClient from "@/app/components/giohang/giohang.list";


export default function GioHangPage() {
    return (
        <div className="container mx-auto p-4 mt-16">
            <h1 className="text-2xl font-bold mb-4">Giỏ Hàng</h1>
            <GioHangClient />
        </div>
    );
}
