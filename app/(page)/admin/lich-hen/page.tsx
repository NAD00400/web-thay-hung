'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import classNames from 'classnames';
import { AddAppointmentModal } from '@/app/components/lichhen/modal.themLH';

interface LichHen {
  ma_lich_hen: string;
  ngay_hen: string;
  trang: string;
  khach_hang: {
    ten_khach_hang: string;
  };
}

const STATUS_COLUMNS = [
  { key: 'CHO_XAC_NHAN', label: 'Chờ xác nhận' },
  { key: 'DA_XAC_NHAN', label: 'Đã xác nhận' },
  { key: 'CHUA_HOAN_THANH', label: 'Chưa hoàn thành' },
  { key: 'HOAN_THANH', label: 'Hoàn thành' },
  { key: 'HUY', label: 'Hủy' },
];

export default function LichHenBoard() {
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest'); // Trạng thái sắp xếp
  const [appointments, setAppointments] = useState<LichHen[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hàm lấy nhãn trạng thái
  function getStatusLabel(statusKey: string) {
    const status = STATUS_COLUMNS.find((s) => s.key === statusKey);
    return status ? status.label : statusKey;
  }

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch('/api/lich-hen');
        if (!res.ok) throw new Error(res.statusText);
        const data: LichHen[] = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error('Lỗi khi fetch lịch hẹn:', err);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    const sortedAppointments = [...appointments];
    if (sortOrder === 'newest') {
      sortedAppointments.sort((a, b) => new Date(b.ngay_hen).getTime() - new Date(a.ngay_hen).getTime());
    } else {
      sortedAppointments.sort((a, b) => new Date(a.ngay_hen).getTime() - new Date(b.ngay_hen).getTime());
    }
    setAppointments(sortedAppointments);
  }, [sortOrder]);

  // Hàm để tìm và thêm màu cho các lịch trùng giờ
  const getAppointmentColor = (appt: LichHen) => {
    const conflictingAppointments = appointments.filter(
      (otherAppt) => new Date(otherAppt.ngay_hen).getTime() === new Date(appt.ngay_hen).getTime()
    );
    return conflictingAppointments.length > 1 ? 'bg-yellow-200' : ''; // Áp dụng màu vàng nếu có lịch trùng
  };

  // Hàm khi tạo lịch mới
  const handleCreated = (appt: LichHen) => {
    setAppointments((prev) => [...prev, appt]);
  };

  // Xử lý khi kéo và thả lịch
  const handleDragEnd = async (result: DropResult) => {
    const { draggableId, destination, source } = result;
    if (!destination || destination.droppableId === source.droppableId) return;
    const newStatus = destination.droppableId;
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.ma_lich_hen === draggableId ? { ...appt, trang: newStatus } : appt
      )
    );
    try {
      const res = await fetch('/api/lich-hen/cap-nhat-trang-thai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ma_lich_hen: draggableId, trang_thai_lich_hen: newStatus }),
      });
      if (!res.ok) throw new Error(res.statusText);
    } catch (err) {
      console.error('Lỗi cập nhật trạng thái lịch hẹn:', err);
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.ma_lich_hen === draggableId ? { ...appt, trang: source.droppableId } : appt
        )
      );
    }
  };

  return (
    <>
      

      {/* Nút thêm lịch hẹn */}
      <div className="flex justify-between items-center m-6 ">
        <h1 className="text-4xl font-bold text-gray-800">Lịch Hẹn</h1>
        {/* Chọn sắp xếp theo thời gian */}
        <div className="flex items-center space-x-4 align-middle h-">
          <label className="text-lg font-semibold text-gray-50">Sắp xếp theo:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            className="px-4 py-2 border border-blue-500 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="newest"style={{ backgroundColor: '#ffffff', color: '#333333' }}>Mới nhất</option>
            <option value="oldest"style={{ backgroundColor: '#ffffff', color: '#333333' }}>Cũ nhất</option>
          </select>
          <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-950 transition-colors duration-300 shadow-md focus:outline-none focus:ring-4 focus:ring-blue-50"
        >
          Thêm lịch hẹn
        </button>
        </div>
        
      </div>


      {/* Modal thêm lịch hẹn */}
      <AddAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleCreated}
      />

      {/* Khu vực kéo và thả */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-6">
          {STATUS_COLUMNS.map(({ key, label }) => (
            <Droppable droppableId={key} key={key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gradient-to-r from-blue-50 via-indigo-100 to-purple-50 rounded-lg p-6 shadow-xl min-h-[500px] max-h-[80vh] overflow-y-auto flex flex-col transition-all duration-300 hover:shadow-2xl"
                >
                  <h2 className="text-center text-xl font-semibold text-gray-700 mb-4">{label}</h2>

                  {/* Lọc và hiển thị lịch hẹn theo trạng thái */}
                  {appointments
                    .filter((appt) => appt.trang === key)
                    .map((appt, index) => (
                      <Draggable draggableId={appt.ma_lich_hen} index={index} key={appt.ma_lich_hen}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={classNames(
                              'bg-white p-4 mb-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer',
                              snapshot.isDragging && 'ring-2 ring-blue-400',
                              getAppointmentColor(appt) // Áp dụng màu khi trùng thời gian
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-center">{appt.khach_hang.ten_khach_hang}</p>
                              <p className="text-sm text-gray-500 p-2">{new Date(appt.ngay_hen).toLocaleString()}</p>
                            </div>
                            <span className="bg-blue-200 text-blue-700 rounded-full text-center p-1 my-2 w-full">
                              {getStatusLabel(appt.trang)}
                            </span>
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
