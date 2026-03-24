import Link from 'next/link'

import { ContainerInner, ContainerOuter } from '@/components/Container'

function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="transition hover:text-blue-800 dark:hover:text-blue-700"
    >
      {children}
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="mt-32 flex-none">
      <ContainerOuter>
        <div className="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
          <ContainerInner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-md font-medium text-zinc-800 dark:text-zinc-200">
                
                <NavLink href="/hizmetlerimiz">Hizmetlerimiz</NavLink>
                <NavLink href="/ekibimiz">Ekibimiz</NavLink>
                <NavLink href="/hakkimizda">Hakkımızda</NavLink>
                <NavLink href="/blog">Blog</NavLink>
                <NavLink href="/iletisim">İletişim</NavLink>
              </div>
              <p className="text-md text-zinc-400 dark:text-zinc-500">
                &copy; {new Date().getFullYear()} Yeditepe Hukuk Bürosu. Tüm hakları saklıdır.
              </p>
            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </footer>
  )
}
