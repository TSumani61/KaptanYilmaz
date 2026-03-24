import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export interface ServiceWithSlug {
  _id: string
  title: string
  slug: string
  author?: {
    name: string
  }
  mainImage?: string
  categories: Array<{
    title: string
  }>
  publishedAt: string
  body: string
  description: string
}

export async function getAllServices(): Promise<ServiceWithSlug[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "services"));
    const services: ServiceWithSlug[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      services.push({
        _id: doc.id,
        title: data.title || '',
        slug: data.slug || doc.id,
        author: {
          name: data.author?.name || 'Kaptan',
        },
        mainImage: data.mainImage || '',
        categories: data.categories || [],
        publishedAt: data.publishedAt || new Date().toISOString(),
        body: data.body || '',
        description: data.description || '',
      });
    });

    if (services.length > 0) {
      services.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      return services;
    }
  } catch (error) {
    console.log("Firebase services checked, none found. Falling back to static data.");
  }

  // Fallback to static defaults if Firebase is empty
  return [
    {
      _id: '1',
      title: 'Ceza Hukuku',
      slug: 'ceza-hukuku',
      author: { name: 'Kaptan Yılmaz' },
      mainImage: '/images/column1.jpg',
      categories: [{ title: 'Hizmetler' }],
      publishedAt: new Date().toISOString(),
      body: 'Ceza hukuku alanındaki tüm davalarda müvekkillerimizi en iyi şekilde temsil ediyoruz.',
      description: 'Soruşturma ve kovuşturma süreçlerinde profesyonel hukuki destek.'
    },
    {
      _id: '2',
      title: 'Aile Hukuku',
      slug: 'aile-hukuku',
      author: { name: 'Kaptan Yılmaz' },
      mainImage: '/images/column2.jpg',
      categories: [{ title: 'Hizmetler' }],
      publishedAt: new Date().toISOString(),
      body: 'Boşanma, nafaka, velayet ve miras konularında güvenilir ve şeffaf hizmet.',
      description: 'Aile ve miras hukuku anlaşmazlıkları için uzman avukatlık hizmetleri.'
    },
    {
      _id: '3',
      title: 'İş Hukuku',
      slug: 'is-hukuku',
      author: { name: 'Kaptan Yılmaz' },
      mainImage: '/images/column4.jpg',
      categories: [{ title: 'Hizmetler' }],
      publishedAt: new Date().toISOString(),
      body: 'İşçi ve işveren uyuşmazlıkları, işe iade davaları ve tazminat talepleri.',
      description: 'İşçi ve işveren haklarının korunmasına yönelik profesyonel destek.'
    },
    {
      _id: '4',
      title: 'Ticaret Hukuku',
      slug: 'ticaret-hukuku',
      author: { name: 'Kaptan Yılmaz' },
      mainImage: '/images/column5.jpg',
      categories: [{ title: 'Hizmetler' }],
      publishedAt: new Date().toISOString(),
      body: 'Ticari davalar, şirket danışmanlığı, sözleşme hazırlama gibi hizmetler sunuyoruz.',
      description: 'Şirketlerin yasal konulardaki tüm ihtiyaçlarını karşılayan hukuki hizmetler.'
    }
  ];
}
