import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { getAdminSession } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const session = getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username, password, name } = await req.json();

    if (!username || !password || !name) {
      return NextResponse.json({ error: "Tüm alanlar zorunludur" }, { status: 400 });
    }

    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return NextResponse.json({ error: "Bu kullanıcı adı zaten mevcut" }, { status: 400 });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    await addDoc(collection(db, "users"), {
      username,
      password: hashedPassword,
      name,
      role: "admin",
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, message: "Yazar (Admin) başarıyla eklendi." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
