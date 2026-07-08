# Expense Tracker Backend (NestJS + Prisma + PostgreSQL)

Single-tenant API for tracking income and expenses.

## Tech
- NestJS (TypeScript)
- Prisma ORM
- PostgreSQL

## Env
Copy `.env.example` to `.env` and set:
- `DATABASE_URL` Postgres connection string
- `PORT` (default 4000)

CORS is enabled for `http://localhost:5173`.

## Prisma
- Generate client: `npm run prisma:generate`
- Create dev migration: `npm run prisma:migrate`
- Seed defaults: `npm run prisma:seed`

## Scripts
- `npm run start:dev`
- `npm run build`
- `npm run start:prod`
- `npm test`

## Endpoints
- `GET /health`
- Categories: `GET /categories`, `POST /categories`, `PATCH /categories/:id`, `DELETE /categories/:id`
- Transactions: `GET /transactions` (filters: `from`, `to`, `type`, `categoryId`, `q`), `GET /transactions/:id`, `POST /transactions`, `PATCH /transactions/:id`, `DELETE /transactions/:id`
- Reports: `GET /reports/monthly?from=YYYY-MM&to=YYYY-MM`, `GET /reports/category-breakdown?from=YYYY-MM-DD&to=YYYY-MM-DD`
- Export: `GET /export/transactions.csv` (supports same filters as list)

## Local setup
1. `cd backend`
2. `npm i`
3. Create `.env`
4. `npm run prisma:generate`
5. `npm run prisma:migrate`
6. `npm run prisma:seed`
7. `npm run start:dev`

No Docker files are provided.
