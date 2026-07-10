# Library Management System (LMS)

Tech stack: Next.js 14 (App Router) + TypeScript + Tailwind CSS + PostgreSQL + Prisma + NextAuth

## Quickstart

- Copy `.env.example` to `.env.local` and set values
- Install deps: `npm ci` (run inside `lms/`)
- Generate Prisma: `npx prisma generate`
- Create DB and run migrations: `npx prisma migrate dev --name init`
- Seed: `npm run seed`
- Dev: `npm run dev`

Default admin: admin@example.com / Admin@123

## Structure

- app/ - pages and API route handlers
  - / - Catalog list
  - /book/[id] - Book details with availability
  - /auth/signin - Sign in
  - /(auth)/register - Member self-registration
  - /dashboard/* - Admin/Librarian dashboards
- prisma/ - schema, migrations and seed
- lib/ - helpers (prisma, auth, time)
- tests/ - vitest tests
- .github/workflows/deploy.yml - CI workflow

## Scripts
- dev, build, start, lint, typecheck, test, seed, migrate

## Environment
- DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL

## Notes
- Role-based access enforced in API routes and via middleware for /dashboard.
