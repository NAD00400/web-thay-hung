
import { SanPhamTable } from "@/app/components/sanpham/sanpham.table"

import { fetchSanPham } from "@/app/lib/fetchData"

export default async function KhachHangPage(){
    const dataSp= await fetchSanPham()
    console.log(JSON.stringify(dataSp, null, 2));
    return(
        <>
            <SanPhamTable dataSP={dataSp}/>
        </>
    )
}