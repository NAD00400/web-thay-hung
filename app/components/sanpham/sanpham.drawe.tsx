
'use client';
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SanPhamDatMay } from "./sanpham.table";

export default function ProductDrawer({ product, isOpen, onClose, onUpdate }: { product: SanPhamDatMay; isOpen: boolean; onClose: () => void; onUpdate: (item: SanPhamDatMay) => void }) {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [formState, setFormState] = useState<SanPhamDatMay>(product);
  
    useEffect(() => {
      setFormState(product);
    }, [product]);
  
    const save = async () => {
      try {
        const res = await fetch(`/api/san-pham/${formState.ma_san_pham_dat_may}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ten_san_pham: formState.ten_san_pham,
            gia_tien: formState.gia_tien,
            mo_ta_san_pham: formState.mo_ta_san_pham,
            co_san: formState.co_san,
            url_image: formState.url_image,
          }),
        });
        if (!res.ok) throw new Error();
        toast.success('Cập nhật thành công');
        onUpdate(formState);
        setEditMode(false);
      } catch {
        toast.error('Cập nhật thất bại');
      }
    };
  
    return (
      <Drawer open={isOpen} onOpenChange={(o) => !o && onClose()}>
        <DrawerContent className="px-0">
          <DrawerHeader>
            <DrawerTitle>Chi tiết sản phẩm</DrawerTitle>
          </DrawerHeader>
          <div className="p-6 space-y-6 overflow-y-auto">
            <div className="flex gap-4">
              <div className="w-60 h-60 relative rounded-lg overflow-hidden">
                <Image src={formState.url_image} fill alt={formState.ten_san_pham} className="object-cover" />
              </div>
              <div className="w-full space-y-4">
                {/* Fields */}
                {['ten_san_pham', 'gia_tien', 'mo_ta_san_pham'].map(field => (
                  <div key={field} className="space-y-1">
                    <Label>{field === 'gia_tien' ? 'Giá tiền' : field === 'mo_ta_san_pham' ? 'Mô tả' : 'Tên sản phẩm'}</Label>
                    {field === 'mo_ta_san_pham' ? (
                      <Textarea
                        readOnly={!editMode}
                        rows={3}
                        value={formState.mo_ta_san_pham}
                        onChange={e => setFormState({ ...formState, mo_ta_san_pham: e.target.value })}
                      />
                    ) : (
                      <Input
                        readOnly={!editMode}
                        type={field === 'gia_tien' ? 'number' : 'text'}
                        value={field === 'gia_tien' ? formState.gia_tien : formState.ten_san_pham}
                        onChange={e =>
                          setFormState({
                            ...formState,
                            [field]: field === 'gia_tien' ? Number(e.target.value) : e.target.value,
                          } as any)
                        }
                      />
                    )}
                  </div>
                ))}
                <div className="space-y-1">
                  <Label>Loại sản phẩm</Label>
                  <Input readOnly value={formState.co_san ? 'Có sẵn' : 'Đặt may'} />
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter className="border-t">
            {editMode ? (
              <div className="flex justify-end space-x-2 w-full">
                <Button variant="outline" onClick={() => setEditMode(false)}>Hủy</Button>
                <Button onClick={save}>Lưu</Button>
              </div>
            ) : (
              <Button onClick={() => setEditMode(true)}>Sửa</Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
  