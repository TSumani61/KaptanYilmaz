import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export interface MediaContent {
  _id: string
  type: 'video' | 'news'
  title?: string
  description?: string
  youtubeUrl?: string
  videoFile?: {
    asset: {
      url: string
    }
  } | null
  newsUrl?: string
  newsImage?: string
  order: number
}

export async function getMediaContent(): Promise<MediaContent[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "mediaContent"));
    const media: MediaContent[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<MediaContent, '_id'>;
      media.push({
        _id: doc.id,
        ...data
      });
    });

    if (media.length > 0) {
      media.sort((a, b) => (a.order || 0) - (b.order || 0));
      return media;
    }
  } catch (error) {
    console.log("Firebase media content checked, none found. Falling back to static data.");
  }

  return [
    {
      _id: 'vid1',
      type: 'video',
      title: 'Tüketici Hakları Nelerdir?',
      description: 'Hukuki haklarınızı öğrenin, uzman eşliğinde detaylı bilgilendirme.',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      order: 1
    },
    {
      _id: 'news1',
      type: 'news',
      title: 'Yeditepe Hukuk Gündemi',
      description: 'Güncel davalar ve yeni mevzuatlar hakkında son bültenler.',
      newsUrl: '#',
      newsImage: '/images/column55.jpg',
      order: 2
    }
  ];
}