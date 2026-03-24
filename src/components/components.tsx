import Image from 'next/image'
import Link from 'next/link'
import { PortableTextReactComponents } from '@portabletext/react'

export const components: Partial<PortableTextReactComponents> = {
  block: {
    h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-semibold mt-6 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-medium mt-4 mb-2">{children}</h3>,
    normal: ({ children }) => <p className="mb-4 text-lg">{children}</p>,
  },
  marks: {
    link: ({ value, text }) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
      return (
        <Link href={value?.href || ''} target={target} rel={target === '_blank' ? 'noopener noreferrer' : ''}>
          {text}
        </Link>
      )
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null
      }
      return (
        <div className="my-8">
          <Image
            src={value}
            alt={value.alt || ' '}
            loading="lazy"
            className="rounded-lg"
            width={800}
            height={600}
          />
        </div>
      )
    },
  },
}
