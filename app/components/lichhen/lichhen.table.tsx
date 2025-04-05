'use client';

import { useState } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Fullscreen } from 'lucide-react';

const localizer = momentLocalizer(moment);

interface ILichHen {
  ma_lich_hen: string;
  ngay_hen: string;
  khach_hang: {
    ten_khach_hang: string;
  };
}

interface AppointmentData {
  ngay_hen: string;
  trang_thai_lich_hen: string;
  ma_khach_hang: string;
  ten_khach_hang: string;
  so_dien_thoai: string;
  email: string;
}

export default function LichHenCalendar({ data, onReload }: { data: ILichHen[], onReload: () => void }) {
  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar');
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    ngay_hen: '',
    trang_thai_lich_hen: 'CHO_XAC_NHAN',
    ma_khach_hang: '',
    ten_khach_hang: '',
    so_dien_thoai: '',
    email: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const events = data.map((appt) => ({
    id: appt.ma_lich_hen,
    title: appt.khach_hang.ten_khach_hang,
    start: new Date(appt.ngay_hen),
    end: new Date(appt.ngay_hen),
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppointmentData({
      ...appointmentData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/lich-hen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        setAppointmentData({
          ngay_hen: '',
          trang_thai_lich_hen: 'CHO_XAC_NHAN',
          ma_khach_hang: '',
          ten_khach_hang: '',
          so_dien_thoai: '',
          email: '',
        });
        setIsModalOpen(false);
        onReload();
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Failed to create appointment');
      }
    } catch (error) {
      setErrorMessage('An error occurred while creating appointment.');
    }
  };

  return (
    <div className="w-full">
      <div className="flex  items-center bg-white pb-2">
        
        <div>
          <button className={`px-4 py-2 mr-2 ${viewMode === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setViewMode('calendar')}>Lịch</button>
          <button className={`px-4 py-2 ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setViewMode('table')}>Bảng</button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end"  views={['week', 'day']} defaultView="week" className='bg-white h-screen'/>
      ) : (
        <table className="table-auto w-full border-collapse border bg-white border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Mã Lịch Hẹn</th>
              <th className="border border-gray-300 px-4 py-2">Tên Khách Hàng</th>
              <th className="border border-gray-300 px-4 py-2">Ngày Hẹn</th>
            </tr>
          </thead>
          <tbody>
            {data.map((appt) => (
              <tr key={appt.ma_lich_hen}>
                <td className="border border-gray-300 px-4 py-2">{appt.ma_lich_hen}</td>
                <td className="border border-gray-300 px-4 py-2">{appt.khach_hang.ten_khach_hang}</td>
                <td className="border border-gray-300 px-4 py-2">{moment(appt.ngay_hen).format('DD/MM/YYYY')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-end mt-4">
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded shadow">Tạo lịch hẹn</button>
      </div>

      {isModalOpen && (
        <div className="absolute inset-0 flex items-center justify-center  bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Tạo lịch hẹn</h2>
            {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input type="datetime-local" name="ngay_hen" value={appointmentData.ngay_hen} onChange={handleChange} required className="border p-2 rounded" />
              <input type="text" name="ten_khach_hang" value={appointmentData.ten_khach_hang} onChange={handleChange} required className="border p-2 rounded" />
              <input type="text" name="so_dien_thoai" value={appointmentData.so_dien_thoai} onChange={handleChange} required className="border p-2 rounded" />
              <input type="email" name="email" value={appointmentData.email} onChange={handleChange} required className="border p-2 rounded" />
              <div className="col-span-2 flex justify-end space-x-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-300 px-4 py-2 rounded">Hủy</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Tạo lịch hẹn</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
