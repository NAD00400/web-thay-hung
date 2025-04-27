'use client';

import { useUser } from '@/app/lib/context';
import { fetchKhachHangByNguoiDungId, fetchNguoiDungByFirebaseId } from '@/app/lib/fetchData';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaCartArrowDown } from 'react-icons/fa';

interface GoiYSanPhamListProps {
  danhMucId: string;
}

const GoiYSanPhamList = ({ danhMucId }: GoiYSanPhamListProps) => {
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.uid;
  const [sanPhamList, setSanPhamList] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const getCustomerId = async () => {
      if (!userId) return;
      try {
        const nguoiDung = await fetchNguoiDungByFirebaseId(userId);
        const khachHang = await fetchKhachHangByNguoiDungId(nguoiDung?.ma_nguoi_dung);
        setCustomerId(khachHang?.ma_khach_hang || null);
      } catch (error) {
        console.error('Lỗi khi lấy mã khách hàng:', error);
      }
    };
    getCustomerId();
  }, [userId]);

  useEffect(() => {
    const fetchSanPham = async () => {
      if (!danhMucId) return;
      try {
        const res = await fetch(`/api/san-pham/danh-muc/${danhMucId}`);
        const data = await res.json();
        setSanPhamList(data);
      } catch (err) {
        console.error('Lỗi khi lấy sản phẩm:', err);
      }
    };
    fetchSanPham();
  }, [danhMucId]);

  const addToCart = async (productId: string) => {
    try {
      const res = await fetch('/api/gio-hang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, customerId }),
      });

      if (!res.ok) throw new Error('Add failed');
      alert('Đã thêm vào giỏ hàng!');
    } catch (error) {
      console.error('Lỗi thêm vào giỏ hàng:', error);
      alert('Không thể thêm vào giỏ hàng.');
    }
  };

  const totalPages = Math.ceil(sanPhamList.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentSanPhams = sanPhamList.slice(startIdx, startIdx + itemsPerPage);

  if (!sanPhamList.length) {
    return <div className="text-sm text-gray-500 mt-6">Đang tải sản phẩm gợi ý...</div>;
  }

  return (
    <div className="mt-12 container mx-auto px-4 max-w-6xl">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Sản phẩm cùng danh mục</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {currentSanPhams.map((product) => (
          <div
            key={product.ma_san_pham_dat_may}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-3 flex flex-col justify-between"
          >
            <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-2">
              <Image
                src={product.url_image || '/placeholder-image.png'}
                alt={product.ten_san_pham}
                width={300}
                height={400}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="text-sm font-semibold text-gray-800 truncate">{product.ten_san_pham}</div>
            <div className="text-xs text-gray-500 truncate">{product.mo_ta_san_pham}</div>
            <div className="text-sm font-bold text-red-600 mt-1">
              {product.gia_tien.toLocaleString('vi-VN')}₫
            </div>

            <div className="flex justify-between items-center mt-3">
              <button
                onClick={() => addToCart(product.ma_san_pham_dat_may)}
                className="p-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition"
                title="Thêm vào giỏ"
              >
                <FaCartArrowDown />
              </button>
              <button
                onClick={() => router.push(`/san-pham/san-pham-chi-tiet/${product.ma_san_pham_dat_may}`)}
                className="text-xs px-3 py-1 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            Trang trước
          </button>

          <span className="text-sm text-gray-600">
            Trang {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
};

export default GoiYSanPhamList;
