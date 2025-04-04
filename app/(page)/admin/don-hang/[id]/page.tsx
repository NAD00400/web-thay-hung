import OrderDetail from "@/app/components/donhang/donhang.detail"
import { fetchDonHangChiTiet, fetchKhachHangChiTiet } from "@/app/lib/fetchData"

export default async function ChiTietDonHangPage({params}:{params:{id:string}}){
    const dataOrderDetail = await fetchDonHangChiTiet(params.id)
    return(
    <>
        <OrderDetail order={dataOrderDetail}></OrderDetail>
    </>
    )
}