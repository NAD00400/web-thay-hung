// /app/lib/fetchingData.ts

// Hàm dùng chung để gọi API
async function fetchData(endpoint: string) {
    try {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch ${endpoint}: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// ========== API CƠ BẢN ==========
export const fetchSanPham = () => fetchData('/api/san-pham');
export const fetchSanPhamChiTiet = (id: string) => fetchData(`/api/san-pham/${id}`);


export const fetchDonHang = () => fetchData('/api/don-hang');
export const fetchDonHangChiTiet = (id: string) => fetchData(`/api/don-hang/${id}`);

export const fetchKhachHang = (ma_khach_hang: string) => fetchData('/api/khach-hang');
export const fetchLichHen = () => fetchData('/api/lich-hen');
export const fetchNguoiDung = () => fetchData('/api/nguoi-dung');
export const fetchPhuLieu = () => fetchData('/api/phu-lieu');
export const fetchDanhMuc = () => fetchData('/api/danh-muc');

// ========== API LIÊN KẾT ==========
export const fetchDonHangChiTietByIdKhachHang = (id: string) =>
    fetchData(`/api/don-hang/khach-hang/${id}`);

export const fetchDonHangChiTietByIdSanPham = (id: string) =>
    fetchData(`/api/don-hang/san-pham/${id}`);

export const fetchDonHangChiTietByIdPhuLieu = (id: string) =>
    fetchData(`/api/don-hang/phu-lieu/${id}`);

export const fetchDonHangChiTietByIdLichHen = (id: string) =>
    fetchData(`/api/don-hang/lich-hen/${id}`);

export const fetchSanPhamByDanhMucId = (id: string) =>
    fetchData(`/api/san-pham/danh-muc/${id}`);

export const fetchDonHangChiTietByIdNguoiDung = (id: string) =>
    fetchData(`/api/don-hang/nguoi-dung/${id}`);

export const fetchNguoiDungByFirebaseId = (firebaseId: string) =>
    fetchData(`/api/nguoi-dung/firebase/${firebaseId}`);

export const fetchKhachHangByNguoiDungId = (NguoiDungId: string) =>
    fetchData(`/api/khach-hang/nguoi-dung/${NguoiDungId}`);

export const fetchGioHangByCustomerId = (cusId: string) =>
    fetchData(`/api/gio-hang/khach-hang/${cusId}`);
 
// ========== API KẾT HỢP ==========
export const fetchDonHangChiTietByIdKhachHangAndSanPham = (
    idKhachHang: string,
    idSanPham: string
) => fetchData(`/api/don-hang/khach-hang/${idKhachHang}/san-pham/${idSanPham}`);

export const fetchDonHangChiTietByIdKhachHangAndPhuLieu = (
    idKhachHang: string,
    idPhuLieu: string
) => fetchData(`/api/don-hang/khach-hang/${idKhachHang}/phu-lieu/${idPhuLieu}`);

export const fetchDonHangChiTietByIdKhachHangAndLichHen = (
    idKhachHang: string,
    idLichHen: string
) => fetchData(`/api/don-hang/khach-hang/${idKhachHang}/lich-hen/${idLichHen}`);

