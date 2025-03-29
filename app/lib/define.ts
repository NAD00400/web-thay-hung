// Define TypeScript interfaces for the application
// This file contains the definitions for various entities used in the application
// including SanPham, DanhMuc, PhuLieu, and SanPhamDatMay.
// Each interface defines the structure of the object, including its properties and types.
// The interfaces are used to ensure type safety and provide better code completion in TypeScript.
// Define the structure of a SanPham object
interface SanPhamDatMay {
    maSanPhamDatMay: string;
    maDanhMuc: string;
    tenSanPham: string;
    giaTien: number;
    moTaSanPham: string;
    urlImage: string;
    ngayTao: Date;
    ngayCapNhat: Date;
    coSan: boolean;
    maPhuLieu?: string;
    danhMuc: {
        maDanhMuc: string;
    };
    phuLieu?: {
        maPhuLieu: string;
    };
    chiTietDonHang: Array<{
        // Define the structure of ChiTietDonHang if needed
    }>;
}