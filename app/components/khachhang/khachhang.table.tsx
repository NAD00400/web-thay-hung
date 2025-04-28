'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface IKhachHang {
  ma_khach_hang: string
  ten_khach_hang: string
  ma_nguoi_dung: string
  so_dien_thoai: string
  dia_chi_khach_hang: string
  nguoi_dung?: { email_nguoi_dung: string }
  don_hang?: {
    ma_don_hang: string
    chi_tiet_don_hang: { san_pham: { ten_san_pham: string } }[]
  }[]
}

export default function KhachHangTable({ dataKH }: { dataKH: IKhachHang[] }) {
  const [customers, setCustomers] = useState<IKhachHang[]>(dataKH)
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [editingCustomer, setEditingCustomer] = useState<IKhachHang | null>(null)

  const toggleRow = (id: string) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa khách hàng này?')) return
    try {
      const res = await fetch(`/api/khach-hang/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (res.ok) {
        setCustomers(prev => prev.filter(c => c.ma_khach_hang !== id))
        alert(`Đã xóa khách hàng ${id}`)
      } else {
        alert(json.error || 'Xóa thất bại')
      }
    } catch {
      alert('Lỗi kết nối')
    }
  }

  const handleEditOpen = (customer: IKhachHang) => {
    setEditingCustomer({ ...customer })
  }

  const handleSaveEdit = async () => {
    if (!editingCustomer) return
    try {
      const res = await fetch(
        `/api/khach-hang/${editingCustomer.ma_khach_hang}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ten_khach_hang: editingCustomer.ten_khach_hang,
            dia_chi_khach_hang: editingCustomer.dia_chi_khach_hang,
            so_dien_thoai: editingCustomer.so_dien_thoai,
          }),
        }
      )
      const json = await res.json()
      if (res.ok) {
        setCustomers(prev =>
          prev.map(c =>
            c.ma_khach_hang === editingCustomer.ma_khach_hang
              ? editingCustomer
              : c
          )
        )
        setEditingCustomer(null)
        alert('Cập nhật thành công')
      } else {
        alert(json.error || 'Cập nhật thất bại')
      }
    } catch {
      alert('Lỗi kết nối')
    }
  }

  return (
    <Card className="p-4">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Điện Thoại</TableHead>
              <TableHead>Địa Chỉ</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Hành Động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map(kh => (
              <React.Fragment key={kh.ma_khach_hang}>
                <TableRow>
                  <TableCell>{kh.ten_khach_hang}</TableCell>
                  <TableCell>{kh.so_dien_thoai}</TableCell>
                  <TableCell>{kh.dia_chi_khach_hang}</TableCell>
                  <TableCell>{kh.nguoi_dung?.email_nguoi_dung ?? 'N/A'}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleRow(kh.ma_khach_hang)}
                    >
                      {expandedRows.includes(kh.ma_khach_hang)
                        ? 'Ẩn'
                        : 'Xem'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(kh.ma_khach_hang)}
                    >
                      Xóa
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditOpen(kh)}
                    >
                      Sửa
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedRows.includes(kh.ma_khach_hang) && (
                  <TableRow>
                    <TableCell colSpan={5} className="bg-gray-50">
                      <div className="space-y-2 p-4">
                        <div>
                          <strong>Mã:</strong> {kh.ma_khach_hang}
                        </div>
                        <div>
                          <strong>Đơn Hàng:</strong>{' '}
                          {kh.don_hang?.length
                            ? kh.don_hang
                                .map(d =>
                                  d.chi_tiet_don_hang
                                    .map(c => c.san_pham.ten_san_pham)
                                    .join(', ')
                                )
                                .join(' | ')
                            : 'Không có'}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>

        {/* Modal sửa */}
        <Dialog
          open={!!editingCustomer}
          onOpenChange={() => setEditingCustomer(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sửa Khách Hàng</DialogTitle>
            </DialogHeader>
            {editingCustomer && (
              <div className="space-y-4">
                <Input
                  placeholder="Tên"
                  value={editingCustomer.ten_khach_hang}
                  onChange={e =>
                    setEditingCustomer(prev =>
                      prev
                        ? { ...prev, ten_khach_hang: e.target.value }
                        : null
                    )
                  }
                />
                <Input
                  placeholder="Số điện thoại"
                  value={editingCustomer.so_dien_thoai}
                  onChange={e =>
                    setEditingCustomer(prev =>
                      prev
                        ? { ...prev, so_dien_thoai: e.target.value }
                        : null
                    )
                  }
                />
                <Input
                  placeholder="Địa chỉ"
                  value={editingCustomer.dia_chi_khach_hang}
                  onChange={e =>
                    setEditingCustomer(prev =>
                      prev
                        ? { ...prev, dia_chi_khach_hang: e.target.value }
                        : null
                    )
                  }
                />
              </div>
            )}
            <DialogFooter className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setEditingCustomer(null)}
              >
                Hủy
              </Button>
              <Button onClick={handleSaveEdit}>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
