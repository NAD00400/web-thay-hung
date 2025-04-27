export default function GiaoHangInfo({ giaoHang }: { giaoHang: any }) {
    if (!giaoHang) {
      return <div className="text-sm text-gray-400">Không có thông tin giao hàng</div>;
    }
  
    return (
      <div className="space-y-2 text-sm text-white">
        <div>
          <span className="font-medium">Địa chỉ:</span> {giaoHang.dia_chi_giao_hang}
        </div>
        <div>
          <span className="font-medium">Phí:</span> {Number(giaoHang.phi_van_chuyen).toLocaleString()}đ
        </div>
        <div>
          <span className="font-medium">Ngày giao dự kiến:</span> {giaoHang.ngay_giao_du_kien}
        </div>
        <div>
          <span className="font-medium">Trạng thái:</span> {giaoHang.trang_thai}
        </div>
      </div>
    );
  }
  