export default function StepCustomerInfo({ data, onChange }: {
    data: any, onChange: (data: any) => void
  }) {
    return (
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Họ tên khách"
          value={data.name || ""}
          onChange={e => onChange({ ...data, name: e.target.value })}
          className="w-full border px-2 py-1 rounded"
        />
        <input
          type="tel"
          placeholder="Số điện thoại"
          value={data.phone || ""}
          onChange={e => onChange({ ...data, phone: e.target.value })}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
    )
  }
  