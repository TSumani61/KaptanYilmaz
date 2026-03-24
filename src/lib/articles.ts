import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export interface ArticleWithSlug {
  _id: string;
  _type: 'post';
  title: string;
  slug: string;
  author: {
    name: string;
  };
  mainImage: string;
  categories: Array<{
    title: string;
  }>;
  tags: string[];
  publishedAt: string;
  body: string; // Changed to string for Markdown
  description: string;
  fileAttachment?: {
    asset: {
      url: string;
    };
  };
}

export async function getAllArticles(): Promise<ArticleWithSlug[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const articles: ArticleWithSlug[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      articles.push({
        _id: doc.id,
        _type: 'post',
        title: data.title || '',
        slug: data.slug || doc.id,
        author: {
          name: data.author?.name || 'Kaptan',
        },
        mainImage: data.mainImage || '',
        categories: data.categories || [],
        tags: data.tags || [],
        publishedAt: data.publishedAt || new Date().toISOString(),
        body: data.body || '',
        description: data.description || '',
      });
    });

    if (articles.length > 0) {
      articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      return articles;
    }
  } catch (error) {
    console.log("Firebase articles checked, none found. Falling back to static data.");
  }

  // Fallback to static defaults if Firebase is empty
  return [
    {
      _id: '1',
      _type: 'post',
      title: 'Örnek Blog Yazısı: Hukuki Süreçler',
      slug: 'ornek-hukuki-surecler',
      author: { name: 'Kaptan Yılmaz' },
      mainImage: '/images/blog.jpg',
      categories: [{ title: 'Duyuru' }],
      tags: ['hukuk'],
      publishedAt: new Date().toISOString(),
      body: 'Bu bir örnek makaledir. Firebase veritabanına yeni içerikler eklediğinizde bu alan otomatik olarak güncellenecektir.',
      description: 'Firebase veritabanınız henüz boş olduğu için hazırlanan örnek bir blog yazısıdır.'
    }
  ];
}
