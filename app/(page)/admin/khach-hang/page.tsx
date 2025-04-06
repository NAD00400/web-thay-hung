import KhachHangTable from "@/app/components/khachhang/khachhang.table"
import { fetchKhachHang } from "@/app/lib/fetchData"

export default async function KhachHangPage(){
    const dataKh= await fetchKhachHang()
    return(
        <>
            <KhachHangTable dataKH={dataKh}></KhachHangTable>
        </>
    )
}