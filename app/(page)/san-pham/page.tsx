'use client'
import { fetchSanPham } from '@/app/lib/fetchData';
import React, { useEffect, useState } from 'react';

const SanPhamPage: React.FC = () => {
    const [sanPham, setSanPham] = useState<SanPhamDatMay[]>([]);
    useEffect(() => {
        fetchSanPham().then(setSanPham).catch(console.error);
    }, []);
    return (
        <div className="p-5 font-sans bg-neutral-100-100 min-h-screen">
            <h1 className="text-center text-2xl font-bold mb-8 text-neutral-800">Sản Phẩm</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sanPham.map((product) => (
                    <div 
                        key={product.maSanPhamDatMay}
                        className="border border-neutral-300 rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow bg-white"
                    >
                        <div className="w-full aspect-[10/16] bg-gray-200 rounded mb-4 overflow-hidden">
                            <img 
                                src={product.urlImage || '/placeholder-image.png'} 
                                alt={product.tenSanPham} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h2 className="text-lg font-semibold mb-2 text-neutral-800">{product.tenSanPham}</h2>
                        <p className="text-neutral-600 mb-4">{product.moTaSanPham}</p>
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
        </div>
    );
};

export default SanPhamPage;
