export default function StepConfirm({ data }: { data: any }) {
    return (
      <div className="space-y-4 text-sm text-gray-700">
        <div>
          <h4 className="font-semibold">Khách hàng:</h4>
          <p>Họ tên: {data.customerInfo.name}</p>
          <p>SĐT: {data.customerInfo.phone}</p>
        </div>
  
        <div>
          <h4 className="font-semibold">Số đo:</h4>
          <p>Ngực: {data.measurements.chest} cm</p>
          <p>Eo: {data.measurements.waist} cm</p>
          <p>Dài quần: {data.measurements.pantsLength} cm</p>
        </div>
  
        <div>
          <h4 className="font-semibold">Thanh toán:</h4>
          <p>Phương thức: {data.payment.method}</p>
          <p>Đã thanh toán: {data.payment.paid?.toLocaleString()} VND</p>
        </div>
  
        {data.note && (
          <div>
            <h4 className="font-semibold">Ghi chú:</h4>
            <p>{data.note}</p>
          </div>
        )}
      </div>
    )
  }
  