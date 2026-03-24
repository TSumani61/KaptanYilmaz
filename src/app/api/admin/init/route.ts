import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import crypto from 'crypto';

export async function GET() {
  try {
    const username = "kaptan61";
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);

    // sha256 ile şifreleme
    const hashedPassword = crypto.createHash('sha256').update("goropoglu61").digest('hex');

    if (!querySnapshot.empty) {
      const userDocId = querySnapshot.docs[0].id;
      await setDoc(doc(db, "users", userDocId), {
        username: username,
        password: hashedPassword,
        role: "admin",
        name: "KAPTAN YILMAZ",
        createdAt: new Date().toISOString()
      }, { merge: true });
      return NextResponse.json({ message: "Admin user updated with sha256 and name." });
    }

    await setDoc(doc(collection(db, "users")), {
      username: username,
      password: hashedPassword,
      role: "admin",
      name: "KAPTAN YILMAZ",
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ message: "Admin user created successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
