import { notFound } from 'next/navigation'
import { ArticleLayout } from '@/components/ArticleLayout'
import { getAllArticles } from '@/lib/articles'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export async function generateStaticParams() {
  const articles = await getAllArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export default async function Article({ params }: { params: { slug: string } }) {
  const articles = await getAllArticles()
  const article = articles.find((a) => a.slug === params.slug)

  if (!article) {
    notFound()
  }

  return (
    <ArticleLayout article={article}>
      <div className="prose dark:prose-invert w-full max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body || ''}</ReactMarkdown>
      </div>
    </ArticleLayout>
  )
}
