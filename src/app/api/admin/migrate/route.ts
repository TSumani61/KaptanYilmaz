import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

function getSanityImageUrl(ref: string, projectId: string, dataset: string) {
  if (!ref) return '';
  const parts = ref.replace('image-', '').split('-');
  if (parts.length >= 2) {
    const extension = parts.pop();
    const dimension = parts.pop();
    const id = parts.join('-');
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimension}.${extension}`;
  }
  return '';
}

export async function GET() {
  try {
    const sanityProjectId = 'tcovgnyi';
    const dataset = 'production';
    const apiVersion = '2024-03-15';
    const baseUrl = `https://${sanityProjectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`;

    // 1. Fetch Posts
    const postsQuery = '*[_type == "post"]';
    const postsRes = await fetch(`${baseUrl}?query=${encodeURIComponent(postsQuery)}`);
    const postsData = await postsRes.json();
    const posts = postsData.result || [];

    for (const post of posts) {
      let mainImage = '';
      if (post.mainImage?.asset?._ref) {
        mainImage = getSanityImageUrl(post.mainImage.asset._ref, sanityProjectId, dataset);
      }
      let bodyText = '';
      if (Array.isArray(post.body)) {
        bodyText = post.body
          .map((block: any) => block._type === 'block' && block.children ? block.children.map((child: any) => child.text).join('') : '')
          .join('\n\n');
      }

      await setDoc(doc(db, 'posts', post._id), {
        title: post.title || '',
        slug: post.slug?.current || post._id,
        publishedAt: post.publishedAt || new Date().toISOString(),
        body: bodyText,
        description: post.description || bodyText.substring(0, 150) + '...',
        mainImage: mainImage,
        author: { name: 'Kaptan Yılmaz' },
        categories: [],
        tags: []
      });
    }

    // 2. Fetch MediaContent
    const mediaQuery = '*[_type == "mediaContent"]';
    const mediaRes = await fetch(`${baseUrl}?query=${encodeURIComponent(mediaQuery)}`);
    const mediaData = await mediaRes.json();
    const medias = mediaData.result || [];

    for (const media of medias) {
      let videoFile = null;
      if (media.videoFile?.asset?._ref) {
        const ref = media.videoFile.asset._ref;
        const parts = ref.replace('file-', '').split('-');
        if (parts.length >= 2) {
           const extension = parts.pop();
           const id = parts.join('-');
           videoFile = { asset: { url: `https://cdn.sanity.io/files/${sanityProjectId}/${dataset}/${id}.${extension}` } };
        }
      }

      let newsImage = '';
      if (media.newsImage?.asset?._ref) {
        newsImage = getSanityImageUrl(media.newsImage.asset._ref, sanityProjectId, dataset);
      }

      await setDoc(doc(db, 'mediaContent', media._id), {
        type: media.type || 'video',
        title: media.title || '',
        description: media.description || '',
        youtubeUrl: media.youtubeUrl || '',
        newsUrl: media.newsUrl || '',
        newsImage: newsImage,
        videoFile: videoFile,
        order: media.order || 0
      });
    }

    // 3. Fetch Authors
    const authorsQuery = '*[_type == "author"]';
    const authorsRes = await fetch(`${baseUrl}?query=${encodeURIComponent(authorsQuery)}`);
    const authorsData = await authorsRes.json();
    const authors = authorsData.result || [];

    for (const author of authors) {
      let image = '';
      if (author.image?.asset?._ref) {
        image = getSanityImageUrl(author.image.asset._ref, sanityProjectId, dataset);
      }
      let bioText = '';
      if (Array.isArray(author.bio)) {
        bioText = author.bio.map((b: any) => b.children?.map((c: any) => c.text).join('')).join('\n');
      }

      await setDoc(doc(db, 'authors', author._id), {
        name: author.name || '',
        slug: author.slug?.current || author._id,
        image: image,
        bio: bioText
      });
    }

    // 4. Fetch Services
    const servicesQuery = '*[_type == "service"]';
    const servicesRes = await fetch(`${baseUrl}?query=${encodeURIComponent(servicesQuery)}`);
    const servicesData = await servicesRes.json();
    const services = servicesData.result || [];

    for (const service of services) {
      let mainImage = '';
      if (service.mainImage?.asset?._ref) {
        mainImage = getSanityImageUrl(service.mainImage.asset._ref, sanityProjectId, dataset);
      }
      let bodyText = '';
      if (Array.isArray(service.body)) {
        bodyText = service.body.map((b: any) => b.children?.map((c: any) => c.text).join('')).join('\n\n');
      }

      await setDoc(doc(db, 'services', service._id), {
        title: service.title || '',
        slug: service.slug?.current || service._id,
        publishedAt: service.publishedAt || new Date().toISOString(),
        body: bodyText,
        description: service.description || bodyText.substring(0, 150) + '...',
        mainImage: mainImage,
        author: { name: 'Kaptan Yılmaz' },
        categories: []
      });
    }

    return NextResponse.json({ success: true, postsMigrated: posts.length, mediaMigrated: medias.length, authorsMigrated: authors.length, servicesMigrated: services.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
