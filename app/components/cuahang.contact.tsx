import Image from "next/image";
import { Button } from "@/components/ui/button";

const googleMapsUrl =
    "https://www.google.com/maps/search/?api=1&query=123+Đường+Áo+Dài,+Phường+Thời+Trang,+Quận+Sáng+Tạo,+Thành+phố+May+Mắn";

export default function ContactSection() {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center text-white">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="https://brojqgdjcljbprhn.public.blob.vercel-storage.com/background/z6454049196361_946d115cd94d2e5f3f85f84dc551a230-UDCnYr7aN9TvVcWOFxSNH02FPuw4UD.jpg"
                    alt="Background"
                    fill
                    className="object-cover opacity-90"
                />
            </div>

            {/* Content Section */}
            <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-2xl">
                <div className="bg-neutral-100 opacity-70 p-4 rounded-3xl">
                    <h2 className="text-2xl font-bold text-neutral-700">Địa chỉ cửa hàng</h2>
                    <p className="mt-4 text-lg text-neutral-900">
                        123 Đường Áo Dài, Phường Thời Trang, Quận Sáng Tạo, Thành phố May Mắn
                    </p>
                </div>
                <Button 
                    asChild 
                    className="mt-6 px-6 py-3 bg-white text-neutral-900 font-semibold rounded-lg hover:bg-gray-200 transition-all"
                >
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                        Xem trên Google Maps
                    </a>
                </Button>
            </div>
        </div>
    );
}
