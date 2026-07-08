import Link from 'next/link'
import { cookies } from 'next/headers'
import { Button } from './button'
import { redirect } from 'next/navigation'

export async function Navbar() {
  const token = cookies().get('token')?.value

  async function logout() {
    'use server'
    cookies().delete('token')
    redirect('/login')
  }

  return (
    <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-semibold">Auth App</Link>
        <nav className="flex items-center gap-3">
          {/* Subtle, non-intrusive link */}
          <Link href="/thankyou" className="hidden text-sm text-gray-500 transition-colors hover:text-gray-700 sm:inline-block">Thank You</Link>

          {token ? (
            <>
              <Link href="/dashboard" className="text-sm text-gray-700 hover:text-gray-900">Dashboard</Link>
              <form action={logout}>
                <Button type="submit" variant="secondary">Logout</Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="secondary"><Link href="/login">Login</Link></Button>
              <Button asChild><Link href="/register">Sign up</Link></Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
