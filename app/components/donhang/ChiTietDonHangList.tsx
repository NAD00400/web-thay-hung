export default function ChiTietDonHangList({ chiTietDonHang }: { chiTietDonHang: any[] }) {
  if (!chiTietDonHang || chiTietDonHang.length === 0) {
    return <div className="text-sm text-gray-400">Không có sản phẩm nào trong đơn hàng</div>;
  }

  return (
    <div className="space-y-3">
      {chiTietDonHang.map((ct, i) => (
        <div key={i} className="border border-zinc-700 bg-zinc-50 opacity-45 p-4 rounded-xl text-sm space-y-1">
          <div>
            <span className="font-medium ">Sản phẩm:</span> {ct.san_pham.ten_san_pham}
          </div>
          <div>
            <span className="font-medium ">Số lượng:</span> {ct.so_luong}
          </div>
          <div>
            <span className="font-medium ">Giá:</span> {Number(ct.gia_tien).toLocaleString()}đ
          </div>
          {ct.SoDoDatMay && (
            <div className="mt-2 text-sm text-zinc-900">
              <span className="font-medium ">Số đo:</span>{" "}
              ngực {ct.SoDoDatMay.vong_nguc}, eo {ct.SoDoDatMay.vong_eo}, vai {ct.SoDoDatMay.be_ngang_vai}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
