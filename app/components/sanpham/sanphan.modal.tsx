
'use client';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SanPhamDatMay } from "./sanpham.table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ImageUpload from "./upload.img.sanpham";
import { Button } from "@/components/ui/button";

export default function ProductModal({ isOpen, onClose, onCreate }: { isOpen: boolean; onClose: () => void; onCreate: (item: SanPhamDatMay) => void }) {
    const { register, handleSubmit, reset } = useForm<any>();
    const [imageUrl, setImageUrl] = useState<string>('');
  
    const submit = async (data: any) => {
      if (!imageUrl) return toast.error('Chưa chọn ảnh');
      const payload = {
        ...data,
        gia_tien: Number(data.gia_tien),
        co_san: data.co_san === 'true',
        url_image: imageUrl,
        ngay_tao: new Date().toISOString(),
        ngay_cap_nhat: new Date().toISOString(),
        danh_muc: { ma_danh_muc: 'default-category-id' },
      };
      try {
        const res = await fetch('/api/san-pham-dat-may', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const newItem = await res.json();
        toast.success('Thêm thành công');
        onCreate(newItem);
        reset();
        setImageUrl('');
        onClose();
      } catch {
        toast.error('Thêm thất bại');
      }
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm sản phẩm</DialogTitle>
            <DialogDescription>Nhập thông tin và upload ảnh</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <Input {...register('ten_san_pham', { required: true })} placeholder="Tên sản phẩm" />
            <Input {...register('gia_tien', { required: true })} type="number" placeholder="Giá tiền" />
            <Textarea {...register('mo_ta_san_pham')} placeholder="Mô tả" rows={3} />
            <Select {...register('co_san', { required: true })}> 
              <SelectTrigger><SelectValue placeholder="Loại sản phẩm" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Có sẵn</SelectItem>
                <SelectItem value="false">Đặt may</SelectItem>
              </SelectContent>
            </Select>
            <div className="space-y-2">
              <Label>Ảnh sản phẩm</Label>
              <ImageUpload onUploadSuccess={setImageUrl} />
            </div>
            <DialogFooter className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onClose}>Hủy</Button>
              <Button type="submit">Lưu</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }