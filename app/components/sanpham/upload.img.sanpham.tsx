'use client';

import { useState } from 'react';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
}

export default function ImageUpload({ onUploadSuccess }: ImageUploadProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : '');
  };

  const handleUpload = async () => {
    if (!imageFile) {
      alert('Bạn chưa chọn ảnh!');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const resp = await fetch('/api/vercel-blob', {
        method: 'POST',
        body: formData,   // <-- đây sẽ là multipart/form-data
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || resp.statusText);
      }
      const { url } = await resp.json();
      onUploadSuccess(url);
    } catch (e) {
      console.error('Upload error:', e);
      alert('Lỗi khi tải ảnh lên: ' + (e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-700"
      />
      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
      >
        {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
      </button>
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-full h-40 object-cover rounded"
        />
      )}
    </div>
  );
}
