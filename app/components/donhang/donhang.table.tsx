'use client';
import { useEffect, useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
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
import { fetchDonHang } from '@/app/lib/fetchData';

export type OrderStatus = 'CHO_XAC_NHAN' | 'DANG_MAY' | 'MAY_XONG';
export type PaymentMethod = 'COD' | 'VNPAY';

export interface SoDo {
  vong_nguc: number;
  vong_eo: number;
  vong_hong: number;
  be_ngang_vai: number;
  chieu_dai_ao: number;
  chieu_dai_quan: number;
}

export interface CreateOrderPayload {
  ma_khach_hang: string;
  phuong_thuc_thanh_toan: PaymentMethod;
  ghi_chu?: string;
  chi_tiet_don_hang: Array<{
    ma_san_pham: string;
    so_luong: number;
    gia_tien: number;
    so_do: SoDo;
  }>;
  giao_hang: {
    dia_chi_giao_hang: string;
    phi_van_chuyen?: number;
    ngay_giao_du_kien?: string | null;
  };
  thanh_toan?: {
    paymentMethod?: PaymentMethod;
    paymentStatus?: string;
    transactionId?: string;
    paymentType?: string;
  };
}

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
  giao_hang: {
    dia_chi_giao_hang: string;
    phi_van_chuyen?: number;
    ngay_giao_du_kien?: string | null;
  };
  thanh_toan?: {
    paymentMethod?: PaymentMethod;
    paymentStatus?: string;
    transactionId?: string;
    paymentType?: string;
  };
  chi_tiet_don_hang: Array<{
    ma_san_pham: string;
    so_luong: number;
    gia_tien: number;
    so_do: SoDo;
  }>;
}

type OrderRow = Pick<
  OrderDetail,
  'ma_don_hang' | 'ngay_dat_hang' | 'trang_thai_don_hang' | 'khach_hang'
>;

interface SanPham {
  gia_tien: number;
  ma_san_pham_dat_may: string;
  mo_ta_san_pham: string;
  ten_san_pham: string;
  url_image: string;
}

interface DonHangTableProps {
  dataSp: SanPham[];
  dataKh: KhachHangInfo[];
}
// ... Các kiểu dữ liệu đã khai báo ...

const STATUS_LABELS: Record<OrderStatus, string> = {
  CHO_XAC_NHAN: 'Chờ xác nhận',
  DANG_MAY: 'Đang may',
  MAY_XONG: 'May xong'
};

interface SanPham {
  gia_tien: number;
  ma_san_pham_dat_may: string;
  mo_ta_san_pham: string;
  ten_san_pham: string;
  url_image: string;
}

interface DonHangTableProps {
  dataSp: SanPham[];
  dataKh: KhachHangInfo[];
}

type FormValues = CreateOrderPayload & {
  ma_don_hang?: string;
  trang_thai_don_hang?: OrderStatus;
  ngay_dat_hang?: string;
};

export default function DonHangTable({ dataSp, dataKh }: DonHangTableProps) {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [selected, setSelected] = useState<OrderDetail | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<'view' | 'create'>('view');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      ma_khach_hang: '',
      phuong_thuc_thanh_toan: 'COD',
      chi_tiet_don_hang: [{
        ma_san_pham: '',
        so_luong: 1,
        gia_tien: 0,
        so_do: {
          vong_nguc: 0,
          vong_eo: 0,
          vong_hong: 0,
          be_ngang_vai: 0,
          chieu_dai_ao: 0,
          chieu_dai_quan: 0,
        }
      }],
      giao_hang: {
        dia_chi_giao_hang: '',
        phi_van_chuyen: 0
      }
    }
  });
  const handleCreate = () => {
    reset({
      ma_khach_hang: '',
      phuong_thuc_thanh_toan: 'COD',
      chi_tiet_don_hang: [{
        ma_san_pham: '',
        so_luong: 1,
        gia_tien: 0,
        so_do: {
          vong_nguc: 0,
          vong_eo: 0,
          vong_hong: 0,
          be_ngang_vai: 0,
          chieu_dai_ao: 0,
          chieu_dai_quan: 0,
        }
      }],
      giao_hang: {
        dia_chi_giao_hang: '',
        phi_van_chuyen: 0
      },
      ghi_chu: ''
    });
    setMode('create');
    setDrawerOpen(true);
  };
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'chi_tiet_don_hang'
  });

  // Load danh sách đơn hàng
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDonHang();
        setOrders(data);
      } catch (error) {
        toast.error('Lỗi tải danh sách đơn hàng');
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, []);

  const openDetail = async (ma: string) => {
    try {
      const res = await fetch(`/api/don-hang/${ma}`);
      if (!res.ok) throw new Error();
      const data: OrderDetail = await res.json();
      
      const formData = {
        ...data,
        ma_khach_hang: data.khach_hang.ma_khach_hang,
        phuong_thuc_thanh_toan: data.thanh_toan?.paymentMethod || 'COD',
        chi_tiet_don_hang: data.chi_tiet_don_hang,
        giao_hang: {
          dia_chi_giao_hang: data.giao_hang.dia_chi_giao_hang,
          phi_van_chuyen: data.giao_hang.phi_van_chuyen || 0
        }
      };

      reset({
        ...formData,
        ghi_chu: formData.ghi_chu ?? undefined,
      });
      setSelected(data);
      setMode('view');
      setDrawerOpen(true);
    } catch (error) {
      toast.error('Không tải được chi tiết đơn hàng');
    }
  };
  const deleteOrder = async (ma: string) => {
    try {
      const res = await fetch(`/api/don-hang/${ma}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Xóa đơn hàng thất bại');
      
      setOrders(prev => prev.filter(order => order.ma_don_hang !== ma));
      toast.success('Đã xóa đơn hàng');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi');
    }
  };
  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    try {
      const payload = {
        ma_khach_hang: formData.ma_khach_hang,
        phuong_thuc_thanh_toan: formData.phuong_thuc_thanh_toan,
        ghi_chu: formData.ghi_chu,
        chi_tiet_don_hang: formData.chi_tiet_don_hang.map(item => ({
          ma_san_pham: item.ma_san_pham,
          so_luong: Number(item.so_luong),
          gia_tien: Number(item.gia_tien),
          so_do: {
            vong_nguc: Number(item.so_do.vong_nguc),
            vong_eo: Number(item.so_do.vong_eo),
            vong_hong: Number(item.so_do.vong_hong),
            be_ngang_vai: Number(item.so_do.be_ngang_vai),
            chieu_dai_ao: Number(item.so_do.chieu_dai_ao),
            chieu_dai_quan: Number(item.so_do.chieu_dai_quan),
          }
        })),
        giao_hang: {
          dia_chi_giao_hang: formData.giao_hang.dia_chi_giao_hang,
          phi_van_chuyen: Number(formData.giao_hang.phi_van_chuyen) || 0
        }
      };

      const url = mode === 'create' ? '/api/don-hang' : `/api/don-hang/${formData.ma_don_hang}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(mode === 'create' ? 'Tạo đơn hàng thất bại' : 'Cập nhật thất bại');

      const newOrder = await res.json();
      setOrders(prev => mode === 'create' 
        ? [...prev, newOrder] 
        : prev.map(order => order.ma_don_hang === newOrder.ma_don_hang ? newOrder : order)
      );

      toast.success(mode === 'create' ? 'Tạo đơn hàng thành công' : 'Cập nhật thành công');
      fetchDonHang().then(data => setOrders(data)); // Tải lại danh sách đơn hàng
      reset(); // Đặt lại form về mặc định
      setDrawerOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi hệ thống');
    }
  };
  
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Danh sách đơn hàng</h2>
        <Button onClick={handleCreate}>Tạo đơn hàng</Button>
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
                <TableCell>{STATUS_LABELS[order.trang_thai_don_hang]}</TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" onClick={() => openDetail(order.ma_don_hang)}>Xem</Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteOrder(order.ma_don_hang)}>Xoá</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[90vh] overflow-hidden">
          <DrawerHeader>
            <DrawerTitle>{mode === 'create' ? 'Tạo đơn hàng mới' : 'Chi tiết đơn hàng'}</DrawerTitle>
          </DrawerHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 overflow-auto">
            {/* Phần khách hàng */}
            <div className="space-y-2">
              <label className="block font-medium">Khách hàng *</label>
              <Select
                value={watch('ma_khach_hang')}
                onValueChange={value => setValue('ma_khach_hang', value)}
                disabled={mode === 'view'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khách hàng" />
                </SelectTrigger>
                <SelectContent>
                  {dataKh.map(kh => (
                    <SelectItem key={kh.ma_khach_hang} value={kh.ma_khach_hang}>
                      {kh.ten_khach_hang} ({kh.so_dien_thoai})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.ma_khach_hang && (
                <span className="text-red-500 text-sm">Vui lòng chọn khách hàng</span>
              )}
            </div>

            {/* Phương thức thanh toán */}
            <div className="space-y-2">
              <label className="block font-medium">Phương thức thanh toán *</label>
              <Select
                value={watch('phuong_thuc_thanh_toan')}
                onValueChange={value => setValue('phuong_thuc_thanh_toan', value as PaymentMethod)}
                disabled={mode === 'view'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phương thức" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COD">COD</SelectItem>
                  <SelectItem value="VNPAY">VNPay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Danh sách sản phẩm */}
            {mode === 'create' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Sản phẩm *</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({
                      ma_san_pham: '',
                      so_luong: 1,
                      gia_tien: 0,
                      so_do: {
                        vong_nguc: 0,
                        vong_eo: 0,
                        vong_hong: 0,
                        be_ngang_vai: 0,
                        chieu_dai_ao: 0,
                        chieu_dai_quan: 0,
                      }
                    })}
                  >
                    Thêm sản phẩm
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 rounded-lg space-y-3">
                    <div className="flex gap-2">
                      <div className="flex-1 space-y-1">
                        <label className="text-sm">Sản phẩm *</label>
                        <Select
                          value={watch(`chi_tiet_don_hang.${index}.ma_san_pham`)}
                          onValueChange={value => {
                            setValue(`chi_tiet_don_hang.${index}.ma_san_pham`, value);
                            const product = dataSp.find(sp => sp.ma_san_pham_dat_may === value);
                            if (product) {
                              setValue(`chi_tiet_don_hang.${index}.gia_tien`, product.gia_tien);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn sản phẩm" />
                          </SelectTrigger>
                          <SelectContent>
                            {dataSp.map(sp => (
                              <SelectItem key={sp.ma_san_pham_dat_may} value={sp.ma_san_pham_dat_may}>
                                {sp.ten_san_pham} - {sp.gia_tien.toLocaleString()} VND
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm">Số lượng *</label>
                        <Input
                          type="number"
                          min={1}
                          {...register(`chi_tiet_don_hang.${index}.so_luong`, {
                            valueAsNumber: true,
                            min: { value: 1, message: "Tối thiểu 1" }
                          })}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm">Đơn giá</label>
                        <Input
                          {...register(`chi_tiet_don_hang.${index}.gia_tien`)}
                          disabled
                          className="bg-gray-100"
                        />
                      </div>

                      <Button
                        type="button"
                        variant="destructive"
                        className="mt-6"
                        onClick={() => remove(index)}
                      >
                        Xóa
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(field.so_do).map(([key]) => (
                        <div key={key} className="space-y-1">
                          <label className="text-sm capitalize">{key.replace(/_/g, ' ')}</label>
                          <Input
                            type="number"
                            {...register(`chi_tiet_don_hang.${index}.so_do.${key as keyof SoDo}`)}
                            placeholder="0"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="space-y-2">
              <label className="block font-medium">Địa chỉ giao hàng *</label>
              {mode === 'view' ? (
                <div className="p-2 border rounded-md bg-gray-50">
                  {selected?.giao_hang.dia_chi_giao_hang}
                </div>
              ) : (
                <>
                  <Input
                    {...register('giao_hang.dia_chi_giao_hang', { required: true })}
                    placeholder="Nhập địa chỉ giao hàng"
                  />
                  {errors.giao_hang?.dia_chi_giao_hang && (
                    <span className="text-red-500 text-sm">Vui lòng nhập địa chỉ giao hàng</span>
                  )}
                </>
              )}
            </div>
            {/* Các trường khác và nút submit */}
            <DrawerFooter className="mt-4">
              <DrawerClose asChild>
                <Button variant="outline">Hủy</Button>
              </DrawerClose>
              <Button type="submit">{mode === 'create' ? 'Tạo đơn hàng' : 'Cập nhật'}</Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  );
}