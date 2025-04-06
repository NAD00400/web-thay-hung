
import { SanPhamTable } from "@/app/components/sanpham/sanpham.table"

import { fetchSanPham } from "@/app/lib/fetchData"

export default async function KhachHangPage(){
    const dataSp= await fetchSanPham()

    return(
        <>
            <SanPhamTable dataSP={dataSp}/>
        </>
    )
}