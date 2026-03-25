import { notFound } from 'next/navigation'
import { ServiceLayout } from '@/components/ServiceLayout'
import { getAllServices } from '@/lib/services'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
      <div className="prose dark:prose-invert w-full max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{service.body || ''}</ReactMarkdown>
      </div>
    </ServiceLayout>
  )
}
