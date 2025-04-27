'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import classNames from 'classnames';
import { Search } from 'lucide-react';

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<LichHen | null>(null);
  const [editedNgayHen, setEditedNgayHen] = useState('');


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
  const handleDeleteAppointment = async (maLichHen: string) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa lịch hẹn này?');
    if (!confirmDelete) return;
  
    try {
      const res = await fetch(`/api/lich-hen/${maLichHen}`, {
        method: 'DELETE',
      });
  
      const data = await res.json();
  
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Xóa lịch hẹn thất bại');
      }
  
      setAppointments((prev) => prev.filter((appt) => appt.ma_lich_hen !== maLichHen));
      alert('Đã xóa lịch hẹn thành công');
    } catch (err: any) {
      console.error('Lỗi xóa lịch hẹn:', err);
      alert(`Lỗi: ${err.message || 'Xóa lịch hẹn thất bại'}`);
    }
  };
  
  const handleEditAppointment = async () => {
    if (!editingAppointment) return;
  
    try {
      const timestamp = new Date(editedNgayHen).toISOString();  // Chuyển đổi thành ISO 8601 string
  
      const res = await fetch(`/api/lich-hen/${editingAppointment.ma_lich_hen}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ngay_hen: timestamp }),
      });
  
      const data = await res.json();
  
      console.log("Response from backend:", data);
  
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Cập nhật lịch hẹn thất bại');
      }
  
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.ma_lich_hen === editingAppointment.ma_lich_hen
            ? { ...appt, ngay_hen: timestamp }
            : appt
        )
      );
  
      alert('Đã cập nhật lịch hẹn thành công');
      setIsEditModalOpen(false);
      setEditingAppointment(null);
    } catch (err: any) {
      console.error('Lỗi cập nhật lịch hẹn:', err);
      alert(`Lỗi: ${err.message || 'Cập nhật lịch hẹn thất bại'}`);
    }
  };
  
  
  

 
  return (
    <>
      <div className="flex justify-between items-center m-6 bg-white p-6 rounded-lg shadow">
        <h1 className="text-4xl font-bold text-gray-800">Lịch Hẹn</h1>
        <div className="flex items-center space-x-4">
          <label className="text-lg font-semibold text-gray-900">Sắp xếp theo:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            className="px-4 py-2 border border-blue-500 rounded-md focus:outline-none"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
          </select>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Thêm lịch hẹn
          </button>
          
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Thêm lịch hẹn</h2>
            <div className="mb-2">
              <input
                type="text"
                placeholder="Nhập số điện thoại"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button onClick={handleSearch} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                <Search className="inline-block w-4 h-4 mr-2" />Tìm khách hàng
              </button>
            </div>
            {showNewCustomerForm && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Tên khách hàng"
                  value={newCustomer.ten}
                  onChange={(e) => setNewCustomer({ ...newCustomer, ten: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Địa chỉ"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="datetime-local"
                  value={ngayHen}
                  onChange={(e) => setNgayHen(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <button onClick={handleSubmit} className="w-full bg-green-600 text-white p-2 rounded">
                  Tạo lịch hẹn
                </button>
              </div>
            )}
          </div>
        </div>
      )}
{isEditModalOpen && editingAppointment && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-30 backdrop-blur-sm">
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
      <h2 className="text-xl font-semibold mb-4">Sửa lịch hẹn</h2>

      <input
        type="datetime-local"
        value={editedNgayHen}
        onChange={(e) => setEditedNgayHen(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setIsEditModalOpen(false)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Hủy
        </button>
        <button
          onClick={handleEditAppointment}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Lưu
        </button>
      </div>
    </div>
  </div>
)}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6">
          {STATUS_COLUMNS.map(({ key, label }) => (
            <Droppable droppableId={key} key={key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-50 rounded-lg p-4 shadow min-h-[400px] flex flex-col"
                >
                  <h2 className="text-center font-semibold mb-2">{label}</h2>
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
                              'p-3 mb-3 rounded shadow',
                              snap.isDragging && 'ring-2 ring-blue-400',
                              getAppointmentColor(appt)
                            )}
                          >
                            <div className="flex justify-between">
                              <span className="font-bold">{appt.khach_hang ? appt.khach_hang.ten_khach_hang : "Khách hàng không xác định"}</span>

                              <span className="text-sm">{new Date(appt.ngay_hen).toLocaleString()}</span>
                            </div>
                            <div className="text-xs mt-1">{key}</div>
                            <div className="flex justify-between mt-2">
                            <button
                                onClick={() => {
                                  setEditingAppointment(appt);
                                  setEditedNgayHen(new Date(appt.ngay_hen).toISOString().slice(0, 16));
                                  setIsEditModalOpen(true);
                                }}
                                className="text-blue-500 hover:underline"
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteAppointment(appt.ma_lich_hen)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Xóa
                              </button>
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
    </>
  );
}