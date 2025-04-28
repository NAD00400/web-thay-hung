'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { toast } from 'sonner';

// Types
export type OrderStatus = 'CHO_XAC_NHAN' | 'DANG_MAY' | 'MAY_XONG';
export interface KhachHangInfo { ma_khach_hang: string; ma_nguoi_dung: string; so_dien_thoai: string; dia_chi_khach_hang: string; ten_khach_hang: string; }
export interface SanPhamInfo { ma_san_pham_dat_may: string; ma_danh_muc: string; ten_san_pham: string; gia_tien: number; mo_ta_san_pham: string; url_image: string; ngay_tao: string; ngay_cap_nhat: string; co_san: boolean; ma_phu_lieu: string | null; }
export interface SoDoDatMay { ma_so_do: string; ma_chi_tiet_don_hang: string; vong_nguc: number; vong_eo: number; be_ngang_vai: number; vong_hong: number; chieu_dai_ao: number; chieu_dai_quan: number; createdAt: string; }
export interface ChiTietDonHangDetail { ma_chi_tiet_don_hang: string; ma_don_hang: string; ma_san_pham: string; so_luong: number; gia_tien: number; san_pham: SanPhamInfo; SoDoDatMay: SoDoDatMay; }
export interface GiaoHangInfo { ma_giao_hang: string; ma_don_hang: string; phi_van_chuyen: number; dia_chi_giao_hang: string; ngay_giao_du_kien: string | null; ngay_giao_thuc_te: string | null; trang_thai: string; }
export interface ThanhToanInfo { ma_thanh_toan: string; ma_don_hang: string; transactionId: string; createdAt: string; paymentDate: string; paymentType: string; paymentMethod: string; paymentStatus: string; }
export interface HoaDonInfo { ma_hoa_don: string; ma_don_hang: string; so_hoa_don: string; tien_can_thanh_toan: string; tien_da_thanh_toan: string; thue: string; ngay_phat_hanh: string; ngay_het_han_thanh_toan: string; ngay_cap_nhat: string; trang_thai_thanh_toan: string; }
export interface OrderDetail { ma_don_hang: string; ma_khach_hang: string; ngay_dat_hang: string; ghi_chu: string | null; ngay_cap_nhat: string; trang_thai_don_hang: OrderStatus; phuong_thuc_thanh_toan: string; khach_hang: KhachHangInfo; chi_tiet_don_hang: ChiTietDonHangDetail[]; giao_hang: GiaoHangInfo; thanh_toan: ThanhToanInfo; hoa_don: HoaDonInfo; }

interface DonHangBoardProps { dataOrder: Pick<OrderDetail, 'ma_don_hang' | 'ngay_dat_hang' | 'trang_thai_don_hang' | 'khach_hang'>[]; }

const STATUS_COLUMNS: { key: OrderStatus; label: string }[] = [
  { key: 'CHO_XAC_NHAN', label: 'Chờ xác nhận' },
  { key: 'DANG_MAY', label: 'Đang may' },
  { key: 'MAY_XONG', label: 'May xong' },
];

export default function DonHangBoard({ dataOrder }: DonHangBoardProps) {
  const [orders, setOrders] = useState(dataOrder);
  const [selected, setSelected] = useState<OrderDetail | null>(null);

  // Fetch chi tiết đơn hàng
  const handleDetailOrder = async (ma: string) => {
    try {
      const res = await fetch(`/api/don-hang/${ma}`, { method: 'GET' });
      if (!res.ok) throw new Error('Failed to fetch detail');
      const data: OrderDetail = await res.json();
      setSelected(data);
      toast.success('Đã tải chi tiết đơn hàng');
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải chi tiết');
    }
  };

  // Drag & drop
  const handleDragEnd = async (result: DropResult) => {
    const { draggableId, source, destination } = result;
    if (!destination || destination.droppableId === source.droppableId) return;
    const newStatus = destination.droppableId as OrderStatus;
    setOrders(prev =>
      prev.map(o => (o.ma_don_hang === draggableId ? { ...o, trang_thai_don_hang: newStatus } : o))
    );
    try {
      const res = await fetch('/api/don-hang/cap-nhat-trang-thai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ma_don_hang: draggableId, trang_thai_don_hang: newStatus }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setOrders(prev =>
        prev.map(o =>
          o.ma_don_hang === draggableId ? { ...o, trang_thai_don_hang: source.droppableId as OrderStatus } : o
        )
      );
      toast.error('Cập nhật trạng thái thất bại');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Quản lý Đơn hàng</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATUS_COLUMNS.map(({ key, label }) => (
            <Droppable droppableId={key} key={key}>
              {provided => (
                <div
                  ref={provided.innerRef}
                   {...provided.droppableProps}
                  className="bg-gray-50 p-4 rounded-lg shadow flex flex-col"
                >
                  <h3 className="font-medium mb-2 text-gray-700">{label}</h3>
                  <div className="flex-1 space-y-2 overflow-auto">
                    {orders
                      .filter(o => o.trang_thai_don_hang === key)
                      .map((order, idx) => (
                        <Draggable key={order.ma_don_hang} draggableId={order.ma_don_hang} index={idx}>
                          {(prov, snap) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              className={`bg-white p-3 rounded-lg shadow-sm cursor-pointer flex justify-between items-center transition ${
                                snap.isDragging ? 'ring-2 ring-blue-400' : ''
                              }`}
                              onClick={() => handleDetailOrder(order.ma_don_hang)}
                            >
                              <div>
                                <p className="font-semibold text-sm truncate">{order.ma_don_hang}</p>
                                <p className="text-xs text-gray-500">{order.khach_hang.ten_khach_hang}</p>
                              </div>
                              <p className="text-xs text-gray-400">{new Date(order.ngay_dat_hang).toLocaleDateString()}</p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {selected && (
        <Drawer open onOpenChange={() => setSelected(null)}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Chi tiết Đơn hàng: {selected.ma_don_hang}</DrawerTitle>
              <DrawerClose />
            </DrawerHeader>
            <div className="space-y-4 p-4 overflow-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
                <Textarea
                  value={selected.ghi_chu || ''}
                  onChange={e => setSelected(prev => prev ? { ...prev, ghi_chu: e.currentTarget.value } : null)}
                  className="w-full"
                  placeholder="Ghi chú"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên khách hàng</label>
                <Input
                  value={selected.khach_hang.ten_khach_hang}
                  onChange={e =>
                    setSelected(prev => prev ? { ...prev, khach_hang: { ...prev.khach_hang, ten_khach_hang: e.currentTarget.value } } : null)
                  }
                  placeholder="Tên khách hàng"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <Input
                  value={selected.khach_hang.so_dien_thoai}
                  onChange={e =>
                    setSelected(prev => prev ? { ...prev, khach_hang: { ...prev.khach_hang, so_dien_thoai: e.currentTarget.value } } : null)
                  }
                  placeholder="Số điện thoại"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Địa chỉ khách hàng</label>
                <Input
                  value={selected.khach_hang.dia_chi_khach_hang}
                  onChange={e =>
                    setSelected(prev => prev ? { ...prev, khach_hang: { ...prev.khach_hang, dia_chi_khach_hang: e.currentTarget.value } } : null)
                  }
                  placeholder="Địa chỉ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ngày đặt</label>
                <Input
                  type="datetime-local"
                  value={new Date(selected.ngay_dat_hang).toISOString().slice(0,16)}
                  onChange={e =>
                    setSelected(prev => prev ? { ...prev, ngay_dat_hang: new Date(e.currentTarget.value).toISOString() } : null)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <Select
                  value={selected.trang_thai_don_hang}
                  onValueChange={value =>
                    setSelected(prev => prev ? { ...prev, trang_thai_don_hang: value as OrderStatus } : null)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_COLUMNS.map(({ key, label }) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setSelected(null)}>Hủy</Button>
                <Button onClick={() => {/* TODO: call API to save */ toast.success('Đã lưu thay đổi');}}>Lưu</Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
