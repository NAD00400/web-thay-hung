"use client";

import { useState } from 'react';

interface AppointmentData {
  ngay_hen: string;
  trang_thai_lich_hen: string;
  ma_khach_hang: string;
  ten_khach_hang: string;
  so_dien_thoai: string;
  email: string;
}

const LichHenForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    ngay_hen: '',
    trang_thai_lich_hen: 'CHO_XAC_NHAN',
    ma_khach_hang: '',
    ten_khach_hang: '',
    so_dien_thoai: '',
    email: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        headers: {
          'Content-Type': 'application/json',
        },
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
        onSuccess(); // Gọi callback để reload data
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Failed to create appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      setErrorMessage('An error occurred while creating appointment.');
    }
  };

  return (
    <div className="w-full bg-white bg-opacity-20 backdrop-blur-lg pb-4 pr-12 justify-end flex ">
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex justify-center py-2 px-4 shadow-sm text-sm font-medium text-black hover:bg-indigo-100"
      >
        Tạo lịch hẹn
      </button>

      {isModalOpen && (
        <div className="absolute inset-0 z-auto flex items-center justify-center bg-opacity-50 h-screen"> 
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Tạo lịch hẹn</h2>

            {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="ngay_hen" className="block text-sm font-medium text-gray-700">
                  Ngày hẹn
                </label>
                <input
                  type="datetime-local"
                  id="ngay_hen"
                  name="ngay_hen"
                  value={appointmentData.ngay_hen}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="ten_khach_hang" className="block text-sm font-medium text-gray-700">
                  Tên khách hàng
                </label>
                <input
                  type="text"
                  id="ten_khach_hang"
                  name="ten_khach_hang"
                  value={appointmentData.ten_khach_hang}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="so_dien_thoai" className="block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  id="so_dien_thoai"
                  name="so_dien_thoai"
                  value={appointmentData.so_dien_thoai}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={appointmentData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="col-span-2 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex justify-center bg-gray-300 py-2 px-4 shadow-sm text-sm font-medium rounded-md text-gray-700 hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center bg-indigo-600 py-2 px-4 shadow-sm text-sm font-medium rounded-md text-white hover:bg-indigo-700"
                >
                  Tạo lịch hẹn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LichHenForm;
