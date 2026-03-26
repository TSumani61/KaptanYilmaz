import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ALLOWED_USER_ID = process.env.TELEGRAM_ALLOWED_USER_ID; // So random people can't add posts

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Check if message is valid
    if (!data || !data.message || !data.message.text) {
      return NextResponse.json({ ok: true }); // Telegram needs generic 200 to not retry
    }

    const chatId = data.message.chat.id;
    const userId = data.message.from.id.toString();
    const text = data.message.text as string;

    // Verify authorized user
    if (ALLOWED_USER_ID && userId !== ALLOWED_USER_ID) {
      await sendTelegramMessage(chatId, "Bunun için yetkiniz yok.");
      return NextResponse.json({ ok: true });
    }

    // Command parsing
    // Format: /yeni Baslik | Icerik ...
    if (text.startsWith('/yeni ')) {
      const content = text.replace('/yeni ', '');
      const parts = content.split('|');
      
      if (parts.length < 2) {
        await sendTelegramMessage(chatId, "Format hatası! Kullanım: /yeni Başlık | İçerik...");
        return NextResponse.json({ ok: true });
      }

      const title = parts[0].trim();
      const body = parts.slice(1).join('|').trim();
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Add to Firestore
      await addDoc(collection(db, "posts"), {
        title,
        slug,
        body,
        description: body.substring(0, 100) + '...',
        publishedAt: new Date().toISOString(),
        author: { name: "Kaptan" },
        tags: ["Telegram"],
        categories: []
      });

      await sendTelegramMessage(chatId, `Yazı başarıyla eklendi!\nBaşlık: ${title}\nBağlantı: /blog/${slug}`);
    } else {
      await sendTelegramMessage(chatId, "Merhaba! Blog yazısı eklemek için şu formatı kullanın:\n\n/yeni Yazı Başlığı | Yazının içeriği (Markdown desteklenir)");
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Telegram Webhook Error:", error);
    return NextResponse.json({ ok: true });
  }
}

async function sendTelegramMessage(chatId: string, text: string) {
  if (!TELEGRAM_BOT_TOKEN) return;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });
}
