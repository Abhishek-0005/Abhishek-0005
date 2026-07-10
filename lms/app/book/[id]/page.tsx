import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function BookPage({ params }: { params: { id: string } }) {
  const book = await prisma.book.findUnique({ where: { id: params.id } })
  if (!book) return notFound()

  const activeLoans = await prisma.loan.count({ where: { bookId: book.id, returnedAt: null } })
  const available = Math.max(0, book.totalCopies - activeLoans)

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold">{book.title}</h2>
      <p className="text-gray-700">Author: {book.author}</p>
      <p className="text-gray-700">Category: {book.category}</p>
      <p className="text-gray-700">ISBN: {book.isbn}</p>
      <p className="text-gray-700">Available: {available}</p>
      <p className="text-gray-700">{book.summary}</p>
    </div>
  )
}
