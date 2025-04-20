'use client';

import { useUser } from "@/app/lib/context";
import { fetchKhachHangByNguoiDungId, fetchNguoiDungByFirebaseId } from "@/app/lib/fetchData";
import { SanPhamDatMay } from "@prisma/client";
import { log } from "console";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FaCartArrowDown } from "react-icons/fa";

const itemsPerPage = 8;

const SanPhamList = ({ sanPham }: { sanPham: SanPhamDatMay[] }) => {
    const { user } = useUser();
    const userId = user?.uid;
    const [userData, setUserData] = useState<any>(null);
    const [customerData, setCustomerData] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        console.log("Chưa có userId từ Firebase");
        return;
      }
      try {
        const fetchedUserData = await fetchNguoiDungByFirebaseId(userId);
        console.log("(fetchedUserData);",fetchedUserData);
      
        setUserData(fetchedUserData);
        if (fetchedUserData?.ma_nguoi_dung) {
          const fetchedCustomerData = await fetchKhachHangByNguoiDungId(fetchedUserData.ma_nguoi_dung);
          console.log("fetchedCustomerData",fetchedCustomerData);
          
          setCustomerData(fetchedCustomerData);
        } else {
          console.warn("Không có ma_nguoi_dung trong userData");
        }
      } catch (error) {
        console.error("Error fetching user or customer data:", error);
      }
    };
    fetchData();
  }, [userId]);
  

  // Tính toán danh sách sản phẩm đã lọc
  const filteredSanPham = useMemo(() => {
    let updatedList = [...sanPham];
    if (searchTerm) {
      updatedList = updatedList.filter(product =>
        product.ten_san_pham.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filter === 'price-asc') {
      updatedList.sort((a, b) => a.gia_tien - b.gia_tien);
    } else if (filter === 'price-desc') {
      updatedList.sort((a, b) => b.gia_tien - a.gia_tien);
    }
    return updatedList;
  }, [sanPham, searchTerm, filter]);

  // Reset trang hiện tại khi danh sách sản phẩm thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredSanPham]);

  // Phân trang
  const totalPages = useMemo(
    () => Math.ceil(filteredSanPham.length / itemsPerPage),
    [filteredSanPham]
  );
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSanPham.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSanPham, currentPage]);

  const addToCart = async (productId: string, customerId: string) => {
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
      <div className="mb-6 flex justify-between items-center bg-neutral-100 p-4 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="border border-neutral-300 bg-neutral-50 rounded-lg px-4 py-2 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          aria-label="Lọc sản phẩm"
          className="border border-neutral-300 bg-neutral-50 rounded-lg px-4 py-2 ml-4 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">📌 Lọc theo</option>
          <option value="price-asc">📈 Giá tăng dần</option>
          <option value="price-desc">📉 Giá giảm dần</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentItems.length === 0 ? (
          <p className="text-center text-neutral-500 col-span-full">
            Không tìm thấy sản phẩm phù hợp.
          </p>
        ) : (
          currentItems.map(product => (
            <div
              key={product.ma_san_pham_dat_may}
              className="border border-neutral-300 rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow bg-black/10"
            >
              <div className="w-full aspect-[10/12] bg-neutral-200 rounded-lg mb-4 overflow-hidden">
                <Image
                  src={product.url_image || '/placeholder-image.png'}
                  alt={product.ten_san_pham}
                  width={250}
                  height={5500}
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
                {product.gia_tien ? product.gia_tien.toLocaleString('vi-VN') : 'N/A'} VND
              </p>
              <div className="flex justify-between gap-2">
                <button
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-100 transition-colors w-full shadow-md hover:shadow-lg border border-neutral-300"
                  onClick={() =>
                    addToCart(product.ma_san_pham_dat_may, customerData?.ma_khach_hang|| '')
                  }
                  title="Thêm vào giỏ hàng"
                >
                  <FaCartArrowDown />
                </button>
                <button
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors w-full shadow-md hover:shadow-lg"
                >
                  Xem Chi Tiết
                </button>
              </div>
            </div>
          ))
        )}
      </div>

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
