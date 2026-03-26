import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, writeBatch } from 'firebase/firestore';
import { getAdminSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  try {
    const session = getAdminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await req.json();
    const { collectionName, items } = payload; // items: [ { id: string, order: number } ]

    if (!collectionName || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
    }

    const batch = writeBatch(db);
    for (const item of items) {
      if (item.id && typeof item.order === 'number') {
        const ref = doc(db, collectionName, item.id);
        batch.update(ref, { order: item.order });
      }
    }
    
    await batch.commit();

    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, message: "Kayıt sıralaması güncellendi" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
