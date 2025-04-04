import KhachHangTable from "@/app/components/khachhang/khachhang.table"
import { fetchKhachHang } from "@/app/lib/fetchData"

export default async function KhachHangPage(){
    const dataKh= await fetchKhachHang()
    // console.log(JSON.stringify(dataKh, null, 2));
    
    return(
        <>
            <KhachHangTable dataKH={dataKh}></KhachHangTable>
        </>
    )
}