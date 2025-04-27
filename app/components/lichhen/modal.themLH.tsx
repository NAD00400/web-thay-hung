'use client';

import React, { useState } from 'react';
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

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (appt: LichHen) => void;
}

export const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [ngayHen, setNgayHen] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [foundCustomer, setFoundCustomer] = useState<KhachHang[] | null>(null);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ ten: '', address: '' });
  const [selectedCustomer, setSelectedCustomer] = useState<KhachHang | null>(null);
  const [error, setError] = useState('');

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

  const formatToTimestamp = (dateString: string) => {
    const formattedDate = dateString.replace(' ', 'T');
    const date = new Date(formattedDate);
    return date.getTime();
  };

  const handleSubmit = async () => {
    setError('');
    try {
      let customerId: string;
      if (showNewCustomerForm && !selectedCustomer) {
        // Tạo mới khách hàng
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

      // Lấy đúng object lịch hẹn từ trường `data`
      const newAppt: LichHen = apptData.data;
      onCreated(newAppt);
      onClose();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSelectCustomer = (customer: KhachHang) => {
    setSelectedCustomer(customer);
    setSearchPhone(customer.so_dien_thoai);
    setNewCustomer({ ten: customer.ten_khach_hang, address: customer.dia_chi_khach_hang });
    setShowNewCustomerForm(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-30 backdrop-blur-sm">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 rounded-xl w-[450px] relative shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-xl hover:text-red-500 rounded-full p-1">✕</button>
        <h2 className="text-2xl font-semibold mb-6 text-center">Thêm lịch hẹn</h2>

        <div className="mb-6">
          <label className="block mb-2 text-lg">Ngày hẹn</label>
          <input
            type="datetime-local"
            value={ngayHen}
            onChange={(e) => setNgayHen(e.target.value)}
            className="w-full p-3 border-2 border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6 relative">
          <label className="block mb-2 text-lg">Khách hàng (SĐT)</label>
          <input
            type="text"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
            className="w-full p-3 border-2 border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          />
          <Search
            className="absolute right-4 bottom-2/28 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-200"
            size={20}
            onClick={handleSearch}
          />
        </div>

        {/* {foundCustomer && foundCustomer.length > 0 && (
          <div className="mt-2 max-h-40 overflow-y-auto border-2 border-gray-600 rounded-lg bg-gray-800">
            {foundCustomer.map((customer) => (
              <div
                key={customer.ma_khach_hang}
                onClick={() => handleSelectCustomer(customer)}
                className="cursor-pointer p-3 hover:bg-gray-700"
              >
                {customer.ten_khach_hang} - {customer.so_dien_thoai}
              </div>
            ))}
          </div>
        )} */}

        {/* Form nhập thông tin khách hàng mới hoặc đã tìm */}
        {showNewCustomerForm && (
          <div className="mt-6 space-y-3">
            <input
              type="text"
              placeholder="Nhập tên khách hàng"
              value={newCustomer.ten}
              onChange={(e) => setNewCustomer((prev) => ({ ...prev, ten: e.target.value }))}
              className="w-full p-3 border-2 border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Nhập địa chỉ"
              value={newCustomer.address}
              onChange={(e) => setNewCustomer((prev) => ({ ...prev, address: e.target.value }))}
              className="w-full p-3 border-2 border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-400">SĐT: {searchPhone}</p>
          </div>
        )}

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg mt-6 transition duration-200"
        >
          Tạo lịch hẹn
        </button>
      </div>
    </div>
  );
};