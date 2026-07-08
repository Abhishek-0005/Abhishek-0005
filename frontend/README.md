# Frontend (Next.js)

This is a minimal Next.js (App Router) + TypeScript + Tailwind CSS app that integrates with a backend providing:
- POST /auth/register
- POST /auth/login
- GET /users/me

It uses server Route Handlers to proxy auth and user requests to the backend, sets an httpOnly `token` cookie on successful login/register, and reads that cookie to call `/users/me`.

## Getting Started

Prerequisites:
- Node.js 18+

Install dependencies:

```bash
cd frontend
npm install
```

Configure environment variables (optional):
- `NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:3000`)

Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000 (or the port shown) to view the app.

## App Structure
- `src/app/(auth)/login` – Login page
- `src/app/(auth)/register` – Register page
- `src/app/dashboard` – Protected dashboard; loads profile via `/api/users/me`
- `src/app/api/auth/*` – Proxy routes for login/register/logout; set/clear `token` cookie
- `src/app/api/users/me` – Proxies `/users/me` including `Authorization: Bearer <token>`
- `src/middleware.ts` – Redirects unauthenticated requests from `/dashboard` to `/login` and authenticated users from auth pages to `/dashboard`.

## Notes
- The backend is expected to return `{ token: string }` or `{ accessToken: string }` on login/register.
- The `token` is stored in an `httpOnly` cookie and is not accessible from client-side JavaScript.
- Tailwind is set up with a few utility classes for simple styling.
