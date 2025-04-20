'use client';

import { useUser } from "@/app/lib/context";
import { fetchKhachHangByNguoiDungId, fetchNguoiDungByFirebaseId } from "@/app/lib/fetchData";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaCartArrowDown } from "react-icons/fa";

const itemsPerPage = 8;

const SanPhamList = ({ sanPham }: { sanPham: any[] }) => {
  const router = useRouter();
  const { user } = useUser(); // lấy user từ context
  const [userData, setUserData] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Nếu user tồn tại, mới fetch dữ liệu
  useEffect(() => {
    if (!user?.uid) return;

    const fetchUserAndCustomer = async () => {
      try {
        const fetchedUser = await fetchNguoiDungByFirebaseId(user.uid);
        setUserData(fetchedUser);

        if (fetchedUser?.ma_nguoi_dung) {
          const fetchedCustomer = await fetchKhachHangByNguoiDungId(fetchedUser.ma_nguoi_dung);
          setCustomerData(fetchedCustomer);
        }
      } catch (error) {
        console.error("Lỗi khi fetch người dùng và khách hàng:", error);
      }
    };

    fetchUserAndCustomer();
  }, [user?.uid]);

  // 👉 Xử lý lọc sản phẩm
  const filteredSanPham = useMemo(() => {
    let list = [...sanPham];

    if (searchTerm) {
      list = list.filter(product =>
        product.ten_san_pham.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter === 'price-asc') {
      list.sort((a, b) => a.gia_tien - b.gia_tien);
    } else if (filter === 'price-desc') {
      list.sort((a, b) => b.gia_tien - a.gia_tien);
    }

    return list;
  }, [sanPham, searchTerm, filter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredSanPham]);

  const totalPages = useMemo(
    () => Math.ceil(filteredSanPham.length / itemsPerPage),
    [filteredSanPham]
  );

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSanPham.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSanPham, currentPage]);

  const addToCart = async (productId: string, customerId?: string) => {
    if (!customerId) {
      // Xử lý khi chưa có thông tin khách hàng - lưu vào sessionStorage
      const cartKey = 'temp_cart';
      const currentCart = JSON.parse(sessionStorage.getItem(cartKey) || '[]');
  
      // Tránh thêm trùng sản phẩm
      if (!currentCart.includes(productId)) {
        currentCart.push(productId);
        sessionStorage.setItem(cartKey, JSON.stringify(currentCart));
        alert('Sản phẩm đã được lưu tạm vào giỏ hàng.');
      } else {
        alert('Sản phẩm này đã có trong giỏ hàng tạm.');
      }
  
      return;
    }
  
    // Xử lý khi đã có thông tin khách hàng - thêm vào giỏ hàng trong DB
    try {
      const response = await fetch('/api/gio-hang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, customerId }),
      });
      if (!response.ok) {
        throw new Error('Failed to add product to cart');
      }
      alert('Sản phẩm đã được thêm vào giỏ hàng.');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
    }
  };
  

  return (
    <>
      {/* Bộ lọc */}
      <div className="mb-6 flex justify-between items-center bg-gray-200 p-4 rounded-lg border-white">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="border border-white bg-neutral-50 rounded-lg px-4 py-2 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border border-white bg-neutral-50 rounded-lg px-4 py-2 ml-4 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">📌 Lọc theo</option>
          <option value="price-asc">📈 Giá tăng dần</option>
          <option value="price-desc">📉 Giá giảm dần</option>
        </select>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentItems.length === 0 ? (
          <p className="text-center text-neutral-500 col-span-full">
            Không tìm thấy sản phẩm phù hợp.
          </p>
        ) : (
          currentItems.map(product => (
            <div
              key={product.ma_san_pham_dat_may}
              className="border border-white bg-gray-50 rounded-lg p-5 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-full aspect-[10/12] bg-neutral-200 rounded-lg mb-4 overflow-hidden">
                <Image
                  src={product.url_image || '/placeholder-image.png'}
                  alt={product.ten_san_pham}
                  width={250}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="font-semibold mb-2 text-neutral-800">
                {product.ten_san_pham}
              </h2>
              <p className="text-neutral-600 mb-4 text-sm">
                {product.mo_ta_san_pham}
              </p>
              <p className="font-bold text-neutral-900 mb-4">
                {product.gia_tien?.toLocaleString('vi-VN') || 'N/A'} VND
              </p>
              <div className="flex justify-between gap-2">
                <button
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-100 transition-colors w-full hover:shadow-lg border border-neutral-300"
                  onClick={() =>
                    addToCart(product.ma_san_pham_dat_may, customerData?.ma_khach_hang || '')
                  }
                >
                  <FaCartArrowDown />
                </button>
                <button
                  onClick={() =>
                    router.push(`/san-pham/san-pham-chi-tiet/${product.ma_san_pham_dat_may}`)
                  }
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors w-full hover:shadow-lg"
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
        <div className="mt-8 flex flex-wrap justify-center items-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded-full ${
                currentPage === index + 1
                  ? 'bg-neutral-700 text-white'
                  : 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default SanPhamList;
