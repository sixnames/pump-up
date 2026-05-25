# Pump Up

Pump Up is a workout tracking application built with Next.js and Payload CMS. The frontend provides authenticated workout pages for viewing, creating, and updating workouts, while Payload CMS provides the admin UI, API routes, and MongoDB-backed collections for users, roles, exercises, exercise groups, and workouts.

## Stack

- TypeScript
- Next.js 16 App Router
- React 19
- Payload CMS 3
- MongoDB via `@payloadcms/db-mongodb`
- Tailwind CSS 4 and Radix UI components
- pnpm 10

## Requirements

- Node.js `^18.20.2` or `>=24.14.1`
- pnpm `10.27.0`
- MongoDB database reachable from the app

## Setup

Install dependencies:

```bash
pnpm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Fill in the required environment variables in `.env`, especially `PAYLOAD_SECRET`, `MONGODB_URI`, and `MONGO_DB_NAME`.

Run the development server:

```bash
pnpm devsafe
```

Useful local routes:

- Frontend app: `http://localhost:3000`
- Create workout: `http://localhost:3000/create-workout`
- Update workout: `http://localhost:3000/update-workout/:id`
- Payload admin: `http://localhost:3000/admin`
- Payload REST API: `http://localhost:3000/api`
- GraphQL API: `http://localhost:3000/api/graphql`
- GraphQL playground: `http://localhost:3000/api/graphql-playground`

## Production

Build the app:

```bash
pnpm build
```

Start the built app:

```bash
pnpm start
```

The current `start` script runs `next start -p 80`. Port 80 may require elevated privileges depending on the host environment.

## Scripts

| Script | Description |
| --- | --- |
| `pnpm devsafe` | Removes `.next` and starts the Next.js dev server with Turbopack. |
| `pnpm build` | Builds the Next.js/Payload app. |
| `pnpm start` | Starts the production Next.js server on port 80. |
| `pnpm generate:importmap` | Regenerates the Payload admin import map. |
| `pnpm generate:types` | Regenerates Payload TypeScript types in `payload-types.ts`. |
| `pnpm cold-start` | Seeds the initial admin user when cold start is enabled. |
| `pnpm get-remote-db` | Copies configured collections from a remote MongoDB database into the local database. |
| `pnpm test` | Runs `cypress run`. TODO: add or document the Cypress configuration/specs if they are kept outside this repo. |

## Code Style

The repo includes Prettier and ESLint configuration:

- ESLint extends `next/core-web-vitals`.
- Prettier uses LF line endings, semicolons, single quotes, 2-space indentation, trailing commas, and a 120-character print width.

TODO: add package scripts for linting/formatting if these checks should be run from `pnpm`.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `PAYLOAD_SECRET` | Yes | Secret used by Payload CMS. |
| `MONGODB_URI` | Yes | MongoDB connection URI. |
| `MONGO_DB_NAME` | Yes | MongoDB database name used by Payload. |
| `NODE_ENV` | No | Standard Node environment. Development enables Payload admin auto-login when credentials are set. |
| `DEV_ADMIN_USERNAME` | Development | Username used for Payload admin auto-login in development. |
| `DEV_ADMIN_PASSWORD` | Development | Password used for Payload admin auto-login in development. |
| `ALLOW_COLD_START` | For `pnpm cold-start` | Must be `true` to allow initial admin/role seeding. |
| `REMOTE_DB_NAME` | For `pnpm get-remote-db` | Source database name for copying remote collection data. |
| `RUN_ENVIRONMENT` | No | When set to `development`, logger output also goes to the console. |
| `NEXT_TELEMETRY_DISABLED` | No | Disables Next.js telemetry when set to `1`. |

TODO: update `.env.example` with every required variable and confirm the intended local MongoDB URI format.

## Tests

Run the configured test command:

```bash
pnpm test
```

The script calls `cypress run`, but no Cypress specs or config were found in this repository. TODO: add Cypress tests/configuration or update the test script to match the intended test runner.

## Project Structure

```text
app/
  (frontend)/              Next.js frontend routes and global styles
  (payload)/               Payload admin, REST API, GraphQL, and playground routes
assets/                    Static or imported project assets
collections/               Payload collection definitions and collection actions
components/                App, admin, form, table, and UI components
hooks/                     Shared React hooks
lib/                       Shared utilities, Payload helpers, logging, and document helpers
lib/helpers/               Operational scripts for cold start and database copying
public/                    Public assets served by Next.js
payload.config.ts          Payload CMS configuration
payload-types.ts           Generated Payload TypeScript types
next.config.ts             Next.js configuration wrapped with Payload
```

## Entry Points

- `app/(frontend)/layout.tsx` defines the main frontend shell, providers, sidebar, theme, and authenticated user context.
- `app/(frontend)/page.tsx` renders the main workouts page.
- `app/(frontend)/create-workout/page.tsx` renders the workout creation flow.
- `app/(frontend)/update-workout/[id]/page.tsx` renders the workout update flow.
- `app/(payload)/admin/[[...segments]]/page.tsx` serves the Payload admin UI.
- `app/(payload)/api/[...slug]/route.ts` serves Payload REST endpoints.
- `app/(payload)/api/graphql/route.ts` serves the Payload GraphQL API.
- `payload.config.ts` configures Payload collections, MongoDB, admin UI, localization, and generated types.

## Data Model

Configured Payload collections:

- `users`
- `roles`
- `exercises`
- `exercise-groups`
- `workouts`

## License

MIT. See `LICENSE`.
