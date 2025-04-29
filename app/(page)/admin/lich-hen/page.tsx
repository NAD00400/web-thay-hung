'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import classNames from 'classnames';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { toast } from 'sonner';

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
  const [appointments, setAppointments] = useState<LichHen[]>([]);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Modals & dialogs
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<LichHen | null>(null);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState<LichHen | null>(null);

  // Form state
  const [ngayHen, setNgayHen] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [editedNgayHen, setEditedNgayHen] = useState('');
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ ten: '', address: '' });
  const [selectedCustomer, setSelectedCustomer] = useState<KhachHang | null>(null);
  const [error, setError] = useState('');

  // Loading states
  const [creating, setCreating] = useState(false);
  const [editingLoad, setEditingLoad] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => { fetchAppointments(); }, []);
  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/lich-hen');
      if (!res.ok) throw new Error('Failed to load');
      setAppointments(await res.json());
    } catch (e) {
      console.error(e);
      toast.error('Không tải được lịch hẹn');
    }
  };

  // Sort on change
  useEffect(() => {
    setAppointments(prev => [...prev].sort((a, b) =>
      sortOrder === 'newest'
        ? new Date(b.ngay_hen).getTime() - new Date(a.ngay_hen).getTime()
        : new Date(a.ngay_hen).getTime() - new Date(b.ngay_hen).getTime()
    ));
  }, [sortOrder]);

  const handleDragEnd = async (res: DropResult) => {
    const { draggableId, destination, source } = res;
    if (!destination || destination.droppableId === source.droppableId) return;
    const newStatus = destination.droppableId;
    const prev = [...appointments];
    setAppointments(prev.map(a => a.ma_lich_hen === draggableId ? { ...a, trang_thai_lich_hen: newStatus } : a));
    try {
      const r = await fetch('/api/lich-hen/cap-nhat-trang-thai', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ ma_lich_hen: draggableId, trang_thai_lich_hen: newStatus }),
      });
      if (!r.ok) throw new Error();
    } catch {
      setAppointments(prev);
      toast.error('Không cập nhật trạng thái');
    }
  };

  const handleSearch = async () => {
    setSearching(true);
    setError('');
    try {
      const res = await fetch('/api/khach-hang/tim-theo-so-dt', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ so_dien_thoai: searchPhone.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedCustomer(data);
        setNewCustomer({ ten: data.ten_khach_hang, address: data.dia_chi_khach_hang });
        setShowNewCustomer(true);
      } else if (res.status === 404) {
        setSelectedCustomer(null);
        setNewCustomer({ ten: '', address: '' });
        setShowNewCustomer(true);
      } else {
        const e = await res.json(); throw new Error(e.message);
      }
    } catch (e: any) {
      setError(e.message);
    } finally { setSearching(false); }
  };

  const handleCreate = async () => {
    setCreating(true); setError('');
    try {
      let custId = selectedCustomer?.ma_khach_hang || '';
      if (showNewCustomer && !custId) {
        const r = await fetch('/api/khach-hang', {
          method: 'POST', headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ ten_khach_hang:newCustomer.ten, so_dien_thoai:searchPhone.trim(), dia_chi_khach_hang:newCustomer.address }),
        });
        const d = await r.json(); if (!r.ok) throw new Error(d.message);
        custId = d.ma_khach_hang;
      }
      const ts = new Date(ngayHen).toISOString();
      const r2 = await fetch('/api/lich-hen', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ ma_khach_hang:custId, ngay_hen:ts, trang_thai_lich_hen:'CHO_XAC_NHAN' }),
      });
      const d2 = await r2.json(); if (!r2.ok) throw new Error(d2.message);
      setAppointments(prev => [...prev, d2.data]);
      setCreateOpen(false);
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message);
    } finally { setCreating(false); }
  };

  const confirmDelete = (appt: LichHen) => { setToDelete(appt); setDeleteOpen(true); };
  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      const r = await fetch(`/api/lich-hen/${toDelete.ma_lich_hen}`, { method:'DELETE' });
      const d = await r.json(); if (!r.ok) throw new Error(d.message);
      setAppointments(prev => prev.filter(a => a.ma_lich_hen !== toDelete.ma_lich_hen));
      setDeleteOpen(false);
    } catch (e: any) {
      toast.error(e.message);
    } finally { setDeleting(false); }
  };

  const handleEditSave = async () => {
    if (!editing) return;
    setEditingLoad(true);
    try {
      const ts = new Date(editedNgayHen).toISOString();
      const r = await fetch(`/api/lich-hen/${editing.ma_lich_hen}`, {
        method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ ngay_hen:ts }),
      });
      const d = await r.json(); if (!r.ok) throw new Error(d.message);
      setAppointments(prev => prev.map(a => a.ma_lich_hen===editing.ma_lich_hen ? { ...a, ngay_hen:ts } : a));
      setEditOpen(false);
    } catch (e: any) {
      toast.error(e.message);
    } finally { setEditingLoad(false); }
  };

  return (
    <div className="h-screen p-6 bg-gray-50 ">
      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn chắc chắn muốn xóa lịch hẹn này?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="space-x-2">
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" disabled={deleting} onClick={handleDelete}>
                {deleting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}Xóa
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Thêm lịch hẹn mới</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input placeholder="SĐT" value={searchPhone} onChange={e => setSearchPhone(e.target.value)} />
              <Button variant="outline" disabled={searching} onClick={handleSearch}>
                {searching ? <Loader2 className="animate-spin h-4 w-4" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
            {showNewCustomer && (
              <>
                <Input placeholder="Tên khách" value={newCustomer.ten} onChange={e => setNewCustomer(prev => ({ ...prev, ten: e.target.value }))} />
                <Input placeholder="Địa chỉ" value={newCustomer.address} onChange={e => setNewCustomer(prev => ({ ...prev, address: e.target.value }))} />
                <Input type="datetime-local" value={ngayHen} onChange={e => setNgayHen(e.target.value)} />
                {error && <p className="text-red-500">{error}</p>}
              </>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Hủy</Button>
              <Button disabled={creating} onClick={handleCreate}>
                {creating && <Loader2 className="animate-spin mr-2 h-4 w-4" />}Tạo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Sửa lịch hẹn</DialogTitle></DialogHeader>
          <Input type="datetime-local" value={editedNgayHen} onChange={e => setEditedNgayHen(e.target.value)} />
          <DialogFooter className="space-x-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>Hủy</Button>
            <Button disabled={editingLoad} onClick={handleEditSave}>
              {editingLoad && <Loader2 className="animate-spin mr-2 h-4 w-4" />}Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Sắp xếp:</span>
          <Select value={sortOrder} onValueChange={v => setSortOrder(v as any)}>
            <SelectTrigger className="w-36 border rounded">
              <SelectValue placeholder="Mới nhất" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="oldest">Cũ nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={() => setCreateOpen(true)}>Thêm lịch</Button>
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {STATUS_COLUMNS.map(({ key, label }) => (
            <Droppable key={key} droppableId={key}>
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="border border-gray-200 rounded-lg p-4 bg-gradient-to-b from-white to-indigo-950 min-h-[400px] flex flex-col"
                >
                  <h3 className="text-center font-medium mb-2 bg-gradient-to-r from-indigo-200 to-indigo-100 py-1 rounded">{label}</h3>
                  {appointments.filter(a => a.trang_thai_lich_hen === key).map((appt, idx) => (
                    <Draggable key={appt.ma_lich_hen} draggableId={appt.ma_lich_hen} index={idx}>
                      {(prov, snap) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className={classNames(
                            'border border-gray-200 rounded p-3 mb-3 bg-gradient-to-r from-white to-gray-50',
                            snap.isDragging && 'border-blue-300',
                          )}
                        >
                          <div className="flex justify-between text-sm font-semibold">
                            <span>{appt.khach_hang.ten_khach_hang}</span>
                            <span>{new Date(appt.ngay_hen).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-end text-xs space-x-2 mt-2">
                            <Button size="sm" variant="link" onClick={() => {
                              setEditing(appt);
                              setEditedNgayHen(new Date(appt.ngay_hen).toISOString().slice(0,16));
                              setEditOpen(true);
                            }}>Sửa</Button>
                            <AlertDialog open={isDeleteOpen && toDelete?.ma_lich_hen === appt.ma_lich_hen} onOpenChange={setDeleteOpen}>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">Xóa</Button>
                              </AlertDialogTrigger>
                            </AlertDialog>
                          </div>
                        </div>
                      )}</Draggable>
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
