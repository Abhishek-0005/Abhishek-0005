import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function BooksAdminPage() {
  const books = await prisma.book.findMany({ orderBy: { title: 'asc' } })
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Books</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Title</th><th>Author</th><th>ISBN</th><th>Category</th>
          </tr>
        </thead>
        <tbody>
          {books.map(b => (
            <tr key={b.id} className="border-b last:border-0">
              <td className="py-2"><Link className="underline" href={`/book/${b.id}`}>{b.title}</Link></td>
              <td>{b.author}</td>
              <td>{b.isbn}</td>
              <td>{b.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
