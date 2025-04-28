import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, ChangeEvent, FormEvent } from "react";


const BookingSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    time: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Sửa handleSubmit thành async function
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Lịch hẹn đã được đặt:", formData);

    // Logic xử lý API
    try {
      const resCust = await fetch('/api/khach-hang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ten_khach_hang: formData.name,
          so_dien_thoai: formData.phone.trim(),
          dia_chi_khach_hang: formData.address,
        }),
      });

      const custData = await resCust.json();
      if (!resCust.ok) throw new Error(custData.message || 'Lỗi tạo khách hàng');
      
      const customerId = custData.ma_khach_hang;
      const timestamp = new Date(formData.time).toISOString();

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

      const newAppt = apptData.data;
      console.log("Lịch hẹn đã được tạo:", newAppt);

      // Có thể gọi API để lấy lại danh sách các cuộc hẹn hoặc làm gì đó khác ở đây
      // fetchAppointments(); // Nếu bạn cần cập nhật các cuộc hẹn từ server

    } catch (error) {
      console.error("Có lỗi xảy ra khi tạo lịch hẹn:", error);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center text-white mt-6">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://brojqgdjcljbprhn.public.blob.vercel-storage.com/background/ChatGPT%20Image%2016_04_38%2019%20thg%204%2C%202025-GdY4eAayivsK57dCZKLgg35MYbD0t9.png"
          alt="Background"
          className="object-cover opacity-80"
        />
      </div>

      {/* Content Section */}
      <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-2xl">
        <div className="bg-neutral-100 opacity-80 p-8 rounded-3xl shadow-lg">
          <h2 className="text-3xl font-semibold text-neutral-800">Đặt lịch hẹn tư vấn</h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-left text-gray-700 font-medium">Tên</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên của bạn"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-left text-gray-700 font-medium">Địa chỉ</label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ của bạn"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-left text-gray-700 font-medium">Số điện thoại</label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại của bạn"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-left text-gray-700 font-medium">Thời gian</label>
              <Input
                type="datetime-local"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                required
              />
            </div>
            <Button
              type="submit"
              className="mt-6 px-6 py-2 bg-white text-neutral-700 font-semibold rounded-full shadow-lg hover:bg-neutral-100"
            >
              Đặt lịch
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingSection;
