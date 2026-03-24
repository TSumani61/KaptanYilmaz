import { Button } from '@/components/Button'
import { Container } from '@/components/Container'

export default function NotFound() {
  return (
    <Container className="flex h-full items-center pt-16 sm:pt-32">
      <div className="flex flex-col items-center">
        <p className="text-lg font-semibold text-zinc-400 dark:text-zinc-500">
          404
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
          Sayfa bulunamadı
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Üzgünüz, aradığınız sayfa bulunamadı.
        </p>
        <Button href="/" variant="secondary" className="mt-4">
          Ana sayfaya dön
        </Button>
      </div>
    </Container>
  )
}
