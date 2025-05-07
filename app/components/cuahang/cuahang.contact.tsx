import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const googleMapsUrl =
  "https://www.google.com/maps/search/?api=1&query=28+thảo+điền,+Quận+2,+Thành+phố+hồ+chí+minh";

export default function ContactSection() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center text-white">
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
      <div className="relative z-10 p-6 max-w-2xl w-full">
        <Card className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-neutral-700 text-center text-2xl">
              Địa chỉ
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center space-y-4">
            <p className="text-lg text-neutral-900">
              28 Thảo Điền, Quận 2, Thành phố Hồ Chí Minh
            </p>
            <Button asChild className="text-base font-semibold">
              <Link href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                Xem trên Google Maps
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
