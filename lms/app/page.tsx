import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function HomePage() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return (
    <main>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Catalog</h2>
        <Link href="/auth/signin" className="text-blue-600 underline">Sign in</Link>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {books.map((b) => (
          <li key={b.id} className="rounded border p-4 bg-white">
            <h3 className="font-medium text-lg">{b.title}</h3>
            <p className="text-sm text-gray-600">{b.author}</p>
            <Link className="text-blue-600 underline text-sm" href={`/book/${b.id}`}>Details</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
