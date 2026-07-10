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
- prisma/ - schema and seed
- lib/ - helpers (prisma, auth)
- tests/ - vitest tests
- .github/workflows/deploy.yml - CI workflow
