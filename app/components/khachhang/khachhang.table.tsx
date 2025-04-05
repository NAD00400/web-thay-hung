'use client'
import React from "react";
import { useState } from "react";

interface IKhachHang {
  ma_khach_hang: string;
  ten_khach_hang: string;
  ma_nguoi_dung: string;
  so_dien_thoai: string;
  dia_chi_khach_hang: string;
  nguoi_dung?: {
    email_nguoi_dung: string;
  };
  don_hang?: {
    ma_don_hang: string;
    chi_tiet_don_hang: {
      san_pham: {
        ten_san_pham: string;
      };
    }[];
  }[];
}

export default function KhachHangTable({ dataKH }: { dataKH: IKhachHang[] }) {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRow = (ma_khach_hang: string) => {
    setExpandedRows((prev) =>
      prev.includes(ma_khach_hang)
        ? prev.filter((id) => id !== ma_khach_hang)
        : [...prev, ma_khach_hang]
    );
  };

  return (
    <div className="p-6">
      <table className="w-full table-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <thead className="bg-blue-950 text-white border-blue-950">
          <tr>
            {["Tên Khách Hàng", "Số Điện Thoại", "Địa Chỉ", "Email Người Dùng", "Hành Động"].map((header) => (
              <th key={header} className="px-4 py-3 text-left font-semibold  ">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataKH && dataKH.length > 0 ? (
            dataKH.map((khachhang) => (
              <React.Fragment key={khachhang.ma_khach_hang}>
                <tr className="border-b border-neutral-200 bg-white hover:bg-gray-100 transition">
                  <td className="px-4 py-3 font-medium">{khachhang.ten_khach_hang}</td>
                  <td className="px-4 py-3">{khachhang.so_dien_thoai}</td>
                  <td className="px-4 py-3">{khachhang.dia_chi_khach_hang}</td>
                  <td className="px-4 py-3">{khachhang.nguoi_dung?.email_nguoi_dung || "N/A"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleRow(khachhang.ma_khach_hang)}
                      className="text-black hover:text-blue-900 transition focus:outline-none focus:ring-2 focus:ring-blue-900 rounded px-3 py-1 border border-black/20"
                      aria-expanded={expandedRows.includes(khachhang.ma_khach_hang)}
                    >
                      {expandedRows.includes(khachhang.ma_khach_hang) ? "Ẩn Chi Tiết" : "Xem Chi Tiết"}
                    </button>
                  </td>
                </tr>
                {expandedRows.includes(khachhang.ma_khach_hang) && (
                  <tr className="bg-gray-50">
                    <td colSpan={5} className="px-4 py-3">
                      <div className="p-4 bg-gray-100 rounded-lg shadow-inner border border-gray-200">
                        <p className="mb-2">
                          <strong className="text-gray-700">Mã Khách Hàng:</strong> {khachhang.ma_khach_hang}
                        </p>
                        <p className="mb-2">
                          <strong className="text-gray-700">Số Điện Thoại:</strong> {khachhang.so_dien_thoai}
                        </p>
                        <p className="mb-2">
                          <strong className="text-blue-600">Địa Chỉ:</strong> <span className="text-gray-700">{khachhang.dia_chi_khach_hang}</span>
                        </p>
                        <p className="mb-2">
                          <strong className="text-gray-700">Email Người Dùng:</strong> {khachhang.nguoi_dung?.email_nguoi_dung || "N/A"}
                        </p>
                        <p>
                          <strong className="text-gray-700">Đơn Hàng:</strong>
                          {khachhang.don_hang && khachhang.don_hang.length > 0 ? (
                            <ul className="mt-2 list-disc list-inside text-gray-700">
                              {khachhang.don_hang.map((donHang, index) => (
                                <li key={index} className="mb-1">
                                  <strong className="text-gray-700">Mã Đơn Hàng:</strong> {donHang.ma_don_hang} - <strong className="text-gray-700">Sản Phẩm:</strong>{" "}
                                  {donHang.chi_tiet_don_hang.map((chiTiet, idx) => (
                                    <span key={idx}>
                                      {chiTiet.san_pham.ten_san_pham}
                                      {idx < donHang.chi_tiet_don_hang.length - 1 && ", "}
                                    </span>
                                  ))}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-gray-500"> Không có đơn hàng.</span>
                          )}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-800">
                Không có khách hàng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}