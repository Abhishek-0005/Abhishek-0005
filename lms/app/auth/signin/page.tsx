'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await signIn('credentials', { redirect: false, email, password })
    if (res?.error) setError(res.error)
    if (res?.ok) window.location.href = '/'
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm space-y-3">
      <h2 className="text-xl font-semibold">Sign in</h2>
      <input className="border p-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button className="bg-blue-600 text-white px-3 py-2 rounded" type="submit">Sign in</button>
    </form>
  )
}
