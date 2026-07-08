import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="card">
      <h1 className="text-xl font-semibold mb-4">Welcome</h1>
      <p className="mb-4">This is a minimal Next.js app integrated with backend auth.</p>
      <div className="flex gap-3">
        <Link className="link" href="/login">Login</Link>
        <Link className="link" href="/register">Register</Link>
        <Link className="link" href="/dashboard">Dashboard</Link>
      </div>
    </div>
  )
}
