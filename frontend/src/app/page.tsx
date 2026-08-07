import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default function HomePage() {
  const { token } = getSession()
  if (token) redirect('/dashboard')
  redirect('/login')
}
