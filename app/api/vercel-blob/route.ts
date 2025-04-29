import { NextResponse, NextRequest } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req: NextRequest) {
  try {
    // <-- đây sẽ parse được Multipart form-data
    const formData = await req.formData();
    const maybeFile = formData.get('file');

    if (!(maybeFile instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const file = maybeFile as File;
    // put(name, file, { access })
    const blob = await put(`sanPham/${file.name}`, file, { access: 'public' });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error('Vercel Blob upload error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
