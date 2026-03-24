import { clsx } from 'clsx'

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        'mr-2 mb-2'
      )}
    >
      {children}
    </span>
  )
}