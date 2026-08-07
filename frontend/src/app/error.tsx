"use client"

export default function Error({ error }: { error: Error & { digest?: string } }) {
  return (
    <div className="card">
      <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
      <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">{error?.message}</pre>
    </div>
  )
}
