'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
// import { toast } from 'sonner';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { fetchDonHang, fetchSanPham, fetchKhachHang, fetchDonHangChiTiet } from '@/app/lib/fetchData';

export type OrderStatus = 'CHO_XAC_NHAN' | 'DANG_MAY' | 'MAY_XONG';
export type PaymentMethod = 'COD' | 'VNPAY';

export interface SoDo { vong_nguc: number; vong_eo: number; vong_hong: number; be_ngang_vai: number; chieu_dai_ao: number; chieu_dai_quan: number; }
export interface KhachHangInfo { ma_khach_hang: string; ten_khach_hang: string; so_dien_thoai: string; dia_chi_khach_hang: string; }
export interface PaymentDetail { ma_thanh_toan: string; paymentMethod: PaymentMethod; paymentStatus: string; paymentType: string; transactionId: string; }
export interface DeliveryDetail { ma_giao_hang: string; dia_chi_giao_hang: string; ngay_giao_du_kien: string | null; ngay_giao_thuc_te: string | null; phi_van_chuyen: number; trang_thai: string; }
export interface InvoiceDetail { so_hoa_don: string; ngay_phat_hanh: string; ngay_het_han_thanh_toan: string; trang_thai_thanh_toan: string; tien_can_thanh_toan: number; tien_da_thanh_toan: number; thue: number; ngay_cap_nhat: string; }
export interface ProductDetail { ma_san_pham_dat_may: string; ten_san_pham: string; gia_tien: number; }
export interface OrderLineDetail { ma_chi_tiet_don_hang: string; so_luong: number; gia_tien: number; san_pham: ProductDetail; SoDoDatMay: SoDo | null; }

export interface OrderDetail {
  ma_don_hang: string;
  ngay_dat_hang: string;
  trang_thai_don_hang: OrderStatus;
  ghi_chu: string | null;
  khach_hang: KhachHangInfo;
  chi_tiet_don_hang: OrderLineDetail[];
  giao_hang: DeliveryDetail | null;
  thanh_toan: PaymentDetail | null;
  hoa_don: InvoiceDetail | null;
}

export interface OrderListItem { ma_don_hang: string; ngay_dat_hang: string; trang_thai_don_hang: OrderStatus; ghi_chu: string | null; ma_khach_hang: string; }
interface OrderRow { ma_don_hang: string; ngay_dat_hang: string; trang_thai_don_hang: OrderStatus; khach_hang: KhachHangInfo; ghi_chu: string | null; }
interface SanPham { ma_san_pham_dat_may: string; ten_san_pham: string; gia_tien: number; }

const STATUS_LABELS: Record<OrderStatus, string> = { CHO_XAC_NHAN: 'Chờ xác nhận', DANG_MAY: 'Đang may', MAY_XONG: 'May xong' };
interface FormValues { ma_don_hang?: string; ma_khach_hang: string; phuong_thuc_thanh_toan: PaymentMethod; chi_tiet_don_hang: { ma_san_pham: string; so_luong: number; gia_tien: number; so_do: SoDo }[]; giao_hang: Omit<DeliveryDetail, 'ma_giao_hang' | 'trang_thai'>; thanh_toan: Omit<PaymentDetail, 'ma_thanh_toan'>; }

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [dataSp, setDataSp] = useState<SanPham[]>([]);
  const [dataKh, setDataKh] = useState<KhachHangInfo[]>([]);
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [mode, setMode] = useState<'create'|'view'|'edit'>('view');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const methods = useForm<FormValues>({ defaultValues: {
    ma_khach_hang: '', phuong_thuc_thanh_toan: 'COD', chi_tiet_don_hang: [{ ma_san_pham:'', so_luong:1, gia_tien:0, so_do:{vong_nguc:0,vong_eo:0,vong_hong:0,be_ngang_vai:0,chieu_dai_ao:0,chieu_dai_quan:0}}],
    giao_hang:{dia_chi_giao_hang:'',phi_van_chuyen:0,ngay_giao_du_kien:null,ngay_giao_thuc_te:null}, thanh_toan:{paymentMethod:'COD',paymentStatus:'',paymentType:'',transactionId:''}
  }});
  const { fields, append, remove } = useFieldArray({ control: methods.control, name: 'chi_tiet_don_hang' });

  const loadList = async () => {
    const list = await fetchDonHang();
    const enriched: OrderRow[] = await Promise.all(list.map(async (item: OrderListItem) => {
      const kh = await fetchKhachHang(item.ma_khach_hang);
      return { ...item, khach_hang: kh, ghi_chu: item.ghi_chu };
    }));
    setOrders(enriched);
  };

  useEffect(() => {
    loadList();
    fetchSanPham().then(setDataSp);
    fetchKhachHang('').then(setDataKh);
  }, []);

  const openCreate = () => { methods.reset(); setMode('create'); setDetail(null); setOpen(true); };
  const openView = async (id: string) => {
    setLoading(true);
    const d = await fetchDonHangChiTiet(id);
    setDetail(d);
    methods.reset({
      ma_don_hang: d.ma_don_hang,
      ma_khach_hang: d.khach_hang.ma_khach_hang,
      phuong_thuc_thanh_toan: d.thanh_toan?.paymentMethod || 'COD',
      chi_tiet_don_hang: d.chi_tiet_don_hang.map((l: OrderLineDetail) => ({ ma_san_pham: l.san_pham.ma_san_pham_dat_may, so_luong: l.so_luong, gia_tien: l.gia_tien, so_do: l.SoDoDatMay! })),
      giao_hang: d.giao_hang ? { dia_chi_giao_hang: d.giao_hang.dia_chi_giao_hang, phi_van_chuyen: d.giao_hang.phi_van_chuyen, ngay_giao_du_kien: d.giao_hang.ngay_giao_du_kien, ngay_giao_thuc_te: d.giao_hang.ngay_giao_thuc_te } : { dia_chi_giao_hang:'',phi_van_chuyen:0,ngay_giao_du_kien:null,ngay_giao_thuc_te:null },
      thanh_toan: d.thanh_toan ? { paymentMethod: d.thanh_toan.paymentMethod, paymentStatus: d.thanh_toan.paymentStatus, paymentType: d.thanh_toan.paymentType, transactionId: d.thanh_toan.transactionId } : { paymentMethod:'COD',paymentStatus:'',paymentType:'',transactionId:'' }
    });
    setMode('view'); setOpen(true); setLoading(false);
  };
  const openEdit = () => setMode('edit');
  const handleDelete = async (id:string) => { await fetch(`/api/don-hang/${id}`,{method:'DELETE'}); setOpen(false); loadList(); };

  const onSubmit:SubmitHandler<FormValues> = async data => {
    setLoading(true);
    const url = mode==='create' ? '/api/don-hang' : `/api/don-hang/${data.ma_don_hang}`;
    const method = mode==='create' ? 'POST' : 'PUT';
    await fetch(url, { method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
    setOpen(false); loadList(); setLoading(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Quản lý Đơn hàng</h2>
        <Button onClick={openCreate}>Tạo đơn</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow><TableHead>SĐH</TableHead><TableHead>Khách</TableHead><TableHead>Ngày</TableHead><TableHead>Trạng thái</TableHead><TableHead>Ghi chú</TableHead><TableHead>Hành động</TableHead></TableRow>
        </TableHeader>
        <TableBody>
          {orders.map(o=>(
            <TableRow key={o.ma_don_hang} className="hover:bg-gray-50">
              <TableCell>{o.ma_don_hang}</TableCell>
              <TableCell>{o.khach_hang.ten_khach_hang}</TableCell>
              <TableCell>{new Date(o.ngay_dat_hang).toLocaleDateString()}</TableCell>
              <TableCell>{STATUS_LABELS[o.trang_thai_don_hang]}</TableCell>
              <TableCell>{o.ghi_chu}</TableCell>
              <TableCell className="space-x-2">
                <Button size="sm" onClick={()=>openView(o.ma_don_hang)}>Xem</Button>
                <Button variant="destructive" size="sm" onClick={()=>handleDelete(o.ma_don_hang)}>Xóa</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[90vh] overflow-auto">
          <DrawerHeader className="flex justify-between items-center">
            <DrawerTitle>{mode==='create'?'Tạo':mode==='view'?'Chi tiết':'Chỉnh sửa'} đơn hàng</DrawerTitle>
            {mode==='view'&&<div className="space-x-2"><Button size="sm" onClick={openEdit}>Sửa</Button><Button size="sm" variant="destructive" onClick={()=>handleDelete(detail!.ma_don_hang)}>Xóa</Button></div>}
          </DrawerHeader>
          {mode==='view'?
            <div className="p-4 space-y-4">
              <p><strong>Khách:</strong> {detail!.khach_hang.ten_khach_hang}</p>
              <p><strong>Địa chỉ KH:</strong> {detail!.khach_hang.dia_chi_khach_hang}</p>
              <p><strong>Ghi chú:</strong> {detail!.ghi_chu}</p>
              <div><strong>Giao hàng:</strong> {detail!.giao_hang?.dia_chi_giao_hang} (Phí: {detail!.giao_hang?.phi_van_chuyen}, Trạng thái: {detail!.giao_hang?.trang_thai})</div>
              <div><strong>Thanh toán:</strong> {detail!.thanh_toan?.paymentMethod} - {detail!.thanh_toan?.paymentStatus} (GD: {detail!.thanh_toan?.transactionId})</div>
              <div><strong>Hóa đơn:</strong> {detail!.hoa_don?.so_hoa_don} - Tổng: {detail!.hoa_don?.tien_can_thanh_toan}, Thuế: {detail!.hoa_don?.thue}</div>
              <div><strong>Chi tiết:</strong> {detail!.chi_tiet_don_hang.map((l,i)=>(<div key={i} className="pl-4"><p>{l.san_pham.ten_san_pham} x{l.so_luong} - {l.gia_tien}</p><ul className="list-disc list-inside">{l.SoDoDatMay && Object.entries(l.SoDoDatMay).map(([k,v])=><li key={k}>{k.replace(/_/g,' ')}: {v}</li>)}</ul></div>))}</div>
            </div>
          :
            <form onSubmit={methods.handleSubmit(onSubmit)} className="p-4 space-y-4">
              <Select value={methods.watch('ma_khach_hang')} onValueChange={v=>methods.setValue('ma_khach_hang',v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{dataKh.map(kh=><SelectItem key={kh.ma_khach_hang} value={kh.ma_khach_hang}>{kh.ten_khach_hang}</SelectItem>)}</SelectContent></Select>
              <Select value={methods.watch('phuong_thuc_thanh_toan')} onValueChange={v=>methods.setValue('phuong_thuc_thanh_toan',v as PaymentMethod)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="COD">COD</SelectItem><SelectItem value="VNPAY">VNPay</SelectItem></SelectContent></Select>
              {fields.map((f,i)=>(<div key={f.id} className="flex gap-2"><Select value={methods.watch(`chi_tiet_don_hang.${i}.ma_san_pham`)} onValueChange={v=>{methods.setValue(`chi_tiet_don_hang.${i}.ma_san_pham`,v);const p=dataSp.find(sp=>sp.ma_san_pham_dat_may===v);if(p)methods.setValue(`chi_tiet_don_hang.${i}.gia_tien`,p.gia_tien);}}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{dataSp.map(sp=><SelectItem key={sp.ma_san_pham_dat_may} value={sp.ma_san_pham_dat_may}>{sp.ten_san_pham}</SelectItem>)}</SelectContent></Select><Input type="number" {...methods.register(`chi_tiet_don_hang.${i}.so_luong`)} /><Button variant="destructive" onClick={()=>remove(i)}>Xóa</Button></div>))}
              <Button onClick={()=>append({ma_san_pham:'',so_luong:1,gia_tien:0,so_do:{vong_nguc:0,vong_eo:0,vong_hong:0,be_ngang_vai:0,chieu_dai_ao:0,chieu_dai_quan:0}})}>Thêm SP</Button>
              <Input {...methods.register('giao_hang.dia_chi_giao_hang',{required:true})} placeholder="Địa chỉ giao" />
              <Input {...methods.register('giao_hang.phi_van_chuyen',{valueAsNumber:true})} placeholder="Phí vận chuyển" />
              <Input {...methods.register('thanh_toan.paymentMethod')} placeholder="Phương thức" />
              <Input {...methods.register('thanh_toan.paymentStatus')} placeholder="Trạng thái thanh toán" />
              <Input {...methods.register('thanh_toan.transactionId')} placeholder="Transaction ID" />
              <DrawerFooter className="flex justify-end space-x-2"><DrawerClose asChild><Button variant="outline">Hủy</Button></DrawerClose><Button type="submit" disabled={loading}>{mode==='create'?'Tạo':'Cập nhật'}</Button></DrawerFooter>
            </form>
          }
        </DrawerContent>
      </Drawer>
    </div>
  );
}
