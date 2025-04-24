// app/api/vercel-blob/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: 'Không có file hợp lệ' }, { status: 400 });
  }

  try {
    const blob = await put(
      `image-${Date.now()}`, // tên file
      file, // Blob hợp lệ
      { access: 'public' }
    );

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error('Lỗi upload:', err);
    return NextResponse.json({ error: 'Lỗi khi upload ảnh' }, { status: 500 });
  }
}
