import Image from "next/image";
import { Button } from "@/components/ui/button";

const googleMapsUrl =
    "https://www.google.com/maps/search/?api=1&query=28+thảo+điền,+Quận+2,+Thành+phố+hồ+chí+minh";

export default function ContactSection() {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center text-white mt-6">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="https://brojqgdjcljbprhn.public.blob.vercel-storage.com/background/ChatGPT%20Image%20Apr%2019%2C%202025%2C%2002_09_31%20PM-OWBJmROy19rS5FAzD1iOnbd8S0MFAX.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-90"
                />
            </div>

            {/* Content Section */}
            <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-2xl">
                <div className="bg-neutral-100 opacity-70 p-4 rounded-3xl">
                    <h2 className="text-2xl font-bold text-neutral-700">Địa chỉ</h2>
                    <p className="mt-4 text-lg text-neutral-900">
                        28, Thảo Điền ,Quận 2
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
