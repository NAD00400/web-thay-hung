import SanPhamList from '@/app/components/sanpham/sanpham.list';
import { fetchSanPham } from '@/app/lib/fetchData';



export default async function SanPhamPage() {
    const sanPham = await fetchSanPham(); // Fetch dữ liệu tại server

    return (
        <div className="p-5 pt-24 font-sans bg-neutral-100 min-h-screen">
            <SanPhamList sanPham={sanPham} />
        </div>
    );
}
