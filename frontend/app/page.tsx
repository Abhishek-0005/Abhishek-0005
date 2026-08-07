import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Welcome</h1>
        <p className="mt-3 text-gray-600 max-w-lg mx-auto">
          This is a modern Next.js frontend wired to your backend authentication APIs.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/login">I already have an account</Link>
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Secure Auth" description="JWT stored in httpOnly cookies via server routes." />
        <Card title="Protected Pages" description="/dashboard is gated by middleware and server fetching." />
        <Card title="Tailwind UI" description="Accessible, responsive, and polished components." />
      </div>
    </div>
  )
}
