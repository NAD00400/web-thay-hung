'use client';

import React, { useState } from 'react';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogFooter, AlertDialogTitle,
  AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface IKhachHang {
  ma_khach_hang: string;
  ten_khach_hang: string;
  ma_nguoi_dung: string;
  so_dien_thoai: string;
  dia_chi_khach_hang: string;
  nguoi_dung?: { email_nguoi_dung: string };
  don_hang?: {
    ma_don_hang: string;
    chi_tiet_don_hang: { san_pham: { ten_san_pham: string } }[];
  }[];
}

export default function KhachHangTable({ dataKH }: { dataKH: IKhachHang[] }) {
  const [customers, setCustomers] = useState<IKhachHang[]>(dataKH);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<IKhachHang | null>(null);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const toggleRow = (id: string) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const confirmDelete = (id: string) => {
    setToDeleteId(id);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!toDeleteId) return;
    setLoadingDelete(true);
    try {
      const res = await fetch(`/api/khach-hang/${toDeleteId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Xóa thất bại');
      setCustomers(prev => prev.filter(c => c.ma_khach_hang !== toDeleteId));
      toast.success('Đã xóa khách hàng');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoadingDelete(false);
      setDeleteOpen(false);
    }
  };

  const handleEditOpen = (customer: IKhachHang) => {
    setEditingCustomer({ ...customer });
  };

  const handleSaveEdit = async () => {
    if (!editingCustomer) return;
    setLoadingSave(true);
    try {
      const res = await fetch(`/api/khach-hang/${editingCustomer.ma_khach_hang}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ten_khach_hang: editingCustomer.ten_khach_hang,
          dia_chi_khach_hang: editingCustomer.dia_chi_khach_hang,
          so_dien_thoai: editingCustomer.so_dien_thoai,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Cập nhật thất bại');
      setCustomers(prev =>
        prev.map(c =>
          c.ma_khach_hang === editingCustomer.ma_khach_hang ? editingCustomer : c
        )
      );
      toast.success('Cập nhật thành công');
      setEditingCustomer(null);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className=" text-white w-full">

      <Table className='rounded-md'>
        <TableHeader>
        <TableRow className="hover:bg-[#00000053]">

            <TableHead className="text-white">Tên</TableHead>
            <TableHead className="text-white">Điện Thoại</TableHead>
            <TableHead className="text-white">Địa Chỉ</TableHead>
            <TableHead className="text-white">Email</TableHead>
            <TableHead className="text-right text-white">Hành Động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map(kh => (
            <React.Fragment key={kh.ma_khach_hang}>
             <TableRow className="hover:bg-[#00000053]">
                <TableCell onClick={() => toggleRow(kh.ma_khach_hang)}>{kh.ten_khach_hang}</TableCell>
                <TableCell>{kh.so_dien_thoai}</TableCell>
                <TableCell>{kh.dia_chi_khach_hang}</TableCell>
                <TableCell>{kh.nguoi_dung?.email_nguoi_dung || 'N/A'}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => toggleRow(kh.ma_khach_hang)} className='text-black'>
                    {expandedRows.includes(kh.ma_khach_hang) ? 'Ẩn' : 'Xem'}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleEditOpen(kh)}>
                    Sửa
                  </Button>
                  <AlertDialog open={isDeleteOpen && toDeleteId === kh.ma_khach_hang} onOpenChange={setDeleteOpen}>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive" onClick={() => confirmDelete(kh.ma_khach_hang)}>
                        Xóa
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>Bạn có chắc muốn xóa khách hàng này không?</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button variant="destructive" onClick={handleDelete} disabled={loadingDelete}>
                            {loadingDelete && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                            Xóa
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
              {expandedRows.includes(kh.ma_khach_hang) && (
                <TableRow className="bg-[#0000005e] text-sm text-white hover:bg-[#0000005e]">

                  <TableCell colSpan={5}>
                    <div className="space-y-1">
                      <div><strong>Mã khách hàng:</strong> {kh.ma_khach_hang}</div>
                      <div><strong>Đơn hàng:</strong> {kh.don_hang?.flatMap(dh => dh.chi_tiet_don_hang.map(ct => ct.san_pham.ten_san_pham)).join(', ') || 'Không có'}</div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      {/* Edit Modal */}
      <Dialog open={!!editingCustomer} onOpenChange={() => setEditingCustomer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa thông tin</DialogTitle>
          </DialogHeader>
          {editingCustomer && (
            <div className="space-y-4">
              <Input
                placeholder="Tên khách hàng"
                value={editingCustomer.ten_khach_hang}
                onChange={e => setEditingCustomer(prev => prev ? { ...prev, ten_khach_hang: e.target.value } : null)}
              />
              <Input
                placeholder="Số điện thoại"
                value={editingCustomer.so_dien_thoai}
                onChange={e => setEditingCustomer(prev => prev ? { ...prev, so_dien_thoai: e.target.value } : null)}
              />
              <Input
                placeholder="Địa chỉ"
                value={editingCustomer.dia_chi_khach_hang}
                onChange={e => setEditingCustomer(prev => prev ? { ...prev, dia_chi_khach_hang: e.target.value } : null)}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCustomer(null)}>Hủy</Button>
            <Button onClick={handleSaveEdit} disabled={loadingSave}>
              {loadingSave && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
