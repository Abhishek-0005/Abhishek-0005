# Frontend (Next.js)

Next.js App Router frontend integrated with existing backend auth APIs (login/register/me).

## Quickstart

- Copy `.env.example` to `.env.local` and set:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

- Install deps and run:

```
cd frontend
pnpm install # or npm install / yarn
pnpm dev
```

- Open http://localhost:3000 (if you run Next on port 3000, change as needed)

## Auth flows

- Login: POST /api/auth/login -> proxies to `${API_BASE_URL}/auth/login`, sets httpOnly `token` cookie
- Register: POST /api/auth/register -> proxies to `${API_BASE_URL}/auth/register`, sets cookie
- Me: Dashboard server component fetches `${API_BASE_URL}/users/me` with Authorization: Bearer token
- Logout: POST /api/auth/logout -> clears cookie

Cookies are set as httpOnly, sameSite=lax, secure in production, path '/'.

## Scripts

- `pnpm dev` - run dev server
- `pnpm build` - build for production
- `pnpm start` - start production server
- `pnpm lint` - lint
- `pnpm type-check` - TypeScript type checking
