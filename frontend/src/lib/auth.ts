import { cookies } from 'next/headers'
import { API_BASE_URL } from './env'

export function getSession() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value
  return { token }
}

export async function fetchMe(token?: string) {
  const authToken = token ?? getSession().token
  if (!authToken) return null
  const res = await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json()
}
