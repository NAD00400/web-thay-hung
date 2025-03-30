'use client'
import { fetchSanPham } from '@/app/lib/fetchData';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const SanPhamPage: React.FC = () => {
    const [sanPham, setSanPham] = useState<SanPhamDatMay[]>([]);
    const [filteredSanPham, setFilteredSanPham] = useState<SanPhamDatMay[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true); // Thêm trạng thái loading
    const itemsPerPage = 6;

    useEffect(() => {
        setLoading(true); // Bắt đầu tải
        fetchSanPham()
            .then((data) => {
                setSanPham(data);
                setFilteredSanPham(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false)); // Kết thúc tải
    }, []);

    useEffect(() => {
        let updatedSanPham = [...sanPham];

        // Tìm kiếm
        if (searchTerm) {
            updatedSanPham = updatedSanPham.filter((product) =>
                product.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Lọc
        if (filter === 'price-asc') {
            updatedSanPham.sort((a, b) => a.giaTien - b.giaTien);
        } else if (filter === 'price-desc') {
            updatedSanPham.sort((a, b) => b.giaTien - a.giaTien);
        }

        setFilteredSanPham(updatedSanPham);
        setCurrentPage(1); // Reset về trang đầu khi tìm kiếm hoặc lọc
    }, [searchTerm, filter, sanPham]);

    // Phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSanPham.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredSanPham.length / itemsPerPage);

    return (
        <div className="p-5 pt-24 font-sans bg-neutral-100-100 min-h-screen">
            {/* <h1 className="text-center text-2xl font-bold mb-8 text-neutral-800"></h1> */}
            <div className="mb-4 flex justify-end items-center">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="border border-neutral-300 rounded px-4 py-2 w-full max-w-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="border border-neutral-300 rounded px-4 py-2 ml-4"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="">Lọc theo</option>
                    <option value="price-asc">Giá tăng dần</option>
                    <option value="price-desc">Giá giảm dần</option>
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {loading
                    ? Array.from({ length: itemsPerPage }).map((_, index) => (
                          <div
                              key={index}
                              className="border w-72 h-[400] border-neutral-300 rounded-lg p-4 text-center shadow-md bg-white animate-pulse"
                          >
                              <div className="w-full aspect-[10/12] bg-neutral-200 rounded mb-4"></div>
                              <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                              <div className="h-4 bg-neutral-200 rounded mb-4"></div>
                              <div className="h-6 bg-neutral-200 rounded"></div>
                          </div>
                      ))
                    : currentItems.map((product) => (
                          <div
                              key={product.maSanPhamDatMay}
                              className="border w-72 h-[400] border-neutral-300 rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow bg-white"
                          >
                              <div className="w-full aspect-[10/12] bg-neutral-200 rounded mb-4 overflow-hidden">
                                  <Image
                                      src={product.urlImage || '/placeholder-image.png'}
                                      alt={product.tenSanPham}
                                      width={250}
                                      height={5500}
                                      className="w-full h-full object-cover"
                                  />
                              </div>
                              <h2 className="font-semibold mb-2 text-neutral-800">{product.tenSanPham}</h2>
                              <p className="text-neutral-600 mb-4 text-sm">{product.moTaSanPham}</p>
                              <p className="font-bold text-neutral-800 mb-4">
                                  {product.giaTien ? product.giaTien.toLocaleString('vi-VN') : 'N/A'} VND
                              </p>
                              <button
                                  className="px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 transition-colors"
                                  onClick={() => alert(`Bạn đã chọn sản phẩm: ${product.tenSanPham}`)}
                              >
                                  Đặt May
                              </button>
                          </div>
                      ))}
            </div>
            {!loading && (
                <div className="mt-8 flex justify-center">
                    <button
                        className="px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 transition-colors mx-2"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Trang trước
                    </button>
                    <span className="px-4 py-2 text-neutral-800">
                        Trang {currentPage} / {totalPages}
                    </span>
                    <button
                        className="px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 transition-colors mx-2"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Trang sau
                    </button>
                </div>
            )}
        </div>
    );
};

export default SanPhamPage;
