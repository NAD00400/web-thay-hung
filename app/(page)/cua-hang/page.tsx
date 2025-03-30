'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';

const LienHePage = () => {
    const googleMapsUrl =
        'https://www.google.com/maps/search/?api=1&query=123+Đường+Áo+Dài,+Phường+Thời+Trang,+Quận+Sáng+Tạo,+Thành+phố+May+Mắn';

    return (
        <>
            {/* Contact Section */}
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
                <div className=' bg-neutral-100 opacity-70 p-4 rounded-3xl'>
                    <h2 className="text-2xl font-bold text-neutral-700 ">Địa chỉ cửa hàng</h2>
                    
                    <p className="mt-4 text-lg text-neutral-900">123 Đường Áo Dài, Phường Thời Trang, Quận Sáng Tạo, Thành phố May Mắn</p>
                    </div>
                    <Button 
                        asChild 
                        className="mt-6 px-6 py-3 bg-white text-neutral-900 font-semibold rounded-lg hover:bg-gray-200 transition-all">
                        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                            Xem trên Google Maps
                        </a>
                    </Button>
                    
                </div>
            </div>

            {/* Story Section */}
            {/* Story Section */}
            <div className="w-full flex flex-col items-center text-center p-12 bg-neutral-100 text-neutral-900">
                <h2 className="text-2xl font-bold" >Câu chuyện của chúng tôi</h2>
                <p className="mt-4 max-w-3xl text-lg">
                    Chúng tôi không chỉ là một cửa hàng may áo dài, mà còn là nơi gìn giữ nét đẹp văn hóa.
                    Mỗi sản phẩm là một câu chuyện, mỗi thiết kế là một sự kết hợp giữa truyền thống và hiện đại,
                    giúp tôn lên vẻ đẹp thanh lịch và tinh tế của người mặc.
                </p>
                <div className="mt-8 max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center">
                        <Image
                            src="https://brojqgdjcljbprhn.public.blob.vercel-storage.com/lien%20he/ChatGPT%20Image%20Mar%2029%2C%202025%2C%2007_54_40%20PM-Evw34QtdL1Pijg8o177ZD7Y872uLZA.png"
                            alt="Hình ảnh may đo"
                            width={400}
                            height={300}
                            className="rounded-lg object-cover"
                        />
                        <p className="mt-4 text-lg">Sự tỉ mỉ trong từng đường kim mũi chỉ tạo nên những bộ áo dài hoàn hảo.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Image
                            src="https://brojqgdjcljbprhn.public.blob.vercel-storage.com/lien%20he/ChatGPT%20Image%20Mar%2029%2C%202025%2C%2007_54_40%20PM-Evw34QtdL1Pijg8o177ZD7Y872uLZA.png"
                            alt="Hình ảnh áo dài"
                            width={400}
                            height={300}
                            className="rounded-lg object-cover"
                        />
                        <p className="mt-4 text-lg">Kết hợp phong cách truyền thống và hiện đại để tạo nên sự độc đáo.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Image
                            src="https://brojqgdjcljbprhn.public.blob.vercel-storage.com/lien%20he/ChatGPT%20Image%20Mar%2029%2C%202025%2C%2007_54_40%20PM-Evw34QtdL1Pijg8o177ZD7Y872uLZA.png"
                            alt="Hình ảnh vải cao cấp"
                            width={400}
                            height={300}
                            className="rounded-lg object-cover"
                        />
                        <p className="mt-4 text-lg">Lựa chọn chất liệu cao cấp, mềm mại và thoáng mát cho người mặc.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LienHePage;