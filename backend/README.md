# Backend (NestJS)

This folder contains a minimal NestJS backend skeleton prepared for future expansion. It compiles and runs without external DB/JWT/Passport dependencies. Strategies and guards are placeholders, and no database is wired yet.

## Requirements
- Node.js 18+
- PNPM / NPM / Yarn

## Getting Started

1. Install dependencies
   - npm install

2. Configure environment variables
   - cp .env.example .env
   - Edit values as needed (optional)

3. Run in development
   - npm run start:dev

4. Build and run in production mode
   - npm run build
   - npm run start

The server starts on the port from `PORT` (default 3000): http://localhost:3000

## Available Endpoints

- POST /auth/login
  - Body: `{ "username": "any", "password": "any" }`
  - Response: `{ "access_token": "dummy-token", "user": { "username": "..." } }`

- GET /users
  - Requires header: `Authorization: Bearer dummy-token`
  - Response: an array of dummy users (without passwords)

## Project Structure

```
src/
├── app.module.ts
├── main.ts
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── filters/
│   └── utils/
├── config/
│   ├── jwt.config.ts
│   └── database.config.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── dto/
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   └── interfaces/
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── user.entity.ts
│   └── dto/
└── database/
    ├── migrations/
    └── seeds/
```

## Notes
- The `JwtAuthGuard` and strategy classes (`jwt.strategy.ts`, `local.strategy.ts`) are simple placeholders and do not use `@nestjs/passport` or real JWT validation.
- `@nestjs/config` is wired globally, but database/JWT configuration files are placeholders for future use.
- No ORM or external database packages are included.
