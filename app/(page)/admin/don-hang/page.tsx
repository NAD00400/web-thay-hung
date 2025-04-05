

import DonHangTable from "@/app/components/donhang/donhang.table";
import { fetchDonHang, fetchDonHangChiTiet } from "@/app/lib/fetchData";



export default async function OrderManagementPage (){
  
  const dataOrder = await fetchDonHang()
  console.log("dataOrder", JSON.stringify(dataOrder));
  
  return(
    <>
      <DonHangTable dataOrder={dataOrder}></DonHangTable>
    </>
  )
  
};




