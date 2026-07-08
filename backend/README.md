# Expense Tracker Backend (NestJS + Prisma + PostgreSQL)

Single-tenant Expense Tracker API.

## Requirements
- Node.js 18+
- PostgreSQL 13+

## Setup
1. Copy env and install deps
```
cp .env.example .env
npm install
```
2. Set `DATABASE_URL` in `.env`.
3. Generate client, run migrations, and seed:
```
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```
4. Start dev server
```
npm run start:dev
```

Server runs on http://localhost:4000

## Endpoints
- GET /health
- Categories: GET/POST/PATCH/DELETE /categories
- Transactions: GET/POST/PATCH/DELETE /transactions, GET /transactions/:id
  - Filters: from, to, type, categoryId, q
- Reports: GET /reports/monthly?from=YYYY-MM&to=YYYY-MM
- Reports: GET /reports/category-breakdown?from=YYYY-MM-DD&to=YYYY-MM-DD
- Export: GET /export/transactions.csv (same filters as list)

## Testing
```
npm test
```
