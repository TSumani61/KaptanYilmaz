import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(req: Request) {
  try {
    const session = getAdminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const uniqueName = `upload-${Date.now()}-${safeFilename}`;
    const uploadDir = join(process.cwd(), 'public', 'images', 'uploads');
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch(e) {}

    const filepath = join(uploadDir, uniqueName);
    await writeFile(filepath, buffer as any);

    return NextResponse.json({ success: true, url: `/images/uploads/${uniqueName}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
