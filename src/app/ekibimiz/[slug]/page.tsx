import { notFound } from 'next/navigation'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getAllAuthors, getAuthorPosts } from '@/lib/authors'
import { Container } from '@/components/Container'
import { Card } from '@/components/Card'
import { formatDate } from '@/lib/formatDate'
import avatarImg from '@/images/avatar.jpg'

export async function generateStaticParams() {
  const authors = await getAllAuthors()
  return authors.map((author) => ({
    slug: author.slug,
  }))
}

export default async function LawyerProfile({
  params,
}: {
  params: { slug: string }
}) {
  const authors = await getAllAuthors()
  const lawyer = authors.find((a) => a.slug === params.slug)

  if (!lawyer) {
    notFound()
  }

  const posts = await getAuthorPosts(lawyer._id)

  return (
    <Container className="mt-16 lg:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-12">
        <div>
          <div className="mx-auto max-w-xs lg:max-w-none">
            <Image
              src={lawyer.image ? lawyer.image : avatarImg}
              alt={lawyer.name}
              width={400}
              height={600}
              className="aspect-[4/6] rounded-2xl object-cover lg:ml-20"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            {lawyer.name}
          </h1>
          <div className="prose dark:prose-invert mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{lawyer.bio || ''}</ReactMarkdown>
          </div>
        </div>
        <div className="lg:pl-10">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
            Yazılar
          </h2>
          <div className="mt-6 space-y-8">
            {posts.map(
              (post: any) => (
                <Card key={post._id}>
                  <Card.Title href={`/blog/${post.slug}`}>
                    {post.title}
                  </Card.Title>
                  <Card.Eyebrow decorate>
                    {formatDate(post.publishedAt)}
                  </Card.Eyebrow>
                  <Card.Description>{post.description}</Card.Description>
                  <Card.Cta>Blog yazısını oku</Card.Cta>
                </Card>
              ),
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}

export const revalidate = 60
