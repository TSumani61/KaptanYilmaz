import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';

// Environment variables you need to add to Netlify:
// TELEGRAM_BOT_TOKEN="your-bot-token"
// TELEGRAM_ALLOWED_USERNAMES="kullaniciadi1,kullaniciadi2"

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Telegram's generic pings
    if (!data || !data.message || !data.message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = data.message.chat.id.toString();
    const fromUsername = data.message.from.username || '';
    const text = data.message.text as string;

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const ALLOWED_USERNAMES = process.env.TELEGRAM_ALLOWED_USERNAMES?.split(',').map(u => u.trim().toLowerCase()) || [];

    // 1) Yetki Kontrolü
    if (ALLOWED_USERNAMES.length > 0 && !ALLOWED_USERNAMES.includes(fromUsername.toLowerCase())) {
      await sendTelegramMessage(TELEGRAM_BOT_TOKEN!, chatId, `🚫 Üzgünüm @${fromUsername}, bu bota sadece yetkili kişiler makale gönderebilir.`);
      return NextResponse.json({ ok: true });
    }

    // İptal Komutu
    if (text === '/iptal') {
      await setDoc(doc(db, "telegram_sessions", chatId), { step: 'idle', draftTitle: '' });
      await sendTelegramMessage(TELEGRAM_BOT_TOKEN!, chatId, "❌ Makale ekleme işlemi iptal edildi.");
      return NextResponse.json({ ok: true });
    }

    // Başlangıç Komutu
    if (text.startsWith('/makale')) {
      await setDoc(doc(db, "telegram_sessions", chatId), { step: 'waiting_title', draftTitle: '' });
      await sendTelegramMessage(TELEGRAM_BOT_TOKEN!, chatId, "✍️ Yeni makale oluşturma sihirbazı başladı!\n\nLütfen yayına girecek makalenin **Başlığını** yazıp gönderin:");
      return NextResponse.json({ ok: true });
    }

    // Mesaj Kontrolü (State Machine)
    const sessionRef = doc(db, "telegram_sessions", chatId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (sessionSnap.exists()) {
      const session = sessionSnap.data();
      
      if (session.step === 'waiting_title') {
        const title = text.trim();
        // İkinci aşamaya geç: İçerik bekleniyor
        await setDoc(sessionRef, { step: 'waiting_content', draftTitle: title });
        await sendTelegramMessage(TELEGRAM_BOT_TOKEN!, chatId, `✅ **Başlık alındı:** "${title}"\n\nHarika! Şimdi lütfen makalenin **tam içeriğini (metnini)** buraya yapıştırıp gönderin.\n*(Vazgeçmek için /iptal yazabilirsiniz)*`);
        return NextResponse.json({ ok: true });
      }
      
      if (session.step === 'waiting_content') {
        const body = text.trim();
        const title = session.draftTitle;
        
        // Slug oluştur
        let slug = title.toLowerCase().trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        if (!slug) slug = `makale-${Date.now()}`;

        // Veritabanına Makaleyi Kaydet
        await addDoc(collection(db, "posts"), {
          title,
          slug,
          body,
          description: body.substring(0, 150) + '...',
          publishedAt: new Date().toISOString(),
          author: { name: fromUsername },
          tags: ["Telegram", "Mobil"],
          categories: []
        });

        // Seans sıfırlama
        await setDoc(sessionRef, { step: 'idle', draftTitle: '' });
        
        // Yeni bir WebHook revalidate isteği tetiklemiyoruz çünkü revalidate = 60 komutumuz var
        await sendTelegramMessage(TELEGRAM_BOT_TOKEN!, chatId, `🎉 **Tebrikler!** Makaleniz resmi web sitenizde başarıyla yayına alındı! 🚀\n\n🔗 Görüntülemek için 60 saniye sonra şu bağlantıya tıklayabilirsiniz:\nhttps://${req.headers.get('host')}/blog/${slug}`);
        return NextResponse.json({ ok: true });
      }
    }

    // Bilinmeyen bir komut kullanıldığında veya hiçbir aşamada değilken
    await sendTelegramMessage(TELEGRAM_BOT_TOKEN!, chatId, "Merhaba yetkili! 👨‍⚖️ Web sitenize doğrudan makale eklemek için sihirbazı ** /makale ** komutuyla başlatabilirsiniz.");
    return NextResponse.json({ ok: true });
    
  } catch (error: any) {
    console.error("Telegram Webhook Error:", error);
    return NextResponse.json({ ok: true });
  }
}

async function sendTelegramMessage(token: string, chatId: string, text: string) {
  if (!token) return;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: chatId, 
        text, 
        parse_mode: 'Markdown' // Destansı metin görünümü için Markdown desteği eklendi
      })
    });
  } catch (error) {
    console.error("Telegram bildirimi gönderilemedi", error);
  }
}
