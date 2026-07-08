# Expense Tracker (Full-Stack)

A full-stack Expense Tracker application built with:
- Backend: NestJS, Prisma ORM, PostgreSQL
- Frontend: React + Vite + TypeScript
- Charts: react-chartjs-2 (Chart.js)

Key features:
- Track income and expenses with categories
- CRUD for categories and transactions
- Monthly reports (income, expenses, net) with per-category breakdown
- CSV export of transactions (with optional date filters)
- Docker Compose to run PostgreSQL and backend

## Project Structure

expense-tracker/
- backend/ — NestJS API + Prisma schema
- frontend/ — Vite React app
- docker-compose.yml — PostgreSQL + Backend services

## Prerequisites
- Node.js 18+
- npm 9+
- Docker (optional, for DB + backend via compose)

## Quick Start (Docker Compose: DB + Backend)

1. Copy environment files and adjust if needed:
   - Backend: `cp backend/.env.example backend/.env`

2. Start services (PostgreSQL + Backend):

   docker compose up --build

   This will:
   - Build and start the backend on http://localhost:3000
   - Start PostgreSQL on localhost:5432

3. Initialize the database schema and seed categories (once):

   docker compose exec backend npx prisma db push
   docker compose exec backend npx ts-node prisma/seed.ts

4. Verify health:

   curl http://localhost:3000/health

## Frontend (Vite + React)

1. Install deps and configure env:

   cd frontend
   cp .env.example .env
   npm install

   Ensure VITE_API_BASE_URL matches your backend (default http://localhost:3000).

2. Start dev server:

   npm run dev

   App runs at http://localhost:5173

## Backend (NestJS + Prisma)

1. Install deps and configure env:

   cd backend
   cp .env.example .env
   npm install

2. Set up database (if running locally instead of compose):
   - Create a PostgreSQL database
   - Set DATABASE_URL in backend/.env

3. Generate Prisma Client and push schema:

   npm run prisma:generate
   npx prisma db push

4. Seed default categories:

   npm run prisma:seed

5. Start dev server:

   npm run start:dev

   API available at http://localhost:3000

## API Overview

- GET /health
- Categories
  - GET /categories
  - POST /categories
  - PATCH /categories/:id
  - DELETE /categories/:id
- Transactions
  - GET /transactions?startDate&endDate&categoryId&type
  - GET /transactions/:id
  - POST /transactions
  - PATCH /transactions/:id
  - DELETE /transactions/:id
- Reports
  - GET /reports/monthly?year=YYYY
  - GET /reports/summary?startDate&endDate
- Export
  - GET /export/transactions.csv?startDate&endDate&categoryId&type

## Tests

Backend includes:
- Unit tests for ReportsService aggregation
- e2e test for /health

Run tests:

cd backend
npm test

## ESLint / Prettier

Both frontend and backend include basic ESLint + Prettier configurations.

## Notes
- Prisma Decimal is used for amounts; the API inputs/outputs use numbers.
- CORS origin is configured via CORS_ORIGIN (default: http://localhost:5173).
- CSV export returns `text/csv` with `Content-Disposition: attachment`.
