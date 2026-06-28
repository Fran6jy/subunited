# SubUnited

SubUnited is a premium subscription management and digital access marketplace built with Next.js 15, TypeScript, Prisma, PostgreSQL, Redis, and Better Auth.

> Use a patched Next.js 15 release or newer when deploying to production.

## Phase 1 foundation included

- Next.js 15 App Router scaffold
- Tailwind-based premium UI foundation
- Prisma schema for marketplace, credentials, purchases, payments, wallets, notifications, jobs, and audit logs
- Better Auth integration scaffold
- AES-256-GCM encryption utilities
- Argon2id password utilities
- Redis and BullMQ queue foundation
- Seed script with Nigeria-focused sample catalog
- Docker and Docker Compose setup
- Environment validation with Zod
- Security headers middleware

## Quick start

1. Copy `.env.example` to `.env`
2. Start infrastructure:

```bash
docker compose up -d
```

3. Install dependencies:

```bash
npm install
```

4. Generate Prisma client:

```bash
npm run db:generate
```

5. Push schema:

```bash
npm run db:push
```

6. Seed demo data:

```bash
npm run db:seed
```

7. Start dev server:

```bash
npm run dev
```

## Current routes

- `/` landing page
- `/marketplace` marketplace catalog
- `/dashboard` dashboard preview
- `/login` login screen
- `/api/health` health endpoint
- `/api/auth/[...all]` Better Auth handler

## Notes

This is the production-oriented foundation. Payments, OTP orchestration, IMAP email ingestion, admin workflows, testing, and CI/CD should be added in the next phases.
