import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = getAdminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // orderBy might require an index in Firebase if we sort by publishedAt, 
    // to be safe from missing index error, let's just fetch all and sort in memory if needed, 
    // or just use collection without query. But publishedAt should just naturally decline if we sort locally.
    const snapshot = await getDocs(collection(db, "posts"));
    const posts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    // Sort locally to avoid Firebase index requirement
    posts.sort((a: any, b: any) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());

    return NextResponse.json({ posts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = getAdminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, body } = await req.json();
    if (!title || !body) return NextResponse.json({ error: "Başlık ve İçerik zorunludur" }, { status: 400 });

    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    const description = body.length > 150 ? body.substring(0, 150) + '...' : body;

    const newPost = {
      title, slug, body, description,
      publishedAt: new Date().toISOString(),
      author: { name: session.name || 'Kaptan Yılmaz' },
      tags: [], categories: []
    };

    const docRef = await addDoc(collection(db, "posts"), newPost);
    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = getAdminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, title, body } = await req.json();
    if (!id || !title || !body) return NextResponse.json({ error: "ID, Başlık ve İçerik zorunludur" }, { status: 400 });

    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    const description = body.length > 150 ? body.substring(0, 150) + '...' : body;

    await updateDoc(doc(db, "posts", id), {
      title, slug, body, description,
      updatedAt: new Date().toISOString()
    });

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
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID zorunludur" }, { status: 400 });

    await deleteDoc(doc(db, "posts", id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
