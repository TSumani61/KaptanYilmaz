import { getAllArticles } from '@/lib/articles'

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  if (!siteUrl) {
    return new Response('Missing NEXT_PUBLIC_SITE_URL environment variable', { status: 500 })
  }

  const articles = await getAllArticles()

  const allContent = [...articles].sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Yeditepe Hukuk Bürosu</title>
    <link>${siteUrl}</link>
    <description>Yeditepe Hukuk Bürosu'nun hukuki makaleleri ve görüşleri</description>
    <language>tr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${allContent.map((content) => {
      const contentType = '_type' in content ? content._type : 'post'
      const urlPath = contentType === 'post' ? 'blog' : 'makaleler'
      return `
    <item>
      <title><![CDATA[${content.title}]]></title>
      <link>${siteUrl}/${urlPath}/${content.slug}</link>
      <guid isPermaLink="true">${siteUrl}/${urlPath}/${content.slug}</guid>
      <description><![CDATA[${content.description}]]></description>
      <pubDate>${new Date(content.publishedAt).toUTCString()}</pubDate>
    </item>
    `}).join('')}
  </channel>
</rss>`

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
