import './globals.css'
import { ReactNode } from 'react'
import { Navbar } from '@/components/ui/navbar'

export const metadata = {
  title: 'Auth App',
  description: 'Next.js frontend wired to backend auth',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="min-h-screen text-gray-900 antialiased">
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  )
}
