'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import Image from 'next/image';

export type OrderStatus = 'CHO_XAC_NHAN' | 'DANG_MAY' | 'MAY_XONG';
export interface KhachHangInfo {
  ma_khach_hang: string;
  ten_khach_hang: string;
  so_dien_thoai: string;
  dia_chi_khach_hang: string;
}
export interface OrderDetail {
  ma_don_hang: string;
  ngay_dat_hang: string;
  ghi_chu: string | null;
  trang_thai_don_hang: OrderStatus;
  khach_hang: KhachHangInfo;
}

type OrderRow = Pick<OrderDetail, 'ma_don_hang' | 'ngay_dat_hang' | 'trang_thai_don_hang' | 'khach_hang'>;

interface DonHangTableProps {
  dataOrder: OrderRow[];
}

export default function DonHangTable({ dataOrder }: DonHangTableProps) {
  const [orders] = useState<OrderRow[]>(dataOrder);
  const [selected, setSelected] = useState<OrderDetail | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<OrderDetail>();
  const [mode, setMode] = useState<'view' | 'create'>('view');

  const openDetail = async (ma: string) => {
    try {
      const res = await fetch(`/api/don-hang/${ma}`);
      if (!res.ok) throw new Error();
      const data: OrderDetail = await res.json();
      setSelected(data);
      reset(data);
      setDrawerOpen(true);
      toast.success('Đã tải chi tiết');
    } catch {
      toast.error('Không tải được chi tiết');
    }
  };

  const onSave = async (formData: OrderDetail) => {
    try {
      // TODO: call update API
      toast.success('Lưu thành công');
      setDrawerOpen(false);
    } catch {
      toast.error('Lưu thất bại');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Danh sách đơn hàng</h2>
        <Button onClick={() => {
          setMode('create');
          reset(); // Clear form
          setDrawerOpen(true);
        }}>
          + Tạo đơn hàng
        </Button>
      </div>

      <div className="overflow-auto bg-white shadow-md rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Số ĐH</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Ngày đặt</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.ma_don_hang} className="hover:bg-gray-50">
                <TableCell>{order.ma_don_hang}</TableCell>
                <TableCell>{order.khach_hang.ten_khach_hang}</TableCell>
                <TableCell>{new Date(order.ngay_dat_hang).toLocaleDateString()}</TableCell>
                <TableCell>{order.trang_thai_don_hang}</TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => openDetail(order.ma_don_hang)}>
                    Xem
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Drawer open={drawerOpen} onOpenChange={() => setDrawerOpen(false)}>
        <DrawerContent className="flex flex-col h-full">
          <DrawerHeader>
            <DrawerTitle>Chi tiết Đơn hàng</DrawerTitle>
            <DrawerClose />
          </DrawerHeader>
          <form onSubmit={handleSubmit(onSave)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {/* Mã đơn hàng */}
              <div>
                <label className="block text-sm font-medium mb-1">Mã đơn hàng</label>
                <Input {...register('ma_don_hang')} disabled />
              </div>
              {/* Ngày đặt hàng */}
              <div>
                <label className="block text-sm font-medium mb-1">Ngày đặt</label>
                <Input type="text" {...register('ngay_dat_hang')} disabled />
              </div>
              {/* Ghi chú */}
              <div>
                <label className="block text-sm font-medium mb-1">Ghi chú</label>
                <Textarea {...register('ghi_chu')} />
              </div>
              {/* Thông tin khách hàng */}
              <div>
                <label className="block text-sm font-medium mb-1">Tên khách hàng</label>
                <Input {...register('khach_hang.ten_khach_hang')} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                <Input {...register('khach_hang.so_dien_thoai')} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Địa chỉ khách hàng</label>
                <Input {...register('khach_hang.dia_chi_khach_hang')} />
              </div>
              {/* Trạng thái */}
              <div>
                <label className="block text-sm font-medium mb-1">Trạng thái</label>
                <Select {...register('trang_thai_don_hang')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CHO_XAC_NHAN">Chờ xác nhận</SelectItem>
                    <SelectItem value="DANG_MAY">Đang may</SelectItem>
                    <SelectItem value="MAY_XONG">May xong</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DrawerFooter className="flex justify-end space-x-2 p-4">
              <Button variant="outline" onClick={() => setDrawerOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">Lưu</Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
