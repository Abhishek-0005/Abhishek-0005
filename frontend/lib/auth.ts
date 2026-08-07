import { cookies } from 'next/headers'

export function getTokenFromCookies() {
  const token = cookies().get('token')?.value
  return token
}
