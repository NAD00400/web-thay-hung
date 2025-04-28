'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import ImageUpload from './upload.img.sanpham';

interface SanPhamDatMay {
  ma_san_pham_dat_may: string;
  ten_san_pham: string;
  gia_tien: number;
  mo_ta_san_pham: string;
  ngay_tao: string;
  ngay_cap_nhat: string;
  co_san: boolean;
  url_image: string;
}

const ITEMS_PER_PAGE = 6;

export function SanPhamTable({ dataSP }: { dataSP: SanPhamDatMay[] }) {
  const [selectedSanPham, setSelectedSanPham] = useState<SanPhamDatMay | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const { register, handleSubmit, reset } = useForm();

  const totalPages = Math.ceil(dataSP.length / ITEMS_PER_PAGE);
  const currentData = dataSP.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const openModal = () => setShowModal(true);
  const closeModal = () => { setShowModal(false); setImageUrl(''); reset(); };
  const openDrawer = (sp: SanPhamDatMay) => { setSelectedSanPham(sp); setDrawerOpen(true); };
  const closeDrawer = () => { setDrawerOpen(false); setSelectedSanPham(null); };

  const onSubmit = (formData: any) => {
    if (!imageUrl) return alert('Bạn chưa upload ảnh sản phẩm');
    const newSP = {
      ...formData,
      gia_tien: Number(formData.gia_tien),
      url_image: imageUrl, // Đảm bảo rằng đây là URL ảnh đã được upload
      co_san: formData.co_san === 'true',
      ngay_tao: new Date().toISOString(),
      ngay_cap_nhat: new Date().toISOString(),
    };
    console.log('Thêm sản phẩm:', newSP);
    // API call thêm sản phẩm...
    closeModal();
  };
  return (
    <div className="h-screen p-6 flex flex-col space-y-4 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
        <Button onClick={openModal}>Thêm sản phẩm</Button>
      </div>

      {/* Product Table */}
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
                  <TableHead className="w-1/4">Giá</TableHead>
                  <TableHead className="w-1/4 text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map(sp => (
                  <TableRow key={sp.ma_san_pham_dat_may} className="hover:bg-gray-100">
                    <TableCell onClick={() => openDrawer(sp)} className="cursor-pointer">
                      {sp.ten_san_pham}
                    </TableCell>
                    <TableCell>{sp.gia_tien.toLocaleString()} VND</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" onClick={() => openDrawer(sp)}>Xem</Button>
                      <Button size="sm" variant="destructive">Xoá</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
  <DrawerContent className="px-0">
    <DrawerHeader className="text-center border-b">
      <DrawerTitle className="text-xl">Chi tiết sản phẩm</DrawerTitle>
    </DrawerHeader>

    {/* Body */}
    <div className="p-6 space-y-6 bg-muted/50 h-full overflow-y-auto">
      {selectedSanPham && (
        <div className="flex gap-2.5">
          {/* Hình ảnh sản phẩm */}
          <div className="w-96 relative rounded-xl overflow-hidden shadow-md">
            <Image 
              src={selectedSanPham.url_image} 
              fill 
              alt={selectedSanPham.ten_san_pham} 
              className="object-cover" 
            />
          </div>

          {/* Form thông tin */}
          <div className="space-y-4 w-full">
            <div className="space-y-2">
              <Label>Tên sản phẩm</Label>
              <Input value={selectedSanPham.ten_san_pham} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Giá tiền (VND)</Label>
              <Input value={selectedSanPham.gia_tien.toLocaleString()} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Mô tả sản phẩm</Label>
              <Textarea value={selectedSanPham.mo_ta_san_pham || 'Không có mô tả.'} readOnly rows={4} />
            </div>

            <div className="space-y-2">
              <Label>Ngày tạo</Label>
              <Input value={new Date(selectedSanPham.ngay_tao).toLocaleDateString()} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Ngày cập nhật</Label>
              <Input value={new Date(selectedSanPham.ngay_cap_nhat).toLocaleDateString()} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Loại sản phẩm</Label>
              <Input value={selectedSanPham.co_san ? 'Có sẵn' : 'Đặt may'} readOnly />
            </div>
          </div>
        </div>
      )}
    </div>

    <DrawerFooter className="border-t">
      <Button variant="secondary" className="ml-auto" onClick={closeDrawer}>
        Đóng
      </Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
      {/* Modal thêm sản phẩm */}
      {showModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-lg">
    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
      <h2 className="text-2xl text-gray-800 font-semibold mb-4">Thêm Sản Phẩm</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('ten_san_pham', { required: true })}
          placeholder="Tên sản phẩm"
          className="border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Input
          {...register('gia_tien', { required: true })}
          type="number"
          placeholder="Giá tiền"
          className="border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Textarea
          {...register('mo_ta_san_pham')}
          placeholder="Mô tả sản phẩm"
          className="border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Select {...register('co_san')}>
          <SelectTrigger className="border-gray-300"><SelectValue placeholder="Loại sản phẩm" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Có sẵn</SelectItem>
            <SelectItem value="false">Đặt may</SelectItem>
          </SelectContent>
        </Select>
        <ImageUpload onUploadSuccess={(url) => setImageUrl(url)} />

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="secondary" onClick={closeModal} className="bg-gray-500 hover:bg-gray-600 text-white">Hủy</Button>
          <Button type="submit" disabled={!imageUrl} className="bg-blue-600 hover:bg-blue-700 text-white">Lưu</Button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
}
