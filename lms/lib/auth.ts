import { getServerSession } from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { compare } from 'bcryptjs'

export async function auth() {
  // align with /api/auth handler but usable in server components
  const options: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
      Credentials({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials.password) return null
          const user = await prisma.user.findUnique({ where: { email: credentials.email } })
          if (!user) return null
          const valid = await compare(credentials.password, user.passwordHash || '')
          if (!valid) return null
          return { id: user.id, email: user.email, name: user.name, role: user.role }
        }
      })
    ],
    session: { strategy: 'jwt' },
    callbacks: {
      async jwt({ token, user }) {
        if (user) (token as any).role = (user as any).role
        return token
      },
      async session({ session, token }) {
        if (session.user) {
          (session.user as any).id = token.sub
          ;(session.user as any).role = (token as any).role
        }
        return session
      }
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
  return getServerSession(options)
}
