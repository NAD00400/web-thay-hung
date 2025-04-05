'use client';

import { SanPhamDatMay } from "@prisma/client";
import Image from "next/image";
import { useEffect } from "react";
import { useState } from "react";
const itemsPerPage = 6;

const SanPhamList = ({ sanPham }: { sanPham: SanPhamDatMay[] }) => {
    const [filteredSanPham, setFilteredSanPham] = useState<SanPhamDatMay[]>(sanPham);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        let updatedSanPham = [...sanPham];

        // Tìm kiếm
        if (searchTerm) {
            updatedSanPham = updatedSanPham.filter((product) =>
                product.ten_san_pham.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Lọc theo giá
        if (filter === 'price-asc') {
            updatedSanPham.sort((a, b) => a.gia_tien - b.gia_tien);
        } else if (filter === 'price-desc') {
            updatedSanPham.sort((a, b) => b.gia_tien - a.gia_tien);
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
        <>
            <div className="mb-6 flex justify-between items-center bg-neutral-100 p-4 rounded-lg shadow-sm">
                <input
                    type="text"
                    placeholder="🔍 Tìm kiếm sản phẩm..."
                    className="border border-neutral-300 bg-neutral-50 rounded-lg px-4 py-2 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
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
                {currentItems.map((product) => (
                    <div
                        key={product.ma_san_pham_dat_may}
                        className="border border-neutral-300 rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow bg-neutral-50"
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
                        <h2 className="font-semibold mb-2 text-neutral-800">{product.ten_san_pham}</h2>
                        <p className="text-neutral-600 mb-4 text-sm">{product.mo_ta_san_pham}</p>
                        <p className="font-bold text-neutral-900 mb-4">
                            {product.gia_tien ? product.gia_tien.toLocaleString('vi-VN') : 'N/A'} VND
                        </p>
                        <button
                            className="px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors w-full"
                            onClick={() => alert(`Bạn đã chọn sản phẩm: ${product.ten_san_pham}`)}
                        >
                            🛒 Đặt May
                        </button>
                    </div>
                ))}
            </div>

            {filteredSanPham.length > itemsPerPage && (
                <div className="mt-8 flex justify-center items-center gap-4">
                    <button
                        className="px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors disabled:bg-neutral-400"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        ◀ Trang trước
                    </button>
                    <span className="text-neutral-800 font-medium">
                        Trang {currentPage} / {totalPages}
                    </span>
                    <button
                        className="px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors disabled:bg-neutral-400"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Trang sau ▶
                    </button>
                </div>
            )}
        </>
    );
};

export default SanPhamList;
