import { type Metadata } from 'next'
import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { type ServiceWithSlug, getAllServices } from '@/lib/services'
import { getPageMeta } from '@/lib/pageMeta'
import Image from 'next/image'

function Service({ service }: { service: ServiceWithSlug }) {
  return (
    <article className="flex flex-col">
      {service.mainImage && (
        <div className="mb-4 aspect-video relative overflow-hidden rounded-lg">
          <Image
            src={service.mainImage}
            alt={service.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <Card>
        <Card.Title href={`/hizmetlerimiz/${service.slug}`}>
          {service.title}
        </Card.Title>
        <Card.Description>{service.description}</Card.Description>
        <Card.Cta>Hizmeti incele</Card.Cta>
      </Card>
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMeta('hizmetlerimiz')
  
  return {
    title: meta.title,
    description: meta.description,
  }
}

export default async function ServicesIndex() {
  let services = await getAllServices()
  const meta = await getPageMeta('hizmetlerimiz')

  return (
    <SimpleLayout
      title={meta.title}
      intro={meta.intro}
    >
      <div className="flex justify-center">
        <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40 max-w-3xl">
          <div className="flex flex-col space-y-16 text-justify">
            {services.map((service) => (
              <Service key={service._id} service={service} />
            ))}
          </div>
        </div>
      </div>
    </SimpleLayout>
  )
}

export const revalidate = 60
