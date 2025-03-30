import Image from "next/image";

const images = [
    {
        src: "https://brojqgdjcljbprhn.public.blob.vercel-storage.com/lien%20he/ChatGPT%20Image%20Mar%2029%2C%202025%2C%2007_54_40%20PM-Evw34QtdL1Pijg8o177ZD7Y872uLZA.png",
        alt: "Hình ảnh may đo",
        text: "Sự tỉ mỉ trong từng đường kim mũi chỉ tạo nên những bộ áo dài hoàn hảo."
    },
    {
        src: "https://brojqgdjcljbprhn.public.blob.vercel-storage.com/lien%20he/ChatGPT%20Image%20Mar%2029%2C%202025%2C%2007_54_40%20PM-Evw34QtdL1Pijg8o177ZD7Y872uLZA.png",
        alt: "Hình ảnh áo dài",
        text: "Kết hợp phong cách truyền thống và hiện đại để tạo nên sự độc đáo."
    },
    {
        src: "https://brojqgdjcljbprhn.public.blob.vercel-storage.com/lien%20he/ChatGPT%20Image%20Mar%2029%2C%202025%2C%2007_54_40%20PM-Evw34QtdL1Pijg8o177ZD7Y872uLZA.png",
        alt: "Hình ảnh vải cao cấp",
        text: "Lựa chọn chất liệu cao cấp, mềm mại và thoáng mát cho người mặc."
    }
];

export default function StorySection() {
    return (
        <div className="w-full flex flex-col items-center text-center p-12 bg-neutral-100 text-neutral-900">
            <h2 className="text-2xl font-bold">Câu chuyện của chúng tôi</h2>
            <p className="mt-4 max-w-3xl text-lg">
                Chúng tôi không chỉ là một cửa hàng may áo dài, mà còn là nơi gìn giữ nét đẹp văn hóa.
                Mỗi sản phẩm là một câu chuyện, mỗi thiết kế là một sự kết hợp giữa truyền thống và hiện đại,
                giúp tôn lên vẻ đẹp thanh lịch và tinh tế của người mặc.
            </p>
            <div className="mt-8 max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {images.map((image, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={400}
                            height={300}
                            className="rounded-lg object-cover"
                        />
                        <p className="mt-4 text-lg">{image.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
