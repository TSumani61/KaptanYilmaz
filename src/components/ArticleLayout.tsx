'use client'

import { useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Tag } from '@/components/Tag'
import { AppContext } from '@/app/providers'
import { Container } from '@/components/Container'
import { Prose } from '@/components/Prose'
import { type ArticleWithSlug } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'

function ArrowLeftIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

console.log('article.fileAttachment')
export function ArticleLayout({
  article,
  children,
}: {
  article: ArticleWithSlug & { fileAttachment?: { asset: { url: string } } }
  children: React.ReactNode
}) {
  let router = useRouter()
  let { previousPathname } = useContext(AppContext)
  const [showPdf, setShowPdf] = useState(false)

  console.log('Article data:', article)
  return (
    <Container className="mt-16 lg:mt-32">
      <div className="xl:relative">
        <div className="mx-auto max-w-2xl">
          {previousPathname && (
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Makalelere geri dön"
              className="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-0 xl:mt-0 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20"
            >
              <ArrowLeftIcon className="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400" />
            </button>
          )}
          <article>
            <header className="flex flex-col">
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
                {article.title}
              </h1>
              {article.mainImage && (
                <div className="mt-6 sm:mt-8">
                  <Image
                    src={article.mainImage}
                    alt={article.title}
                    width={800}
                    height={400}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
              <time
                dateTime={article.publishedAt}
                className="order-first flex items-center text-lg text-zinc-400 dark:text-zinc-500"
              >
                <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                <span className="ml-3">{formatDate(article.publishedAt)}</span>
              </time>
              <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
                Yazar: {article.author.name}
              </p>
              {article.categories && article.categories.length > 0 && (
                <div className="mt-2 flex flex-wrap">
                  {article.categories.map((category) => (
                    <span
                      key={category.title}
                      className="text-md mr-2 mt-1 text-zinc-500"
                    >
                      {category.title}
                    </span>
                  ))}
                </div>
              )}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap">
                  {article.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              )}
            </header>
            <Prose className="mt-8 text-justify" data-mdx-content>
              {children}
            </Prose>
            {article.fileAttachment && article.fileAttachment.asset && (
              <div className="mt-8">
                <h2 className="mb-4 text-xl font-bold">Ek Dosya</h2>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <a
                    href={article.fileAttachment.asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    Dosyayı İndir
                  </a>
                  <button
                    onClick={() => setShowPdf(!showPdf)}
                    className="inline-block rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                  >
                    {showPdf ? 'PDF Görünümünü Kapat' : 'PDF Görünümünü Aç'}
                  </button>
                </div>
                {showPdf && (
                  <div className="mt-4 h-screen">
                    <iframe
                      src={`${article.fileAttachment.asset.url}#view=FitH`}
                      className="h-full w-full"
                      title="PDF Viewer"
                    />
                  </div>
                )}
              </div>
            )}
          </article>
        </div>
      </div>
    </Container>
  )
}
