export function transformSanPham(data: any): SanPhamDatMay {
    return {
        maSanPhamDatMay: data.ma_san_pham_dat_may,
        maDanhMuc: data.ma_danh_muc,
        tenSanPham: data.ten_san_pham,
        giaTien: data.gia_tien,
        moTaSanPham: data.mo_ta_san_pham,
        urlImage: data.url_image,
        ngayTao: new Date(data.ngay_tao),
        ngayCapNhat: new Date(data.ngay_cap_nhat),
        coSan: data.co_san,
        maPhuLieu: data.ma_phu_lieu,
        danhMuc: {
            maDanhMuc: data.ma_danh_muc
        },
        chiTietDonHang: data.chi_tiet_don_hang || []
    };
}
