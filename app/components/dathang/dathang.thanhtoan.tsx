export default function StepPayment({ data, onChange }: {
    data: any, onChange: (data: any) => void
  }) {
    return (
      <div className="space-y-4">
        <select
          value={data.method || ""}
          onChange={e => onChange({ ...data, method: e.target.value })}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="">Chọn phương thức thanh toán</option>
          <option value="cash">Tiền mặt</option>
          <option value="bank">Chuyển khoản</option>
          <option value="card">Thẻ</option>
        </select>
        <input
          type="number"
          placeholder="Đã thanh toán (VND)"
          value={data.paid || ""}
          onChange={e => onChange({ ...data, paid: Number(e.target.value) })}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
    )
  }
  