'use client'
import { useState, useEffect } from "react";

interface SanPhamDatMay {
  maSanPhamDatMay: string;
  tenSanPham: string;
  giaTien: number;
  moTaSanPham: string;
  ngayTao: string;
  ngayCapNhat: string;
  coSan: boolean;
  urlImage: string;
}

export function SanPhamTable({ dataSP }: { dataSP: SanPhamDatMay[] }) {
  const [selectedSanPham, setSelectedSanPham] = useState<SanPhamDatMay | null>(null);

  // Mặc định chọn sản phẩm đầu tiên
  useEffect(() => {
    if (dataSP && dataSP.length > 0) {
      setSelectedSanPham(dataSP[0]);
    }
  }, [dataSP]);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Phần hiển thị chi tiết sản phẩm */}
      <div className="bg-white shadow-lg rounded-xl p-6 md:col-span-1">
      {selectedSanPham ? (
        <>
        <h2 className="text-xl font-bold mb-4">Chi Tiết Sản Phẩm</h2>
        <img
          src={selectedSanPham.urlImage}
          alt={selectedSanPham.tenSanPham}
          className="w-full  object-cover rounded mb-4"
        />
        <p><strong>Tên Sản Phẩm:</strong> {selectedSanPham.tenSanPham}</p>
        <p><strong>Giá Tiền:</strong> {selectedSanPham.giaTien.toLocaleString()} VND</p>
        <p><strong>Mô Tả:</strong> {selectedSanPham.moTaSanPham}</p>
        <p><strong>Ngày Tạo:</strong> {new Date(selectedSanPham.ngayTao).toLocaleDateString()}</p>
        <p><strong>Ngày Cập Nhật:</strong> {new Date(selectedSanPham.ngayCapNhat).toLocaleDateString()}</p>
        <p><strong>Loại:</strong> {selectedSanPham.coSan ? "Có sẵn" : "Đặt may"}</p>
        </>
      ) : (
        <p className="text-gray-800">Không có sản phẩm nào được chọn.</p>
      )}
      </div>

      {/* Phần danh sách sản phẩm */}
      <div className="md:col-span-2">
      <table className="w-full table-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <thead className="bg-gray-100">
        <tr>
          {["Tên Sản Phẩm", "Giá Tiền", "Mô Tả", "Ngày Tạo", "Loại", "Hành Động"].map((header) => (
          <th key={header} className="px-4 py-3 text-left font-semibold text-gray-800 border-b border-neutral-200">
            {header}
          </th>
          ))}
        </tr>
        </thead>
        <tbody>
        {dataSP && dataSP.length > 0 ? (
          dataSP.map((sanpham) => (
          <tr
            key={sanpham.maSanPhamDatMay}
            className="border-b border-neutral-200 bg-white hover:bg-gray-100 transition"
          >
            <td className="px-4 py-3">{sanpham.tenSanPham}</td>
            <td className="px-4 py-3">{sanpham.giaTien.toLocaleString()} VND</td>
            <td className="px-4 py-3 truncate max-w-xs" title={sanpham.moTaSanPham}>
            {sanpham.moTaSanPham}
            </td>
            <td className="px-4 py-3">{new Date(sanpham.ngayTao).toLocaleDateString()}</td>
            <td className={`px-4 py-3 font-semibold ${sanpham.coSan ? "text-green-700" : "text-red-700"}`}>
            {sanpham.coSan ? "Có sẵn" : "Đặt may"}
            </td>
            <td className="px-4 py-3">
            <button
              className="bg-blue-600 text-white px-4 py-1 rounded-lg shadow-md hover:bg-blue-700 transition"
              onClick={() => setSelectedSanPham(sanpham)}
            >
              Chọn
            </button>
            </td>
          </tr>
          ))
        ) : (
          <tr>
          <td colSpan={7} className="text-center py-4 text-gray-800">
            Không có sản phẩm nào.
          </td>
          </tr>
        )}
        </tbody>
      </table>
      </div>
    </div>
  );
}