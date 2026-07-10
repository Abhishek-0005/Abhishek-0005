import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'LMS',
  description: 'Library Management System',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="max-w-6xl mx-auto p-4">
          <header className="py-4 border-b mb-6">
            <h1 className="text-2xl font-semibold">Library Management System</h1>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
