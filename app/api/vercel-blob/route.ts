// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file: File | null = formData.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ error: 'Không có file nào được gửi lên' }, { status: 400 });
  }

  try {
    const blob = await put(file.name, file, {
      access: 'public',
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error('Lỗi upload:', err);
    return NextResponse.json({ error: 'Lỗi khi upload ảnh' }, { status: 500 });
  }
}
