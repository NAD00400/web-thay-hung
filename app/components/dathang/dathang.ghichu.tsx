export default function StepNote({ value, onChange }: {
    value: string, onChange: (val: string) => void
  }) {
    return (
      <div>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Ghi chú cho đơn hàng (nếu có)..."
          className="w-full h-32 border px-2 py-1 rounded resize-none"
        />
      </div>
    )
  }
  