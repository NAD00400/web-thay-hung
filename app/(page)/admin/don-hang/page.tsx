import DonHangTable from "@/app/components/donhang/donhang.table";
import {fetchKhachHang, fetchSanPham} from "@/app/lib/fetchData";
export default async function OrderManagementPage (){
  const dataSp = await fetchSanPham();
  const dataKh= await fetchKhachHang();
  return(
    <>
      <DonHangTable  dataSp={dataSp} dataKh={dataKh}></DonHangTable>
    </>
  )
  
};




