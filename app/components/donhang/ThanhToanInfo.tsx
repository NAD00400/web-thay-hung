export default function ThanhToanInfo({ thanhToan }: { thanhToan: any }) {
    if (!thanhToan) {
      return <div className="text-sm text-gray-400">Không có thông tin thanh toán</div>;
    }
  
    return (
      <div className="space-y-2 text-sm text-white">
        <div>
          <span className="font-medium">Phương thức:</span> {thanhToan.paymentMethod}
        </div>
        <div>
          <span className="font-medium">Loại:</span> {thanhToan.paymentType}
        </div>
        <div>
          <span className="font-medium">Trạng thái:</span> {thanhToan.paymentStatus}
        </div>
        <div>
          <span className="font-medium">Ngày thanh toán:</span> {thanhToan.paymentDate}
        </div>
      </div>
    );
  }
  