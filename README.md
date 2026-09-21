# Planora

Planora is a production-oriented personal productivity platform. It treats tasks as one part of a broader personal operating system: schedules, projects, habits, goals, focus sessions, notes, notifications, and calm weekly insight all live in one workspace.

## Highlights

- Modern Next.js 16 App Router experience with strict TypeScript and Tailwind CSS
- Responsive personal dashboard with today timeline, productivity score, upcoming work, habits, and focus time
- Schedule manager with day, week, and month views plus native drag-to-move blocks
- Drag-and-drop task board, projects with linked task progress, goals and milestones
- Habit completion with a four-week consistency heatmap
- A working Pomodoro/custom focus timer that records local sessions
- Notes editor, global `Cmd/Ctrl + K` search, notification center, dark mode, keyboard-aware UI
- Auth.js credentials authentication, optional GitHub OAuth, reset-token flow, protected `/app` routes, and server-side validation
- PostgreSQL/Prisma schema designed with user-owned records and indexed access paths
- Local-first preview state for a useful seed experience before a database is configured

## Technology

Next.js · React · TypeScript · Tailwind CSS · Radix UI · Lucide · React Hook Form · Zod · TanStack Query · date-fns · Recharts · Prisma · PostgreSQL · Auth.js · Vitest

## Prerequisites

- Node.js 20 or later
- pnpm 10 or later
- Docker Desktop for the recommended local PostgreSQL setup

## Quick start with Docker

1. Install dependencies and create a local environment file:

   ~~~powershell
   pnpm install
   Copy-Item .env.example .env
   ~~~

2. Generate a secure value for AUTH_SECRET and replace the placeholder in .env:

   ~~~powershell
   $bytes = New-Object byte[] 32
   [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
   [Convert]::ToBase64String($bytes)
   ~~~

3. Start PostgreSQL. This command matches the default DATABASE_URL in .env.example:

   ~~~powershell
   docker run --name planora-postgres -e POSTGRES_USER=planora -e POSTGRES_PASSWORD=change-me -e POSTGRES_DB=planora -p 5432:5432 -v planora_pgdata:/var/lib/postgresql/data -d postgres:16-alpine
   ~~~

   On later runs, start the existing container instead:

   ~~~powershell
   docker start planora-postgres
   ~~~

4. Generate the Prisma Client, apply migrations, optionally add development data, and run the application:

   ~~~powershell
   pnpm db:generate
   pnpm db:migrate
   pnpm db:seed
   pnpm dev
   ~~~

Visit http://localhost:3000.

The optional seed command creates a local demo account: demo@planora.app / PlanoraDemo2026. Do not use these public credentials in a shared environment.

## Manual setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy the environment template and supply a PostgreSQL connection and an Auth.js secret:

   ```bash
   cp .env.example .env
   ```

3. Generate Prisma client, migrate, and seed:

   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:seed
   ```

4. Start development:

   ```bash
   pnpm dev
   ```

The seed account is `demo@planora.app` with password `PlanoraDemo2026`; change or remove it before any shared deployment.

For a no-database UI walkthrough only, add `NEXT_PUBLIC_DEMO_MODE=true` locally. Do **not** enable that variable in production: it intentionally bypasses route protection for visual development.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL Prisma connection string |
| `AUTH_SECRET` | Yes | Cookie/JWT encryption secret |
| `AUTH_URL` | Yes in deployed environments | Canonical app URL |
| `GITHUB_ID`, `GITHUB_SECRET` | Optional | GitHub OAuth sign-in |
| `RESEND_API_KEY`, `EMAIL_FROM` | Optional | Secure password-reset delivery |

## Quality checks

```bash
pnpm test
pnpm lint
pnpm build
```

## Available scripts

```bash
pnpm dev           # Start the development server
pnpm build         # Create a production build
pnpm start         # Start the production server
pnpm lint          # Run ESLint
pnpm test          # Run unit tests
pnpm db:generate   # Generate Prisma Client
pnpm db:migrate    # Create and apply development migrations
pnpm db:seed       # Seed local demo data
```

## Project layout

```text
src/
  app/                 # App Router pages and secure API endpoints
  components/          # brand and reusable UI primitives
  features/            # domain-first product modules
    analytics/ auth/ dashboard/ focus/ goals/ habits/ notes/ projects/ schedule/ tasks/ workspace/
  lib/                 # Prisma singleton, validation, mail, utilities
  types/               # Auth.js type augmentation
prisma/
  migrations/          # Versioned PostgreSQL migrations
  schema.prisma        # scalable PostgreSQL data model
  seed.ts              # demo account and meaningful development records
```

## Deployment notes

Deploy to a Node-compatible host (for example Vercel, Render, or a container platform), provision PostgreSQL, add the variables above, run `prisma migrate deploy`, and configure the deployed domain in `AUTH_URL`. Reset email is intentionally disabled until a verified Resend sender is configured.

All database queries must be scoped by the authenticated user ID. The provided task route demonstrates the pattern; retain it for every new domain endpoint.

## Troubleshooting

### Prisma P1001: Cannot reach localhost:5432

PostgreSQL is not running or port 5432 is unavailable. Start and inspect the local container:

```bash
docker start planora-postgres
docker ps
```

If port 5432 is occupied, expose PostgreSQL on port 5433 instead and change `localhost:5432` to `localhost:5433` in DATABASE_URL.

### Registration is unavailable

Confirm that DATABASE_URL is set in .env, PostgreSQL is running, and the migrations were applied:

```bash
pnpm db:migrate
```

## Security notes

- Never commit .env, database URLs, OAuth secrets, or email-provider keys.
- Use a unique, strong AUTH_SECRET outside local development.
- Do not enable NEXT_PUBLIC_DEMO_MODE in a public deployment; it relaxes route protection for visual development.
- Create a clean database and do not run the development seed before sharing the app publicly.

## License

No license file is included yet. Add a LICENSE file before allowing reuse or accepting external contributions.
