import Link from 'next/link'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import styles from './confetti.module.css'

export const metadata: Metadata = {
  title: 'Thank You',
}

export default function ThankYouPage() {
  return (
    <div className="relative">
      {/* Lightweight CSS-only confetti */}
      <div className={styles.confetti} aria-hidden="true">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className={styles.piece} />
        ))}
      </div>

      <section className="relative z-10 mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 p-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Thank you!</h1>
        <p className="max-w-prose text-base text-gray-600 sm:text-lg">
          We appreciate you. Your action was completed successfully.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
