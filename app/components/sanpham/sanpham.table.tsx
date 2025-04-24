'use client';
import { useEffect, useState } from "react";

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
  const [sanPhamList, setSanPhamList] = useState<SanPhamDatMay[]>(dataSP || []);
  const [selectedSanPham, setSelectedSanPham] = useState<SanPhamDatMay | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);
  const [editSanPham, setEditSanPham] = useState<SanPhamDatMay | null>(null);

  const createSanPham = async (
    sanPham: Omit<SanPhamDatMay, 'ma_san_pham_dat_may' | 'ngay_tao' | 'ngay_cap_nhat'>
  ) => {
    try {
      const payload = {
        ...sanPham,
        ma_san_pham_dat_may: Date.now().toString(),
        ngay_tao: new Date().toISOString(),
        ngay_cap_nhat: new Date().toISOString(),
      };
      const res = await fetch('/api/sanpham', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Lỗi khi tạo sản phẩm');
      const newItem: SanPhamDatMay = await res.json();
      setSanPhamList((prev) => [...prev, newItem]);
      setSelectedSanPham(newItem);
      closeModal();
    } catch {
      alert('Tạo sản phẩm thất bại');
    }
  };

  const updateSanPham = async (
    updated: SanPhamDatMay
  ) => {
    try {
      const res = await fetch(`/api/sanpham/${updated.ma_san_pham_dat_may}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updated, ngay_cap_nhat: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error('Cập nhật lỗi');
      const newData = await res.json();
      setSanPhamList((prev) =>
        prev.map((sp) => sp.ma_san_pham_dat_may === newData.ma_san_pham_dat_may ? newData : sp)
      );
      setSelectedSanPham(newData);
      closeModal();
    } catch {
      alert('Cập nhật sản phẩm thất bại');
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/vercel-blob', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload lỗi');
      const data = await res.json();
      return data.url as string;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (sanPhamList.length) setSelectedSanPham(sanPhamList[0]);
  }, [sanPhamList]);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleDelete = (ma: string) => {
    if (confirm('Bạn có chắc muốn xoá sản phẩm này không?')) {
      setSanPhamList((prev) => prev.filter((sp) => sp.ma_san_pham_dat_may !== ma));
      if (selectedSanPham?.ma_san_pham_dat_may === ma) setSelectedSanPham(null);
    }
  };

  const openModal = (type: 'add' | 'edit', sanPham?: SanPhamDatMay) => {
    setModalType(type);
    if (type === 'edit' && sanPham) setEditSanPham(sanPham);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditSanPham(null);
    setModalType(null);
  };

  const totalPages = Math.ceil(sanPhamList.length / ITEMS_PER_PAGE);
  const currentData = sanPhamList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
            onClick={() => openModal('add')}
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
                  <th key={header} className="px-4 py-3 text-left font-semibold text-gray-800 border-b">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.length ? currentData.map((sp) => (
                <tr key={sp.ma_san_pham_dat_may} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-3">{sp.ten_san_pham}</td>
                  <td className="px-4 py-3">{sp.gia_tien.toLocaleString()} VND</td>
                  <td className="px-4 py-3 truncate max-w-[200px]" title={sp.mo_ta_san_pham}>{sp.mo_ta_san_pham}</td>
                  <td className="px-4 py-3">{new Date(sp.ngay_tao).toLocaleDateString()}</td>
                  <td className={`px-4 py-3 font-semibold ${sp.co_san ? 'text-green-700' : 'text-red-700'}`}>
                    {sp.co_san ? 'Có sẵn' : 'Đặt may'}
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button onClick={() => setSelectedSanPham(sp)} className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">Xem</button>
                    <button onClick={() => openModal('edit', sp)} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600">Sửa</button>
                    <button onClick={() => handleDelete(sp.ma_san_pham_dat_may)} className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700">Xoá</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-800">Không có sản phẩm nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded-md border ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'} hover:bg-blue-100`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              {modalType === 'add' ? 'Thêm Sản Phẩm' : 'Chỉnh Sửa Sản Phẩm'}
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);

                let imageUrl = editSanPham?.url_image || '';
                const fileInput = form.querySelector('input[name="file_upload"]') as HTMLInputElement;
                if (fileInput?.files?.length) {
                  const uploaded = await uploadImage(fileInput.files[0]);
                  if (uploaded) imageUrl = uploaded;
                }

                const baseData = {
                  ten_san_pham: formData.get('ten_san_pham') as string,
                  gia_tien: Number(formData.get('gia_tien')),
                  mo_ta_san_pham: formData.get('mo_ta_san_pham') as string,
                  co_san: formData.get('co_san') === 'true',
                  url_image: imageUrl,
                };

                if (modalType === 'add') {
                  await createSanPham(baseData);
                } else if (modalType === 'edit' && editSanPham) {
                  await updateSanPham({
                    ...editSanPham,
                    ...baseData,
                  });
                }
              }}
            >
              <input name="ten_san_pham" placeholder="Tên sản phẩm" defaultValue={editSanPham?.ten_san_pham || ''} className="w-full mb-2 border rounded p-2" required />
              <input name="gia_tien" placeholder="Giá tiền" type="number" defaultValue={editSanPham?.gia_tien || ''} className="w-full mb-2 border rounded p-2" required />
              <textarea name="mo_ta_san_pham" placeholder="Mô tả" defaultValue={editSanPham?.mo_ta_san_pham || ''} className="w-full mb-2 border rounded p-2" required />
              <label htmlFor="co_san" className="block text-sm font-medium text-gray-700 mb-1">Loại sản phẩm</label>
              <select id="co_san" name="co_san" defaultValue={editSanPham?.co_san ? 'true' : 'false'} className="w-full mb-2 border rounded p-2">
                <option value="true">Có sẵn</option>
                <option value="false">Đặt may</option>
              </select>
              <label className="block text-sm mb-1 font-medium text-gray-700">Ảnh sản phẩm</label>
              <label htmlFor="file_upload" className="block text-sm font-medium text-gray-700">Tải lên ảnh sản phẩm</label>
              <input id="file_upload" name="file_upload" type="file" accept="image/*" className="w-full mb-4" title="Chọn tệp ảnh để tải lên" />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={closeModal} className="px-4 py-1 bg-gray-400 text-white rounded hover:bg-gray-500">Huỷ</button>
                <button type="submit" className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                  {modalType === 'add' ? 'Thêm' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
