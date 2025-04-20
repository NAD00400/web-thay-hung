import { Button } from "@/components/ui/button"

export default function OrderFooter({ step, onBack, onNext, onConfirm }: {
  step: number,
  onBack: () => void,
  onNext: () => void,
  onConfirm: () => void
}) {
  return (
    <div className="flex justify-between mt-6">
      {step > 0 && <Button onClick={onBack} variant="outline">Quay lại</Button>}
      {step < 4 && <Button onClick={onNext}>Tiếp tục</Button>}
      {step === 4 && <Button onClick={onConfirm}>Xác nhận</Button>}
    </div>
  )
}
