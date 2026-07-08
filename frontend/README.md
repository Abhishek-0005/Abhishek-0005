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
npm install # or pnpm install / yarn install
npm run dev
```

- Open the printed localhost URL (Next picks an available port, e.g., 3000 or 3001).

## Auth flows

- Login: POST /api/auth/login -> proxies to `${API_BASE_URL}/auth/login`, sets httpOnly `token` cookie
- Register: POST /api/auth/register -> proxies to `${API_BASE_URL}/auth/register`, sets cookie
- Me: Dashboard server component fetches `${API_BASE_URL}/users/me` with Authorization: Bearer token
- Logout: POST /api/auth/logout -> clears cookie

Cookies are set as httpOnly, sameSite=lax, secure in production, path '/'.

## Scripts

- `npm run dev` - run dev server
- `npm run build` - build for production
- `npm run start` - start production server
- `npm run lint` - lint
- `npm run type-check` - TypeScript type checking
