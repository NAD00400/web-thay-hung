
import DonHangButton from "./donhang.button";


// Hàm xác định màu sắc cho trạng thái đơn hàng
const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    CHO_XAC_NHAN: "bg-neutral-200 text-neutral-700",
    DA_XAC_NHAN: "bg-blue-200 text-blue-800",
    DANG_GIAO: "bg-purple-200 text-purple-800",
    HOAN_THANH: "bg-green-200 text-green-800",
    DA_HUY: "bg-red-200 text-red-800",
  };
  return statusColors[status] || "bg-neutral-300 text-neutral-700";
};

// Hàm hiển thị trạng thái đơn hàng
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    CHO_XAC_NHAN: "Chờ xác nhận",
    DA_XAC_NHAN: "Đã xác nhận",
    DANG_GIAO: "Đang giao",
    HOAN_THANH: "Hoàn thành",
    DA_HUY: "Đã hủy",
  };
  return statusMap[status] || "Không xác định";
};

export default function DonHangTable({ dataOrder }: { dataOrder: IOrder[] }) {
  return (
    
    <div className="p-6">
      <table className="min-w-full table-auto  bg-white/40 backdrop-blur-lg shadow-lg rounded-xl overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            {["Mã Đơn Hàng", "Mã Khách Hàng", "Ngày Đặt", "Trạng Thái", "Tổng Tiền", "Thanh Toán", "Hành Động"].map((header) => (
              <th key={header} className="px-4 py-3 text-left font-semibold text-gray-800 border-b border-neutral-200">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataOrder && dataOrder.length > 0 ? (
            dataOrder.map((order) => (
              <tr key={order.ma_don_hang} className="border-b border-neutral-200 bg-white hover:bg-gray-100 transition">
                <td className="px-4 py-3">{order.ma_don_hang}</td>
                <td className="px-4 py-3">{order.ma_khach_hang}</td>
                <td className="px-4 py-3">{new Date(order.ngay_dat_hang).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-lg font-medium ${getStatusColor(order.trang_thai_don_hang)}`}>
                    {getStatusText(order.trang_thai_don_hang)}
                  </span>
                </td>
                <td className="px-4 py-3">{order.tong_tien_don_hang.toLocaleString()} VND</td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${order.thanh_toan_thanh_cong ? "text-green-700" : "text-red-700"}`}>
                    {order.thanh_toan_thanh_cong ? "Đã thanh toán" : "Chưa thanh toán"}
                  </span>
                </td>
                <td className="px-4 py-3">
                <DonHangButton orderId ={order.ma_don_hang}></DonHangButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-800">
                Không có đơn hàng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}