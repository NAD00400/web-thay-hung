// /c:/Thư mục mới/my production/học tập - NestJs/nhom-13/app/lib/fetchingData.ts

import { transformSanPham } from "./util";

export async function fetchSanPham() {
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/san-pham`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store', // Ensures fresh data is fetched
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.map(transformSanPham); // tên dữ liệu trong interface khac voi trong db nên phải viết thêm hàng để đổi tên trường dữ  liệu viết ở trong lib/utilutil
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

export async function fetchDonHang() {
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/don-hang`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store', // Ensures fresh data is fetched
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        // return data.map(transformSanPham); // tên dữ liệu trong interface khac voi trong db nên phải viết thêm hàng để đổi tên trường dữ  liệu viết ở trong lib/utilutil
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

export async function fetchKhachHang() {
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/khach-hang`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store', // Ensures fresh data is fetched
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        // return data.map(transformSanPham); // tên dữ liệu trong interface khac voi trong db nên phải viết thêm hàng để đổi tên trường dữ  liệu viết ở trong lib/utilutil
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}