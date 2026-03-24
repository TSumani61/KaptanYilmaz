import { Merriweather, Open_Sans } from 'next/font/google'
import { type Metadata } from 'next'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'
import '@/styles/tailwind.css'

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-merriweather',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
})

export const metadata: Metadata = {
  title: {
    template: '%s - Yeditepe Hukuk Bürosu',
    default: 'Yeditepe Hukuk Bürosu - Uzman Hukuki Danışmanlık',
  },
  description:
    'Yeditepe Hukuk Bürosu olarak, çeşitli hukuki konularda uzman danışmanlık ve temsil hizmetleri sunuyoruz.',
  alternates: {
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
    },
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`h-full antialiased ${merriweather.variable} ${openSans.variable}`} suppressHydrationWarning>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <Providers>
          <div className="flex w-full">
            <Layout>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
