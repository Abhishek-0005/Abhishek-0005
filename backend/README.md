# NestJS Backend

This backend provides JWT-based authentication with TypeORM + Postgres, migrations, and seeding.

## Features
- NestJS v10
- TypeORM v0.3 + Postgres
- JWT auth with bcrypt password hashing
- Config via @nestjs/config (env-based, dynamic)
- Migrations and seed script
- Basic users module and protected /users/me endpoint

## Setup
1. Copy env file
   cp .env.example .env

2. Install deps
   npm install

3. Run migrations
   npm run migration:run

4. Start dev
   npm run start:dev

## Auth Endpoints
- POST /auth/register
  Body: { "email": "user@example.com", "password": "StrongPass123!", "name": "User" }

- POST /auth/login
  Body: { "email": "user@example.com", "password": "StrongPass123!" }

Returns: { access_token }

## Users
- GET /users/me
  Header: Authorization: Bearer <token>

## Curl examples
Register
curl -X POST http://localhost:3001/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"StrongPass123!","name":"User"}'

Login
curl -X POST http://localhost:3001/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"StrongPass123!"}'

Get profile
curl http://localhost:3001/users/me \
  -H 'Authorization: Bearer REPLACE_TOKEN'

## Migrations
- Generate: npm run migration:generate -- MigrationName
- Run: npm run migration:run
- Revert: npm run migration:revert

## Seed
- Optionally seed an admin user from env
  npm run seed

## Notes
- Do not enable synchronize in production. Use migrations.
