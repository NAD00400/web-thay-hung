'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

import ProductModal from './sanphan.modal';
import ProductDrawer from './sanpham.drawe';

export interface SanPhamDatMay {
  ma_san_pham_dat_may: string;
  ten_san_pham: string;
  gia_tien: number;
  mo_ta_san_pham: string;
  ngay_tao: string;
  ngay_cap_nhat: string;
  co_san: boolean;
  url_image: string;
}

interface DonHangInfo {
  maDonHang: string;
  tenKhachHang: string;
}
interface ErrorData {
  soLuongDonHang: number;
  danhSachDonHang: DonHangInfo[];
}

interface SanPhamTableProps {
  dataSP: SanPhamDatMay[];
}

const ITEMS_PER_PAGE = 6;

export function SanPhamTable({ dataSP }: SanPhamTableProps) {
  const [products, setProducts] = useState<SanPhamDatMay[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selected, setSelected] = useState<SanPhamDatMay | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
  // New state for delete error dialog
  const [errorData, setErrorData] = useState<ErrorData | null>(null);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    setProducts(dataSP);
  }, [dataSP]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const pagedProducts = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const addProduct = (newItem: SanPhamDatMay) => setProducts([newItem, ...products]);
  const updateProduct = (upd: SanPhamDatMay) =>
    setProducts(products.map(p => p.ma_san_pham_dat_may === upd.ma_san_pham_dat_may ? upd : p));
  const deleteProduct = (id: string) => setProducts(products.filter(p => p.ma_san_pham_dat_may !== id));

  // Handle delete with error dialog
  const handleDelete = async (item: SanPhamDatMay) => {
    try {
      const res = await fetch(`/api/san-pham/${item.ma_san_pham_dat_may}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.status === 400) {
        // Product in orders, show dialog
        setErrorData({ soLuongDonHang: data.soLuongDonHang, danhSachDonHang: data.danhSachDonHang });
        setErrorDialogOpen(true);
      } else if (!res.ok) {
        toast.error(data.error || 'Xóa thất bại');
      } else {
        toast.success('Xóa thành công');
        deleteProduct(item.ma_san_pham_dat_may);
      }
    } catch (err) {
      toast.error('Lỗi kết nối khi xóa sản phẩm');
    }
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleOpenDrawer = (item: SanPhamDatMay) => {
    setSelected(item);
    setDrawerOpen(true);
  };
  const handleCloseDrawer = () => setDrawerOpen(false);

  return (
    <div className="h-screen p-6 flex flex-col space-y-4 bg-gray-50">
      {/* Header & Pagination */}
      <div className="flex justify-between items-center">
        <div className="space-x-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              size="sm"
              variant={currentPage === i + 1 ? 'default' : 'outline'}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
        <Button onClick={handleOpenModal}>Thêm sản phẩm</Button>
      </div>

      {/* Table */}
      <Card className="flex-1 overflow-auto">
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-200px)] p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/2">Tên</TableHead>
                  <TableHead className="w-1/4">Giá (VND)</TableHead>
                  <TableHead className="w-1/4 text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedProducts.map(item => (
                  <TableRow key={item.ma_san_pham_dat_may} className="hover:bg-gray-100">
                    <TableCell onClick={() => handleOpenDrawer(item)} className="cursor-pointer">
                      {item.ten_san_pham}
                    </TableCell>
                    <TableCell>{item.gia_tien.toLocaleString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" onClick={() => handleOpenDrawer(item)}>Xem</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">Xóa</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc muốn xóa sản phẩm “{item.ten_san_pham}”? Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="space-x-2">
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <Button onClick={() => handleDelete(item)}>Xóa</Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Error Dialog when delete fails due to existing orders */}
      <Dialog open={isErrorDialogOpen} onOpenChange={(open) => !open && setErrorDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Không thể xóa sản phẩm</DialogTitle>
            <DialogDescription>
              Sản phẩm đang ở trong {errorData?.soLuongDonHang} đơn hàng, không thể xóa.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {errorData?.danhSachDonHang.map((dh) => (
              <div key={dh.maDonHang} className="flex justify-between">
                <span>Đơn hàng: {dh.maDonHang}</span>
                <span>Khách: {dh.tenKhachHang}</span>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setErrorDialogOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Thêm / Sửa */}
      <ProductModal isOpen={isModalOpen} onClose={handleCloseModal} onCreate={addProduct} />

      {/* Drawer Chi tiết & Cập nhật */}
      {selected && (
        <ProductDrawer product={selected} isOpen={isDrawerOpen} onClose={handleCloseDrawer} onUpdate={updateProduct} />
      )}
    </div>
  );
}
