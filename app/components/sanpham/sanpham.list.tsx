"use client";

import { useUser } from "@/app/lib/context";
import { fetchKhachHangByNguoiDungId, fetchNguoiDungByFirebaseId } from "@/app/lib/fetchData";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaCartArrowDown } from "react-icons/fa";

const itemsPerPage = 8;

const SanPhamList = ({ sanPham }: { sanPham: any[] }) => {
  
  const router = useRouter();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const isGuest = !user;
  // Inline helper: thêm hoặc tăng số lượng sản phẩm vào giỏ hàng tạm
function addProductToTempCart(item: {
  id: string;
  name: string;
  image: string;
  price: number;
  so_luong: number;
}) {
  const key = "temp_cart";
  // Lấy giỏ tạm hiện tại
  const current: typeof item[] = JSON.parse(sessionStorage.getItem(key) || "[]");
  // Tìm sản phẩm đã tồn tại
  const found = current.find((i) => i.id === item.id);
  if (found) {
    // Nếu đã có, tăng số lượng
    found.so_luong += 1;
  } else {
    // Chưa có, thiết lập so_luong = 1
    current.push({ ...item, so_luong: 1 });
  }
  // Lưu lại
  sessionStorage.setItem(key, JSON.stringify(current));
}

  // Đồng bộ giỏ tạm sang DB khi login
 
  // Lọc và sắp xếp
  const filteredSanPham = useMemo(() => {
    let list = [...sanPham];
    if (searchTerm) {
      list = list.filter((p) =>
        p.ten_san_pham.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filter === "price-asc") list.sort((a, b) => a.gia_tien - b.gia_tien);
    else if (filter === "price-desc") list.sort((a, b) => b.gia_tien - a.gia_tien);
    return list;
  }, [sanPham, searchTerm, filter]);

  // Reset trang khi list thay đổi
  useEffect(() => setCurrentPage(1), [filteredSanPham]);

  const totalPages = Math.ceil(filteredSanPham.length / itemsPerPage);
  const currentItems = filteredSanPham.slice(
    (currentPage - 1) * itemsPerPage,
    (currentPage - 1) * itemsPerPage + itemsPerPage
  );

  const addToCart = async (product: any) => {
    // Chưa login: lưu tạm object đầy đủ
    if (!user?.customer.ma_khach_hang) {
      addProductToTempCart({
        id: product.ma_san_pham_dat_may,
        name: product.ten_san_pham,
        image: product.url_image || '/placeholder-image.png',
        price: product.gia_tien,
        so_luong: 1,
      });
      alert('Sản phẩm đã được lưu tạm vào giỏ hàng.');

      return;
    }    
    // Đã login: call API
    try {
      const res = await fetch('/api/gio-hang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.ma_san_pham_dat_may,
          customerId: user.customer.ma_khach_hang,
        }),
      });
      if (!res.ok) throw new Error('Failed to add');
      alert('Sản phẩm đã được thêm vào giỏ hàng.');
      sessionStorage.setItem("cart_updated", "true");
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi thêm sản phẩm.');
    }
  };

  return (
    <>
      {/* Bộ lọc */}
<div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4  p-4 rounded-lg border border-neutral-700">
  <input
    type="text"
    placeholder="Tìm kiếm sản phẩm..."
    className="w-full sm:max-w-sm px-4 py-2 rounded-md bg-black text-white border border-neutral-600 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-colors"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <select
    className="w-full sm:w-auto px-4 py-2 rounded-md bg-black text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-colors"
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
  >
    <option value="">Lọc theo</option>
    <option value="price-asc">Giá tăng dần</option>
    <option value="price-desc">Giá giảm dần</option>
  </select>
</div>

{/* Danh sách sản phẩm */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {currentItems.length === 0 ? (
    <p className="text-center text-neutral-500 col-span-full">
      Không tìm thấy sản phẩm.
    </p>
  ) : (
    currentItems.map((product) => (
      <div
        key={product.ma_san_pham_dat_may}
        className="bg-neutral-950 border border-neutral-700 rounded-lg p-5"
      >
        <div className="relative w-full aspect-square mb-4 bg-gray-900 rounded-md overflow-hidden">
          <Image
            src={product.url_image || '/placeholder-image.png'}
            alt={product.ten_san_pham}
            fill
            className="object-cover"
          />
        </div>
        <h2 className="font-semibold mb-2 text-white">{product.ten_san_pham}</h2>
        <p className="text-neutral-400 mb-4 text-sm">{product.mo_ta_san_pham}</p>
        <p className="font-bold text-white mb-4">
          {product.gia_tien?.toLocaleString('vi-VN') || 'N/A'} VND
        </p>
        <div className="flex gap-3">
          {/* Nút Thêm giỏ hàng */}
          <button
            onClick={() => addToCart(product)}
            className="
              flex-1 flex items-center justify-center 
              py-2 px-4 rounded-lg 
              border border-neutral-600 
              bg-transparent text-white 
              hover:border-red-500 hover:text-red-500 
              transition-colors
            "
          >
            <FaCartArrowDown className="w-5 h-5" />
          </button>

          {/* Nút Xem chi tiết */}
          <button
            onClick={() => router.push(`/san-pham/san-pham-chi-tiet/${product.ma_san_pham_dat_may}`)}
            className="
              flex-1 flex items-center justify-center 
              py-2 px-4 rounded-lg 
              border border-neutral-600 
              bg-transparent text-white 
              hover:border-neutral-400 hover:text-neutral-400 
              transition-colors
            "
          >
            Xem
          </button>
        </div>
      </div>
    ))
  )}
</div>

{/* Phân trang */}
{filteredSanPham.length > itemsPerPage && (
  <div className="mt-8 flex justify-center gap-2">
    {Array.from({ length: totalPages }, (_, idx) => (
      <button
        key={idx}
        className={`px-3 py-1 rounded-full ${
          currentPage === idx + 1
            ? 'bg-neutral-700 text-white'
            : 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'
        }`}
        onClick={() => setCurrentPage(idx + 1)}
      >
        {idx + 1}
      </button>
    ))}
  </div>
)}

    </>
  );
};

export default SanPhamList;
