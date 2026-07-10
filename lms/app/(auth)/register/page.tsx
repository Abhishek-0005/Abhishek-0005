'use client'
import { useState } from 'react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) })
    if (res.ok) setMsg('Registered! You can now sign in.')
    else setMsg('Registration failed')
  }

  return (
    <form onSubmit={submit} className="max-w-sm space-y-3">
      <h2 className="text-xl font-semibold">Register</h2>
      <input className="border p-2 w-full" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      {msg && <p className="text-sm">{msg}</p>}
      <button className="bg-blue-600 text-white px-3 py-2 rounded">Register</button>
    </form>
  )
}
