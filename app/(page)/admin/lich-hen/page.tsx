'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import classNames from 'classnames';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<LichHen | null>(null);
  const [editedNgayHen, setEditedNgayHen] = useState('');

  const [ngayHen, setNgayHen] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [foundCustomer, setFoundCustomer] = useState<KhachHang[] | null>(null);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ ten: '', address: '' });
  const [selectedCustomer, setSelectedCustomer] = useState<KhachHang | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/lich-hen');
      if (!res.ok) throw new Error('Failed to fetch');
      const data: LichHen[] = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Sort appointments when sortOrder changes
  useEffect(() => {
    const sorted = [...appointments].sort((a, b) =>
      sortOrder === 'newest'
        ? new Date(b.ngay_hen).getTime() - new Date(a.ngay_hen).getTime()
        : new Date(a.ngay_hen).getTime() - new Date(b.ngay_hen).getTime()
    );
    setAppointments(sorted);
  }, [sortOrder]);

  // Handle drag end
  const handleDragEnd = async (result: DropResult) => {
    const { draggableId, destination, source } = result;
    if (!destination || destination.droppableId === source.droppableId) return;
    const newStatus = destination.droppableId;

    const prevList = [...appointments];
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.ma_lich_hen === draggableId
          ? { ...appt, trang_thai_lich_hen: newStatus }
          : appt
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
      console.error(err);
      setAppointments(prevList);
    }
  };

  // Format conflicts highlight
  const getAppointmentColor = (appt: LichHen) => {
    const conflicts = appointments.filter(
      (o) => new Date(o.ngay_hen).getTime() === new Date(appt.ngay_hen).getTime()
    );
    return conflicts.length > 1 ? 'bg-yellow-200' : '';
  };

  const formatToTimestamp = (dateString: string) => {
    return new Date(dateString.replace(' ', 'T')).getTime();
  };

  // Create appointment
  const handleCreate = async () => {
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
        if (!resCust.ok) throw new Error(custData.message);
        customerId = custData.ma_khach_hang;
      } else if (selectedCustomer) {
        customerId = selectedCustomer.ma_khach_hang;
      } else {
        throw new Error('Chọn hoặc tạo khách hàng');
      }

      const timestamp = formatToTimestamp(ngayHen);
      const res = await fetch('/api/lich-hen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ma_khach_hang: customerId,
          ngay_hen: timestamp,
          trang_thai_lich_hen: 'CHO_XAC_NHAN',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAppointments((prev) => [...prev, data.data]);
      setIsModalOpen(false);
      fetchAppointments();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Search customer
  const handleSearch = async () => {
    setError('');
    try {
      const res = await fetch('/api/khach-hang/tim-theo-so-dt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ so_dien_thoai: searchPhone.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
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
        const err = await res.json();
        throw new Error(err.message);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Delete appointment
  const handleDelete = async (id: string) => {
    if (!confirm('Xóa lịch này?')) return;
    try {
      const res = await fetch(`/api/lich-hen/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAppointments((prev) => prev.filter((a) => a.ma_lich_hen !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // Edit appointment
  const handleEdit = async () => {
    if (!editingAppointment) return;
    try {
      const timestamp = new Date(editedNgayHen).toISOString();
      const res = await fetch(`/api/lich-hen/${editingAppointment.ma_lich_hen}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ngay_hen: timestamp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAppointments((prev) =>
        prev.map((a) =>
          a.ma_lich_hen === editingAppointment.ma_lich_hen ? { ...a, ngay_hen: timestamp } : a
        )
      );
      setIsEditModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="px-6 py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Sắp xếp:</span>
          <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as any)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Mới nhất" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="oldest">Cũ nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Thêm lịch hẹn</Button>
      </div>

      {/* Create Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm lịch hẹn mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="SĐT"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
              />
              <Button variant="secondary" onClick={handleSearch}>
                <Search className="h-4 w-4 mr-1" /> Tìm
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
                {error && <p className="text-red-500">{error}</p>}
                <Button className="w-full bg-green-600" onClick={handleCreate}>
                  Tạo lịch hẹn
                </Button>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      {isEditModalOpen && editingAppointment && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Sửa lịch hẹn</h2>
            <Input
              type="datetime-local"
              value={editedNgayHen}
              onChange={(e) => setEditedNgayHen(e.target.value)}
            />
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleEdit}>
                Lưu
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Drag & Drop Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {STATUS_COLUMNS.map(({ key, label }) => (
            <Droppable droppableId={key} key={key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-50 p-4 rounded-lg shadow min-h-[400px] flex flex-col"
                >
                  <h3 className="text-center font-medium mb-2">{label}</h3>
                  {appointments
                    .filter((a) => a.trang_thai_lich_hen === key)
                    .map((appt, idx) => (
                      <Draggable key={appt.ma_lich_hen} draggableId={appt.ma_lich_hen} index={idx}>
                        {(prov, snap) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            className={classNames(
                              'bg-white p-3 mb-3 rounded shadow-sm',
                              snap.isDragging && 'ring-2 ring-blue-400',
                              getAppointmentColor(appt)
                            )}
                          >
                            <div className="flex justify-between text-sm font-semibold">
                              <span>{appt.khach_hang.ten_khach_hang}</span>
                              <span>{new Date(appt.ngay_hen).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between text-xs mt-1">
                              <Button size="sm" variant="link" onClick={() => {
                                setEditingAppointment(appt);
                                setEditedNgayHen(new Date(appt.ngay_hen).toISOString().slice(0,16));
                                setIsEditModalOpen(true);
                              }}>
                                Sửa
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDelete(appt.ma_lich_hen)}>
                                Xóa
                              </Button>
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
