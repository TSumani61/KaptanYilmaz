import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/Card'
import { Container } from '@/components/Container'
import { type ArticleWithSlug, getAllArticles } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'
import { getAllServices, ServiceWithSlug } from '@/lib/services'
import { getHomePageMeta } from '@/lib/homePageMeta'
import { getAllAuthors } from '@/lib/authors'
import avatarImg from '@/images/avatar.jpg'

function Article({ article }: { article: ArticleWithSlug }) {
  // Check if it's a blog post by looking for the _type property
  const isBlogPost = '_type' in article && article._type === 'post'
  const urlPath = isBlogPost ? 'blog' : 'makaleler'

  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/${urlPath}/${article.slug}`}>
          {article.title}
        </Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={article.publishedAt}
          className="md:hidden"
          decorate
        >
          {formatDate(article.publishedAt)}
        </Card.Eyebrow>
        <Card.Description>{article.description}</Card.Description>
        <Card.Cta>{isBlogPost ? 'Blog yazısını oku' : 'Makaleyi oku'}</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={article.publishedAt}
        className="mt-1 hidden md:block"
      >
        {formatDate(article.publishedAt)}
      </Card.Eyebrow>
    </article>
  )
}

function Service({ service }: { service: ServiceWithSlug }) {
  return (
    <Card as="article">
      <Card.Title href={`/hizmetlerimiz/${service.slug}`}>
        {service.title}
      </Card.Title>
      <Card.Description>{service.description}</Card.Description>
      <Card.Cta>Hizmeti incele</Card.Cta>
    </Card>
  )
}

export default async function Home() {
  let articles = await getAllArticles()
  let services = await getAllServices()
  let lawyers = await getAllAuthors()
  let meta = await getHomePageMeta()
  
  // Sort articles by date
  const allContent = articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )

  return (
    <>
      <div className="relative h-[90vh] w-full overflow-hidden">
        <Image
          src={meta.heroImage || '/images/background.jpg'}
          alt={meta.heroTitle}
          layout="fill"
          objectFit="cover"
          priority
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <Container className="relative z-10 flex h-full flex-col justify-center text-white">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {meta.heroTitle}
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-white">
            {meta.heroDescription}
          </p>
        </Container>
      </div>

      <Container className="mt-24 md:mt-28">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col gap-16">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
              {meta.articlesTitle}
            </h2>
            {allContent.slice(0, 4).map((content) => (
              <Article key={content._id} article={content} />
            ))}
          </div>
          <div className="space-y-10 lg:pl-16 xl:pl-24">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
              {meta.servicesTitle}
            </h2>
            {services.slice(0, 4).map((service) => (
              <Service key={service._id} service={service} />
            ))}
          </div>
        </div>
      </Container>

      <Container className="mt-24 md:mt-28">
        <h2 className="mb-12 text-center text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
          {meta.teamTitle}
        </h2>
        <ul className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {lawyers.map((lawyer) => (
            <Link
              href={`/ekibimiz/${lawyer.slug}`}
              key={lawyer._id}
              className="group"
            >
              <Card as="li" className="flex flex-col items-center text-xl">
                <div className="relative z-10 mb-4 aspect-[4/6] w-full overflow-hidden">
                  <Image
                    src={lawyer.image ? lawyer.image : avatarImg}
                    alt={lawyer.name}
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    fill
                  />
                </div>
                <h2 className="mt-6 text-center text-xl font-semibold text-zinc-800 dark:text-zinc-100">
                  {lawyer.name}
                </h2>
                <Card.Description className="text-center text-xl">
                  Avukat
                </Card.Description>
              </Card>
            </Link>
          ))}
        </ul>
      </Container>
      <Container className="mt-24 md:mt-28">
        <h2 className="mb-8 text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
          {meta.linksTitle}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {meta.links.map((link, index) => (
            <Card key={index}>
              <Card.Title
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.title}
              </Card.Title>
              <Card.Description>{link.description}</Card.Description>
              <Card.Cta>Ziyaret et</Card.Cta>
            </Card>
          ))}
        </div>
      </Container>
      <Container className="mt-24 md:mt-28">
        <h2 className="mb-8 text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
          {meta.aboutTitle}
        </h2>
        <div className="text-lg dark:prose-invert">
          <p>{meta.aboutContent}</p>
        </div>
      </Container>

      <Container className="mt-24 md:mt-28">
        <h2 className="mb-8 text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
          {meta.contactTitle}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-lg font-semibold">Adres</h3>
            <p>
              Akşemsettin Mah., Fevzipaşa Cad. No:107, Kat:3, 34080 Fatih /
              İSTANBUL
            </p>
            <h3 className="mb-2 mt-4 text-lg font-semibold">Telefon</h3>
            <p>
              <a href="tel:+90 532 224 20 87" className="hover:text-blue-500">
                +90 532 224 20 87
              </a>
            </p>
            <h3 className="mb-2 mt-4 text-lg font-semibold">E-posta</h3>
            <p>
              <a
                href="mailto:av.kaptanyilmaz@gmail.com"
                className="hover:text-blue-500"
              >
                av.kaptanyilmaz@gmail.com
              </a>
            </p>
          </div>
          <div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.2045301338517!2d28.941261888148578!3d41.020781044791654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caba22171a66bb%3A0x48e10c37f27b9291!2sAv.%20Kaptan%20YILMAZ%20%2F%20Yeditepe%20Hukuk%20B%C3%BCrosu!5e0!3m2!1sen!2sus!4v1729485589655!5m2!1sen!2sus"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </Container>
    </>
  )
}

export const revalidate = 60 // Revalidate this page every 60 seconds
