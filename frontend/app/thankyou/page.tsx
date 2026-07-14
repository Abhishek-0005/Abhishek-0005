import Link from 'next/link'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Thank You',
}

export default function ThankYouPage() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Subtle animated gradient background using Tailwind only */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-violet-300 via-sky-200 to-rose-300 opacity-40 blur-3xl animate-pulse" />
        <div className="absolute right-[-8rem] bottom-[-8rem] h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-emerald-200 via-cyan-200 to-indigo-200 opacity-30 blur-3xl animate-pulse [animation-duration:4s]" />
      </div>

      <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 p-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Thank you!</h1>
        <p className="max-w-prose text-base text-gray-600 sm:text-lg">
          Your action was completed successfully.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
