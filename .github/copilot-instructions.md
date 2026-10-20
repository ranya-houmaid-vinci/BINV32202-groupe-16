# Project Guidelines

## Build and Test

- Use Node.js `>=22.14.0` (Node 24 LTS is recommended). Install the locked workspace dependencies with `npm ci`.
- First-time local setup: `npm run setup`. This creates `backend/.env` and initializes the demo SQLite database.
- Start both applications with `npm run dev`: the API runs on `http://localhost:3000` and the Vite frontend on `http://localhost:5173`.
- Run the full validation gate with `npm run check` (lint, TypeScript checks, Vitest, and both builds). Individual commands are `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
- Run one test file with `npm run test -w backend -- tests/offers.test.ts` or `npm run test -w frontend -- tests/CompaniesPage.test.tsx`. Pass Vitest filters after `--` when a narrower test is needed.
- Backend tests use Vitest and Supertest with an in-memory SQLite database. Frontend tests use Vitest, jsdom, and Testing Library with fetch mocks; do not use the development database in tests.
- Reset demo data with `npm run db:reset` only after stopping the dev server. Use `npm run db:init` to apply pending migrations and seed an empty database.

## Architecture

- This is an npm-workspaces monorepo with a React/Vite/TypeScript frontend and an Express/TypeScript backend backed by local SQLite through `better-sqlite3`.
- Backend request flow is `controllers -> services -> repositories -> SQLite`, with `mappers` converting database rows to domain objects and API DTOs. `app.ts` composes these layers and mounts authentication, authorization, and centralized error middleware.
- Keep HTTP concerns in `backend/src/controllers/`; services must not receive Express `Request` or `Response` objects. Put SQL in repositories, domain rules in services, and reusable access rules in `backend/src/services/permissions.ts`.
- Backend errors should be raised with `HttpError`; `errorHandler` converts them to the documented `{ "error": { "code", "message" } }` response shape.
- Database schema changes are ordered SQL files under `backend/src/db/migrations/`. Add a new numbered migration (for example `002_...sql`) rather than editing an applied migration. Seed data belongs under `backend/src/db/seed/`.
- Frontend flow is `pages -> hooks -> services/utils -> models`, with reusable presentational pieces in `components/`. `App.tsx` is the single caller of `useAuth`; pass the session token and logout callback down to pages.
- Frontend services call `/api/...` through the Vite proxy, validate response JSON with type guards, and use `readJson`. A `401` should trigger the page's `onUnauthorized` callback so the session returns to login.

## Conventions

- Backend relative imports include the `.ts` extension; TypeScript rewrites them to `.js` in the build output.
- The `Authorization` header contains the session token directly, without a `Bearer` prefix. The backend re-reads the user's account, roles, and companies from SQLite on every authenticated request; never rely on frontend role checks for security.
- Enforce permissions in the backend with named rules and `authorize(...)`; frontend permission helpers only control navigation and presentation.
- Database status values and enum-like codes are English storage/API codes such as `PUBLISHED` and `ACTIVE`; translate them to French labels in the frontend.
- API routes are documented in [backend/API.md](../backend/API.md), REST Client examples are in `backend/http/`, and the broader layer map and testing patterns are in [docs/architecture.md](../docs/architecture.md).
- Keep API, frontend behavior, tests, `backend/API.md`, and relevant `backend/http/*.http` examples aligned when adding or changing a route. Follow the existing paired backend/API-test and frontend/service-hook-page-test patterns.
- For a schema evolution, update the migration and its migration/constraint tests; do not modify the existing seed IDs used by tests unless the fixture contract itself changes.
