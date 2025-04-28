'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import classNames from 'classnames';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface KhachHang {
  ma_khach_hang: string;
  ten_khach_hang: string;
  so_dien_thoai: string;
  dia_chi_khach_hang: string;
}

interface LichHen {
  ma_lich_hen: string;
  ngay_hen: string;
  trang_thai_lich_hen: string;
  khach_hang: KhachHang;
}

const STATUS_COLUMNS = [
  { key: 'CHO_XAC_NHAN', label: 'Chờ xác nhận' },
  { key: 'DA_XAC_NHAN', label: 'Đã xác nhận' },
  { key: 'CHUA_HOAN_THANH', label: 'Chưa hoàn thành' },
  { key: 'HOAN_THANH', label: 'Hoàn thành' },
  { key: 'HUY', label: 'Hủy' },
];

export default function LichHenBoard() {
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [appointments, setAppointments] = useState<LichHen[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [ngayHen, setNgayHen] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [foundCustomer, setFoundCustomer] = useState<KhachHang[] | null>(null);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ ten: '', address: '' });
  const [selectedCustomer, setSelectedCustomer] = useState<KhachHang | null>(null);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/lich-hen');
      if (!res.ok) throw new Error('Failed to fetch');
      const data: LichHen[] = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error('Lỗi khi fetch lịch hẹn:', err);
    }
  };
  
  useEffect(() => {
    fetchAppointments();
  }, []);
  
  useEffect(() => {
    fetchAppointments();
  }, []);
  

  useEffect(() => {
    const sorted = [...appointments].sort((a, b) =>
      sortOrder === 'newest'
        ? new Date(b.ngay_hen).getTime() - new Date(a.ngay_hen).getTime()
        : new Date(a.ngay_hen).getTime() - new Date(b.ngay_hen).getTime()
    );
    setAppointments(sorted);
  }, [sortOrder]);

  const handleDragEnd = async (result: DropResult) => {
    const { draggableId, destination, source } = result;
    if (!destination || destination.droppableId === source.droppableId) return;
    const newStatus = destination.droppableId;

    setAppointments((prev) =>
      prev.map((appt) =>
        appt.ma_lich_hen === draggableId ? { ...appt, trang_thai_lich_hen: newStatus } : appt
      )
    );

    try {
      const res = await fetch('/api/lich-hen/cap-nhat-trang-thai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ma_lich_hen: draggableId, trang_thai_lich_hen: newStatus }),
      });
      if (!res.ok) throw new Error('Update failed');
    } catch (err) {
      console.error('Lỗi cập nhật trạng thái:', err);
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.ma_lich_hen === draggableId ? { ...appt, trang_thai_lich_hen: source.droppableId } : appt
        )
      );
    }
  };

  const getAppointmentColor = (appt: LichHen) => {
    const conflicts = appointments.filter(
      (o) => new Date(o.ngay_hen).getTime() === new Date(appt.ngay_hen).getTime()
    );
    return conflicts.length > 1 ? 'bg-yellow-200' : '';
  };

  const formatToTimestamp = (dateString: string) => {
    const formattedDate = dateString.replace(' ', 'T');
    return new Date(formattedDate).getTime();
  };

  const handleSubmit = async () => {
    setError('');
    try {
      let customerId: string;
      if (showNewCustomerForm && !selectedCustomer) {
        const resCust = await fetch('/api/khach-hang', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ten_khach_hang: newCustomer.ten,
            so_dien_thoai: searchPhone.trim(),
            dia_chi_khach_hang: newCustomer.address,
          }),
        });
        const custData = await resCust.json();
        if (!resCust.ok) throw new Error(custData.message || 'Lỗi tạo khách hàng');
        customerId = custData.ma_khach_hang;
      } else if (selectedCustomer) {
        customerId = selectedCustomer.ma_khach_hang;
      } else {
        throw new Error('Vui lòng chọn hoặc tạo khách hàng');
      }

      const timestamp = formatToTimestamp(ngayHen);
      const resAppt = await fetch('/api/lich-hen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ma_khach_hang: customerId,
          ngay_hen: timestamp,
          trang_thai_lich_hen: 'CHO_XAC_NHAN',
        }),
      });
      const apptData = await resAppt.json();
      if (!resAppt.ok) throw new Error(apptData.message || 'Lỗi thêm lịch hẹn');

      const newAppt: LichHen = apptData.data;
      setAppointments((prev) => [...prev, newAppt]);
      fetchAppointments();
      setIsModalOpen(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSearch = async () => {
    setError('');
    try {
      const res = await fetch('/api/khach-hang/tim-theo-so-dt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ so_dien_thoai: searchPhone.trim() }),
      });

      if (res.ok) {
        const data: KhachHang = await res.json();
        setFoundCustomer([data]);
        setSelectedCustomer(data);
        setNewCustomer({ ten: data.ten_khach_hang, address: data.dia_chi_khach_hang });
        setShowNewCustomerForm(true);
      } else if (res.status === 404) {
        setFoundCustomer([]);
        setSelectedCustomer(null);
        setNewCustomer({ ten: '', address: '' });
        setShowNewCustomerForm(true);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Lỗi tìm kiếm khách hàng');
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="px-6 py-4">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-50">Sắp xếp:</span>
            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'newest' | 'oldest')}>
              <SelectTrigger className="w-[120px] text-white">
                <SelectValue placeholder="Chọn"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            Thêm lịch hẹn
          </Button>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Thêm lịch hẹn mới</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nhập số điện thoại"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
              />
              <Button onClick={handleSearch} variant="secondary">
                <Search className="w-4 h-4 mr-2" /> Tìm
              </Button>
            </div>

            {showNewCustomerForm && (
              <div className="space-y-3">
                <Input
                  placeholder="Tên khách hàng"
                  value={newCustomer.ten}
                  onChange={(e) => setNewCustomer({ ...newCustomer, ten: e.target.value })}
                />
                <Input
                  placeholder="Địa chỉ"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                />
                <Input
                  type="datetime-local"
                  value={ngayHen}
                  onChange={(e) => setNgayHen(e.target.value)}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleSubmit}>
                  Tạo lịch hẹn
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Drag & Drop Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
          {STATUS_COLUMNS.map(({ key, label }) => (
            <Droppable droppableId={key} key={key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-50 rounded-xl p-4 shadow-sm min-h-[400px] flex flex-col"
                >
                  <h2 className="text-center font-semibold text-gray-700 mb-2">{label}</h2>
                  {appointments
                    .filter((appt) => appt.trang_thai_lich_hen === key)
                    .map((appt, idx) => (
                      <Draggable key={appt.ma_lich_hen} draggableId={appt.ma_lich_hen} index={idx}>
                        {(prov, snap) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            className={classNames(
                              "bg-white rounded-lg p-3 mb-3 shadow-sm",
                              snap.isDragging && "ring-2 ring-blue-400",
                              getAppointmentColor(appt)
                            )}
                          >
                            <div className="flex justify-between text-sm font-medium text-gray-800">
                              <span>{appt.khach_hang?.ten_khach_hang}</span>
                              <span>{new Date(appt.ngay_hen).toLocaleDateString()}</span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}










