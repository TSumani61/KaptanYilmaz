import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = getAdminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const colName = searchParams.get('col');
    
    if (!colName) return NextResponse.json({ error: "Koleksiyon adı eksik." }, { status: 400 });

    const q = query(collection(db, colName));
    const snapshot = await getDocs(q);
    let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // sort locally if publishedAt or order exists
    data.sort((a: any, b: any) => {
      if (a.publishedAt && b.publishedAt) return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      if (typeof a.order === 'number' && typeof b.order === 'number') return a.order - b.order;
      return 0;
    });

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  try {
    const session = getAdminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await req.json();
    const { collectionName, ...data } = payload;
    
    if (!collectionName) return NextResponse.json({ error: "Koleksiyon adı zorunlu." }, { status: 400 });

    if (collectionName === 'posts' || collectionName === 'services' || collectionName === 'authors') {
      const source = collectionName === 'authors' ? data.name : data.title;
      if (source && !data.slug) {
        data.slug = source.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
      }
      if (!data.publishedAt && collectionName !== 'authors') {
        data.publishedAt = new Date().toISOString();
      }
    }
    
    if (collectionName === 'posts' && data.body && (!data.description || data.description.length === 0)) {
        data.description = data.body.length > 150 ? data.body.substring(0, 150) + '...' : data.body;
    }

    const docRef = await addDoc(collection(db, collectionName), data);
    
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = getAdminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await req.json();
    const { collectionName, id, ...data } = payload;

    if (!collectionName || !id) return NextResponse.json({ error: "Koleksiyon ve ID zorunlu." }, { status: 400 });

    if (collectionName === 'posts' || collectionName === 'services' || collectionName === 'authors') {
      const source = collectionName === 'authors' ? data.name : data.title;
      if (source && !data.slug) {
        data.slug = source.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
      }
    }

    if (collectionName === 'posts' && data.body) {
      data.description = data.body.length > 150 ? data.body.substring(0, 150) + '...' : data.body;
    }

    data.updatedAt = new Date().toISOString();

    await updateDoc(doc(db, collectionName, id), data);
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = getAdminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const colName = searchParams.get('col');
    const id = searchParams.get('id');

    if (!colName || !id) return NextResponse.json({ error: "Koleksiyon ve ID zorunlu." }, { status: 400 });

    await deleteDoc(doc(db, colName, id));
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
