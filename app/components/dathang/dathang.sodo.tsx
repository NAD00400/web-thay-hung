export default function StepMeasurements({ data, onChange }: {
    data: any, onChange: (data: any) => void
  }) {
    return (
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Vòng ngực (cm)"
          value={data.chest || ""}
          onChange={e => onChange({ ...data, chest: e.target.value })}
          className="w-full border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Vòng eo (cm)"
          value={data.waist || ""}
          onChange={e => onChange({ ...data, waist: e.target.value })}
          className="w-full border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Chiều dài quần (cm)"
          value={data.pantsLength || ""}
          onChange={e => onChange({ ...data, pantsLength: e.target.value })}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
    )
  }
  