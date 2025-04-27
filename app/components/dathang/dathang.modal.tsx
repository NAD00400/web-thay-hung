import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import StepCustomerInfo from "./dathang.thongtin"
import StepMeasurements from "./dathang.sodo"
import StepPayment from "./dathang.thanhtoan"
import StepNote from "./dathang.ghichu"
import StepConfirm from "./dathang.xacnhan"
import OrderFooter from "./dathang.footer"
import { Button } from "@/components/ui/button"
type OrderModalProps = {
    open: boolean;
    products: {
      ten_san_pham: string;
      url_image: string;
      so_luong: number;
      gia_tien: number;
    }[];
  };
  
  export default function OrderModal({ open, products }: OrderModalProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [customerInfo, setCustomerInfo] = useState({});
    const [measurements, setMeasurements] = useState({});
    const [payment, setPayment] = useState({});
    const [note, setNote] = useState("");
  
    const steps = [
      { title: "Thông tin khách hàng", content: <StepCustomerInfo data={customerInfo} onChange={setCustomerInfo} /> },
      { title: "Số đo", content: <StepMeasurements data={measurements} onChange={setMeasurements} /> },
      { title: "Thanh toán", content: <StepPayment data={payment} onChange={setPayment} /> },
      { title: "Ghi chú", content: <StepNote value={note} onChange={setNote} /> },
      {
        title: "Xác nhận",
        content: <StepConfirm data={{ customerInfo, measurements, payment, note, products }} />
      },
    ];
  
    return (
      <Dialog open={open} onOpenChange={() => setCurrentStep(0)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{steps[currentStep].title}</DialogTitle>
          </DialogHeader>
  
          <div className="py-4">{steps[currentStep].content}</div>
  
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
            >
              Quay lại
            </Button>
            <Button
              onClick={() => {
                if (currentStep === steps.length - 1) {
                  // 👉 Gửi đơn hàng ở đây
                  console.log({ customerInfo, measurements, payment, note, products });
                } else {
                  setCurrentStep((prev) => prev + 1);
                }
              }}
            >
              {currentStep === steps.length - 1 ? "Xác nhận" : "Tiếp tục"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  