# Frontend (Next.js App)

A modern Next.js 14 (App Router, TypeScript, Tailwind CSS) frontend that integrates with the existing backend APIs for authentication.

## Prerequisites
- Node.js 18+
- pnpm, npm, or yarn

## Setup
1. Copy environment file
```bash
cp .env.example .env.local
```
2. Adjust `NEXT_PUBLIC_API_BASE_URL` to point to your backend (default: http://localhost:3000)

3. Install deps and run dev server
```bash
npm install
npm run dev
# opens on http://localhost:3001
```

## Auth Flow
- Client pages call Next.js route handlers under `/api/auth/*`.
- These handlers proxy to the backend and set/remove an httpOnly `token` cookie.
- Protected routes (e.g., `/dashboard`) are guarded by middleware. Server component fetches `/users/me` using the cookie token.

## Scripts
- `dev` - start dev server at 3001
- `build` - build production
- `start` - run production at 3001
- `lint` - run ESLint

## Notes
- Cookie name: `token` (httpOnly, secure in production, sameSite=lax, path=/)
- Tailwind is enabled via `globals.css` and `tailwind.config.ts`.
