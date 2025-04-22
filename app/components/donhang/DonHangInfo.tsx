export default function DonHangInfo({ donHang }: { donHang: any }) {
    if (!donHang) {
      return <div className="text-sm text-gray-400">Không có thông tin đơn hàng</div>;
    }
  
    return (
      <div className="space-y-2 text-sm text-white">
        <div>
          <span className="font-medium">Mã đơn:</span> {donHang.ma_don_hang}
        </div>
        <div>
          <span className="font-medium">Ngày đặt:</span>{" "}
          {new Date(donHang.ngay_dat_hang).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        <div>
          <span className="font-medium">Khách hàng:</span> {donHang.khach_hang?.ten_khach_hang || "Không có"}
        </div>
        <div>
          <span className="font-medium">Ghi chú:</span> {donHang.ghi_chu || "Không có"}
        </div>
        <div>
          <span className="font-medium">Trạng thái:</span> {donHang.trang_thai_don_hang}
        </div>
      </div>
    );
  }
  