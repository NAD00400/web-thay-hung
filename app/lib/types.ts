
import { User } from "firebase/auth";

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

interface IOrder {
  ma_don_hang: string;
  ma_khach_hang: string;
  ngay_dat_hang: string;
  trang_thai_don_hang: string;
  tong_tien_don_hang: number;
  phuong_thuc_thanh_toan: string;
  thanh_toan_thanh_cong: boolean;
  ghi_chu: string | null;
  ngay_cap_nhat: string;
}
interface OrderDetailProps {
    order: {
      ma_don_hang: string;
      ngay_dat_hang: string;
      trang_thai_don_hang: string;
      tong_tien_don_hang: number;
      thanh_toan_thanh_cong: boolean;
      chi_tiet_don_hang: {
        san_pham: {
          ten_san_pham: string;
          hinh_anh: string;
          gia: number;
        };
        SoDoDatMay: {
          vong_nguc: number;
          vong_eo: number;
          vong_mong: number;
        };
        so_luong: number;
      }[];
    };
}
  
  
interface IUser {
  ma_nguoi_dung: string;
  ten_nguoi_dung: string;
  email_nguoi_dung: string;
  so_dien_thoai: string;
  link_anh_dai_dien: string;
}

interface ICustomer {
  ma_khach_hang: string;
  ten_khach_hang: string;
  dia_chi_khach_hang: string;
  nguoi_dung: IUser;
}
interface IKhachHang {
  ma_khach_hang: string; // Mã khách hàng
  ten_khach_hang: string; // Tên khách hàng
  so_dien_thoai: string; // Số điện thoại
  dia_chi_khach_hang: string; // Địa chỉ khách hàng
  nguoi_dung?: {
    email_nguoi_dung: string; // Email người dùng
  };
}
interface ILichHen {
  ma_lich_hen: string;
  ngay_hen: string;
  ngay_tao: string;
  trang: string;
  khach_hang: ICustomer;
}
 interface UserContextType {
  user: User | null;
  setUser?: (user: User | null) => void; // Add setUser to the context type
}