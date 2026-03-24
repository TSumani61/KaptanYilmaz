import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/Card'
import { SimpleLayoutAlt } from '@/components/SimpleLayoutAlt'
import { getAllAuthors } from '@/lib/authors'
import { getPageMeta } from '@/lib/pageMeta'
import avatarImg from '@/images/avatar.jpg'

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMeta('ekibimiz')
  
  return {
    title: meta.title,
    description: meta.description,
  }
}

export default async function Team() {
  const lawyers = await getAllAuthors()
  const meta = await getPageMeta('ekibimiz')

  return (
    <SimpleLayoutAlt
      title={meta.title}
      intro={meta.intro}
    >
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        {lawyers.map((lawyer) => (
          <Link 
            href={`/ekibimiz/${lawyer.slug}`} 
            key={lawyer._id}
            className="group"
          >
            <Card as="li" className="text-xl flex flex-col items-center">
              <div className="relative z-10 w-full aspect-[4/6] mb-4 overflow-hidden">
                <Image
                  src={lawyer.image ? lawyer.image : avatarImg}
                  alt={lawyer.name}
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  fill
                />
              </div>
              <h2 className="mt-6 text-xl font-semibold text-zinc-800 dark:text-zinc-100 text-center">
                {lawyer.name}
              </h2>
              <Card.Description className="text-xl text-center">Avukat</Card.Description>
            </Card>

          </Link>
        ))}
      </ul>
    </SimpleLayoutAlt>
  )
}
