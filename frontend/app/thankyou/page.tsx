import Link from 'next/link'
import { Button } from '@/components/ui/button'
import styles from './confetti.module.css'

export const metadata = { title: 'Thank You' }

export default function ThankYouPage() {
  const pieces = Array.from({ length: 60 })
  const colors = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6']

  return (
    <section className="relative overflow-hidden">
      <div className={`pointer-events-none ${styles.confetti}`} aria-hidden>
        {pieces.map((_, i) => {
          const left = Math.random() * 100
          const delay = Math.random() * 3
          const duration = 3 + Math.random() * 2
          const bg = colors[i % colors.length]
          const transformOrigin = `${Math.random() * 50}% ${Math.random() * 50}%`
          return (
            <span
              key={i}
              className={styles.piece}
              style={{
                left: `${left}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                backgroundColor: bg,
                transformOrigin,
              }}
            />
          )
        })}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="mx-auto max-w-2xl rounded-2xl border bg-white/90 p-8 text-center shadow-lg backdrop-blur">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-3xl">🎉</div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Thank You!</h1>
          <p className="mt-3 text-base text-gray-600 sm:text-lg">
            We appreciate you. Your action was successful. You can continue to your
            dashboard or head back home.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>

      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-50 via-white to-primary-100" />
    </section>
  )
}
