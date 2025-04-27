'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface SanPhamDatMay {
  ma_san_pham_dat_may: string;
  ten_san_pham: string;
  gia_tien: number;
  mo_ta_san_pham: string;
  ngay_tao: string;
  ngay_cap_nhat: string;
  co_san: boolean;
  url_image: string;
}

const ITEMS_PER_PAGE = 6;

export function SanPhamTable({ dataSP }: { dataSP: SanPhamDatMay[] }) {
  const [selectedSanPham, setSelectedSanPham] = useState<SanPhamDatMay | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const totalPages = Math.ceil(dataSP.length / ITEMS_PER_PAGE);
  const currentData = dataSP.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setImageFile(null);
    setImageUrl('');
    reset();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) {
      alert('Bạn chưa chọn ảnh!');
      return;
    }
    setUploading(true);

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const res = await fetch('/api/vercel-blob', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      } else {
        alert('Tải ảnh thất bại.');
      }
    } catch (error) {
      console.error('Lỗi khi tải ảnh:', error);
      alert('Có lỗi xảy ra khi tải ảnh.');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (formData: any) => {
    if (!imageUrl) {
      alert('Bạn chưa upload ảnh sản phẩm');
      return;
    }

    const newSP = {
      ...formData,
      gia_tien: parseInt(formData.gia_tien),
      url_image: imageUrl,
      co_san: formData.co_san === 'true',
      ngay_tao: new Date().toISOString(),
      ngay_cap_nhat: new Date().toISOString(),
    };

    console.log('Thêm sản phẩm:', newSP);

    // Gọi API thêm sản phẩm ở đây...
    closeModal();
    reset();
    setImageFile(null);
    setImageUrl('');
  };

  return (
    <div className="h-screen p-6 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 overflow-hidden bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-6 overflow-auto">
        {selectedSanPham ? (
          <>
            <h2 className="text-xl font-bold mb-4">Chi Tiết Sản Phẩm</h2>
            <img src={selectedSanPham.url_image} alt={selectedSanPham.ten_san_pham} className="w-full h-60 object-cover rounded mb-4" />
            <div className="space-y-2 text-sm text-gray-800">
              <p><strong>Tên:</strong> {selectedSanPham.ten_san_pham}</p>
              <p><strong>Giá:</strong> {selectedSanPham.gia_tien.toLocaleString()} VND</p>
              <p><strong>Mô Tả:</strong> {selectedSanPham.mo_ta_san_pham}</p>
              <p><strong>Ngày Tạo:</strong> {new Date(selectedSanPham.ngay_tao).toLocaleDateString()}</p>
              <p><strong>Ngày Cập Nhật:</strong> {new Date(selectedSanPham.ngay_cap_nhat).toLocaleDateString()}</p>
              <p><strong>Loại:</strong> {selectedSanPham.co_san ? 'Có sẵn' : 'Đặt may'}</p>
            </div>
          </>
        ) : (
          <p className="text-gray-800">Không có sản phẩm nào được chọn.</p>
        )}
      </div>

      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex justify-between mb-2">
          <h2 className="text-xl font-bold">Danh Sách Sản Phẩm</h2>
          <button
            onClick={openModal}
            className="bg-green-600 text-white px-4 py-1 rounded-lg shadow-md hover:bg-green-700"
          >
            + Thêm
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full table-auto bg-white shadow-lg rounded-xl overflow-hidden">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {['Tên', 'Giá', 'Mô Tả', 'Ngày', 'Loại', 'Hành Động'].map((header) => (
                  <th key={header} className="px-4 py-3 text-left font-semibold text-gray-800 border-b border-neutral-200">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((sp) => (
                  <tr key={sp.ma_san_pham_dat_may} className="border-b border-neutral-200 bg-white hover:bg-gray-100 transition">
                    <td className="px-4 py-3">{sp.ten_san_pham}</td>
                    <td className="px-4 py-3">{sp.gia_tien.toLocaleString()} VND</td>
                    <td className="px-4 py-3 truncate max-w-[200px]" title={sp.mo_ta_san_pham}>{sp.mo_ta_san_pham}</td>
                    <td className="px-4 py-3">{new Date(sp.ngay_tao).toLocaleDateString()}</td>
                    <td className={`px-4 py-3 font-semibold ${sp.co_san ? 'text-green-700' : 'text-red-700'}`}>
                      {sp.co_san ? 'Có sẵn' : 'Đặt may'}
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button onClick={() => setSelectedSanPham(sp)} className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">Xem</button>
                      <button onClick={() => {}} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600">Sửa</button>
                      <button onClick={() => {}} className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700">Xoá</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="text-center py-4 text-gray-800">Không có sản phẩm nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded-md border ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'} hover:bg-blue-100 transition`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Thêm Sản Phẩm</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <input {...register('ten_san_pham', { required: true })} placeholder="Tên sản phẩm" className="border px-3 py-2 rounded w-full" />
              <input {...register('gia_tien', { required: true })} type="number" placeholder="Giá tiền" className="border px-3 py-2 rounded w-full" />
              <textarea {...register('mo_ta_san_pham')} placeholder="Mô tả sản phẩm" className="border px-3 py-2 rounded w-full" />
              <select {...register('co_san')} className="border px-3 py-2 rounded w-full">
                <option value="true">Có sẵn</option>
                <option value="false">Đặt may</option>
              </select>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <button type="button" onClick={handleUploadImage} disabled={uploading} className="bg-blue-600 text-white px-3 py-1 rounded">
                {uploading ? 'Đang tải ảnh...' : 'Tải ảnh lên'}
              </button>
              {imageUrl && <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover rounded" />}
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={closeModal} type="button" className="px-4 py-1 border rounded hover:bg-gray-100">Hủy</button>
                <button type="submit" className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
