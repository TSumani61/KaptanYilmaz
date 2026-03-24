import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { ArticleWithSlug } from "./articles";

export interface AuthorWithSlug {
  _id: string;
  name: string;
  slug: string;
  image: string;
  bio: string;
}

export async function getAllAuthors(): Promise<AuthorWithSlug[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "authors"));
    const authors: AuthorWithSlug[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      authors.push({
        _id: doc.id,
        name: data.name || 'Kaptan',
        slug: data.slug || doc.id,
        image: data.image || '',
        bio: data.bio || '',
        order: typeof data.order === 'number' ? data.order : 999
      } as any);
    });

    authors.sort((a: any, b: any) => a.order - b.order);

    if (authors.length > 0) return authors;
  } catch (error) {
    console.log("Firebase authors checked, none found. Falling back to static data.");
  }

  return [
    { _id: '1', name: 'Kaptan Yılmaz', slug: 'kaptan-yilmaz', image: '/images/avukatlar/kaptan-yilmaz.jpg', bio: 'Kurucu Avukat' },
    { _id: '2', name: 'Sema Genç Yılmaz', slug: 'sema-genc-yilmaz', image: '/images/avukatlar/sema-genc-yilmaz.jpg', bio: 'Avukat' },
    { _id: '3', name: 'Ezgi Yılmaz', slug: 'ezgi-yilmaz', image: '/images/avukatlar/ezgi-yilmaz.jpg', bio: 'Avukat' },
    { _id: '4', name: 'Sami Çırakoğlu', slug: 'sami-cirakoglu', image: '/images/avukatlar/sami-cirakoglu.jpg', bio: 'Avukat' },
    { _id: '5', name: 'Beyza Nur Acar', slug: 'beyza-nur-acar', image: '/images/avukatlar/beyza-nur-acar.jpg', bio: 'Avukat' },
    { _id: '6', name: 'Furkan Tohumcu', slug: 'furkan-tohumcu', image: '/images/avukatlar/furkan-tohumcu.jpg', bio: 'Avukat' },
  ];
}

export async function getAuthorPosts(authorId: string) {
  const querySnapshot = await getDocs(collection(db, "posts"));
  const posts: Partial<ArticleWithSlug>[] = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.authorId === authorId || data.author?.id === authorId) {
      posts.push({
        _id: doc.id,
        title: data.title || '',
        slug: data.slug || doc.id,
        _type: 'post',
        publishedAt: data.publishedAt || new Date().toISOString(),
        description: data.description || '',
        mainImage: data.mainImage || '',
      });
    }
  });

  posts.sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime());

  return posts;
}