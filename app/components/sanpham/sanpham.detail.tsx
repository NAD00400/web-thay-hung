'use client';

import { useUser } from '@/app/lib/context';
import { fetchKhachHangByNguoiDungId, fetchNguoiDungByFirebaseId } from '@/app/lib/fetchData';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import GoiYSanPhamList from './sanpham.list.goiy';

interface ProductDetailClientProps {
  product: any;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.uid;
  const [customerId, setCustomerId] = useState<string | null>(null);

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

  const handleAddToCart = async () => {
    if (!customerId) {
      toast.warning('Vui lòng đăng nhập để thêm vào giỏ hàng.');
      return;
    }

    try {
      const res = await fetch('/api/gio-hang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.ma_san_pham_dat_may,
          customerId,
        }),
      });

      if (!res.ok) throw new Error('Add failed');
      toast.success('Đã thêm vào giỏ hàng!');
    } catch (error) {
      console.error('Lỗi thêm vào giỏ hàng:', error);
      toast.error('Không thể thêm vào giỏ hàng.');
    }
  };

  return (
    <>
      <div className="container mx-auto mt-8 px-4 py-10 max-w-5xl text-gray-800">
        <div className="grid md:grid-cols-2 gap-8">
          <img
            src={product.url_image}
            alt={product.ten_san_pham}
            className="w-full rounded-2xl object-cover aspect-[4/5] border border-gray-200 shadow-sm"
          />

          <div className="space-y-6">
            <h1 className="text-4xl ">{product.ten_san_pham}</h1>
            <p className="text-gray-600 leading-relaxed">{product.mo_ta_san_pham}</p>

            <div className="space-y-3 divide-y divide-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Giá:</span>
                <span className="text-2xl font-bold text-green-600">
                  {product.gia_tien.toLocaleString()}₫
                </span>
              </div>

              <div className="flex justify-between text-sm pt-2">
                <span className="text-gray-500">Danh mục:</span>
                <span>{product.danh_muc.ten_danh_muc}</span>
              </div>

              <div className="flex justify-between text-sm pt-2">
                <span className="text-gray-500">Tình trạng:</span>
                <span className={`font-semibold ${product.co_san ? 'text-blue-600' : 'text-red-600'}`}>
                  {product.co_san ? 'Còn hàng' : 'Đã hết'}
                </span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.co_san}
              className="w-full bg-gray-900 hover:bg-gray-700 text-white py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>

        {product.phu_lieu_may_mac && (
          <div className="mt-12 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-2xl font-semibold mb-4">Phụ liệu may mặc</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 list-disc list-inside">
              {Object.entries(product.phu_lieu_may_mac).map(([key, value]) =>
                value ? (
                  <li key={key}>
                    <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                    {String(value)}
                  </li>
                ) : null
              )}
            </ul>
          </div>
        )}
      </div>

      <GoiYSanPhamList danhMucId={product.ma_danh_muc} />
    </>
  );
}
