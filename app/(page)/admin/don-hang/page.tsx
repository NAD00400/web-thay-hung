

import DonHangTable from "@/app/components/donhang/donhang.table";
import { fetchDonHang, fetchDonHangChiTiet} from "@/app/lib/fetchData";



export default async function OrderManagementPage (){
  
  const dataOrder = await fetchDonHang()
  // const dataOrderDetail = await fetchDonHangChiTiet("some-id") // Replace "some-id" with the actual id value
  
  return(
    <>
      <DonHangTable dataOrder={dataOrder}></DonHangTable>
    </>
  )
  
};




