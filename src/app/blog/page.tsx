import { type Metadata } from 'next'
import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { type ArticleWithSlug, getAllArticles } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'
import { getPageMeta } from '@/lib/pageMeta'

function Article({ article }: { article: ArticleWithSlug }) {
  return (
    <article className="flex flex-col items-start w-full">
      <Card className="w-full">
        <Card.Title href={`/blog/${article.slug}`}>
          {article.title}
        </Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={article.publishedAt}
          className="mb-2 mt-2"
          decorate
        >
          {article.publishedAt ? formatDate(article.publishedAt) : 'No date'}
        </Card.Eyebrow>
        <Card.Description>{article.description}</Card.Description>
        {article.author && (
          <Card.Eyebrow className="mt-2">Yazar: {article.author.name}</Card.Eyebrow>
        )}
        <Card.Cta>Makaleyi oku</Card.Cta>
      </Card>
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMeta('blog')
  
  return {
    title: meta.title,
    description: meta.description,
  }
}

export default async function ArticlesIndex() {
  let articles = await getAllArticles()
  const meta = await getPageMeta('blog')

  return (
    <SimpleLayout
      title={meta.title}
      intro={meta.intro}
    >
      <div className="flex justify-start max-w-4xl mx-auto w-full">
        <div className="w-full md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
          <div className="flex flex-col space-y-16 w-full">
            {articles.map((article) => (
              <Article key={article._id} article={article} />
            ))}
          </div>
        </div>
      </div>
    </SimpleLayout>
  )
}

export const revalidate = 60
