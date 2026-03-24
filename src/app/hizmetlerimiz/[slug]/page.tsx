import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import { ServiceLayout } from '@/components/ServiceLayout'
import { getAllServices } from '@/lib/services'
import { components } from '@/components/components'
export const dynamic = 'force-dynamic'
export async function generateStaticParams() {
  const services = await getAllServices()
  return services.map((service) => ({
    slug: service.slug,
  }))
}

export const dynamicParams = false

export default async function Service({ params }: { params: { slug: string } }) {
  const services = await getAllServices()
  const service = services.find((s) => s.slug === params.slug)

  if (!service) {
    notFound()
  }

  return (
    <ServiceLayout service={service}>
      <PortableText value={service.body} components={components} />
    </ServiceLayout>
  )
}
