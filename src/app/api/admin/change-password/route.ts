import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAdminSession } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const session = getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { oldPassword, newPassword } = await req.json();
    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    }

    const userRef = doc(db, "users", session.id);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    const userData = userDoc.data();
    const oldHashed = crypto.createHash('sha256').update(oldPassword).digest('hex');

    if (oldHashed !== userData.password) {
      // Keep support for legacy unhashed or bcrypt? No, strictly sha256 for now 
      return NextResponse.json({ error: "Mevcut şifre hatalı" }, { status: 401 });
    }

    const newHashed = crypto.createHash('sha256').update(newPassword).digest('hex');
    await updateDoc(userRef, { password: newHashed });

    return NextResponse.json({ success: true, message: "Şifreniz başarıyla güncellendi." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
