# Epic Technical Specification: Foundation & Infrastructure

Date: 2025-12-04
Author: MG
Epic ID: 1
Status: Draft

---

## Overview

Epic 1 establishes the complete technical foundation for "Name Your Next Great Idea" - a Launch Certainty Engine that bridges the gap between creative naming and trademark safety. This epic delivers the infrastructure enabling all subsequent user-facing features: database schema, authentication configuration, state management, server actions architecture, deployment pipeline, testing infrastructure, and background job processing.

While this epic doesn't deliver direct user features, it creates the type-safe, observable, and scalable foundation that makes all user-facing functionality possible. Without this foundation, no user can register, generate names, or purchase reports.

**Key Principle:** The architecture prioritizes "Certainty" through strict compile-time validation (Drizzle ORM, Zod, TypeScript strict mode) to minimize the risk of "False Negative" bugs in trademark safety scoring.

## Objectives and Scope

### In-Scope

- **Database Schema (Story 1.3):** Complete Drizzle ORM schema with all application tables, migrations, and RLS policies
- **Application Shell (Story 1.5):** Studio layout pattern with responsive split view (Chat/Canvas)
- **State Management (Story 1.6):** Zustand stores for session context and naming state with SSR hydration handling
- **Server Actions (Story 1.7):** Domain-organized actions with consistent ActionResponse pattern and Pino logging
- **Deployment Pipeline (Story 1.8):** Vercel configuration with GitHub Actions CI/CD
- **Testing Infrastructure (Story 1.9):** Vitest for unit/integration tests, Playwright for E2E
- **Background Jobs (Story 1.10):** Supabase Cron (pg_cron + pg_net) for scheduled tasks

### Out-of-Scope

- User-facing authentication UI (Epic 2)
- Narrative Architect chat interface (Epic 3)
- Payment processing implementation (Epic 4)
- PDF report generation logic (Epic 4)
- Trademark API integration business logic (Epic 3)

## System Architecture Alignment

This epic implements the foundational layer of the architecture defined in `docs/architecture.md`:

| Architecture Component | Epic 1 Implementation                            |
| ---------------------- | ------------------------------------------------ |
| **Data Persistence**   | Drizzle ORM v0.44.7 with PostgreSQL via Supabase |
| **Client State**       | Zustand v5.0.9 with persist middleware           |
| **API Pattern**        | Server Actions with ActionResponse envelope      |
| **Observability**      | Pino v10.1.0 + Sentry v10.28.0                   |
| **Background Jobs**    | Supabase Cron (pg_cron + pg_net)                 |
| **Testing**            | Vitest v3.2.x + Playwright v1.52.x               |

**ADRs Implemented:**

- ADR-001: Drizzle ORM over Prisma (type safety)
- ADR-003: Server Actions as Primary API
- ADR-006: Pino + Sentry for Observability
- ADR-008: Supabase Cron over Vercel Cron

## Detailed Design

### Services and Modules

| Module                  | Location                                 | Responsibility                                         | Dependencies              |
| ----------------------- | ---------------------------------------- | ------------------------------------------------------ | ------------------------- |
| **Database Connection** | `server/lib/db/index.ts`                 | Drizzle client initialization, connection pooling      | `drizzle-orm`, `postgres` |
| **Schema: Auth**        | `server/lib/db/schema/auth.ts`           | User profiles extension (links to Supabase auth.users) | `drizzle-orm/pg-core`     |
| **Schema: Public**      | `server/lib/db/schema/public.ts`         | All application tables                                 | `drizzle-orm/pg-core`     |
| **Logger**              | `server/lib/logger/index.ts`             | Pino configuration, child loggers, redaction           | `pino`, `pino-pretty`     |
| **Sentry Integration**  | `server/lib/sentry/index.ts`             | Error tracking, performance monitoring                 | `@sentry/nextjs`          |
| **Supabase Server**     | `server/lib/supabase/server.ts`          | Server-side Supabase client                            | `@supabase/ssr`           |
| **Supabase Middleware** | `server/lib/supabase/middleware.ts`      | Session refresh, cookie handling                       | `@supabase/ssr`           |
| **Session Store**       | `components/lib/stores/session-store.ts` | User type, current session ID                          | `zustand`                 |
| **Naming Store**        | `components/lib/stores/naming-store.ts`  | Criteria, generated names, selected name               | `zustand`                 |
| **Auth Actions**        | `server/actions/auth.ts`                 | signIn, signOut, signUp, setUserSegment                | Server Actions            |
| **Naming Actions**      | `server/actions/naming.ts`               | generateNames, refineNames (placeholder)               | Server Actions            |
| **Orders Actions**      | `server/actions/orders.ts`               | createOrder, getOrders (placeholder)                   | Server Actions            |

### Data Models and Contracts

All tables defined in `server/lib/db/schema/public.ts` using Drizzle ORM with **built-in RLS support**.

**RLS Strategy:** Tables use `pgTable.withRLS()` for automatic RLS enablement and `pgPolicy` for declarative policy definitions. We leverage Supabase's predefined roles (`authenticatedRole`, `anonRole`, `serviceRole`) from `drizzle-orm/supabase`.

```typescript
import { sql } from "drizzle-orm";
import {
  pgTable,
  pgPolicy,
  uuid,
  text,
  boolean,
  timestamp,
  jsonb,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { authenticatedRole, authUsers, authUid } from "drizzle-orm/supabase";

// user_profiles - extends Supabase auth.users (RLS enabled)
export const userProfiles = pgTable.withRLS(
  "user_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().unique(), // FK to auth.users
    segment: text("segment", { enum: ["lean", "high-stakes"] }),
    firstRunCompleted: boolean("first_run_completed").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // Users can only read/update their own profile
    pgPolicy("user_profiles_select_own", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.userId} = ${authUid}`,
    }),
    pgPolicy("user_profiles_update_own", {
      for: "update",
      to: authenticatedRole,
      using: sql`${table.userId} = ${authUid}`,
      withCheck: sql`${table.userId} = ${authUid}`,
    }),
  ]
);

// naming_sessions - chat conversation context (RLS enabled)
export const namingSessions = pgTable.withRLS(
  "naming_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    criteria: jsonb("criteria").notNull(), // { industry, description, tone, audience, constraints }
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("naming_sessions_user_id_idx").on(table.userId),
    // Users can only access their own sessions
    pgPolicy("naming_sessions_crud_own", {
      for: "all",
      to: authenticatedRole,
      using: sql`${table.userId} = ${authUid}`,
      withCheck: sql`${table.userId} = ${authUid}`,
    }),
  ]
);

// generated_names - AI-generated name suggestions (RLS enabled)
export const generatedNames = pgTable.withRLS(
  "generated_names",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => namingSessions.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    rationale: text("rationale"),
    domainStatus: jsonb("domain_status"), // { com: boolean, io: boolean, ai: boolean }
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("generated_names_session_id_idx").on(table.sessionId),
    // Users can access names in their sessions (via session ownership)
    pgPolicy("generated_names_select_via_session", {
      for: "select",
      to: authenticatedRole,
      using: sql`EXISTS (
        SELECT 1 FROM naming_sessions 
        WHERE naming_sessions.id = ${table.sessionId} 
        AND naming_sessions.user_id = ${authUid}
      )`,
    }),
    pgPolicy("generated_names_insert_via_session", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`EXISTS (
        SELECT 1 FROM naming_sessions 
        WHERE naming_sessions.id = ${table.sessionId} 
        AND naming_sessions.user_id = ${authUid}
      )`,
    }),
  ]
);

// risk_checks - trademark risk assessment results (RLS enabled)
export const riskChecks = pgTable.withRLS(
  "risk_checks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    nameId: uuid("name_id")
      .notNull()
      .references(() => generatedNames.id, { onDelete: "cascade" }),
    status: text("status", {
      enum: ["pending", "green", "amber", "red"],
    }).notNull(),
    factors: jsonb("factors").notNull(), // Signa.so response data
    checkedAt: timestamp("checked_at").defaultNow().notNull(),
  },
  (table) => [
    // Users can read risk checks for names in their sessions
    pgPolicy("risk_checks_select_via_name", {
      for: "select",
      to: authenticatedRole,
      using: sql`EXISTS (
        SELECT 1 FROM generated_names gn
        JOIN naming_sessions ns ON ns.id = gn.session_id
        WHERE gn.id = ${table.nameId}
        AND ns.user_id = ${authUid}
      )`,
    }),
  ]
);

// favorites - user saved names (RLS enabled)
export const favorites = pgTable.withRLS(
  "favorites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    nameId: uuid("name_id")
      .notNull()
      .references(() => generatedNames.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("favorites_user_id_idx").on(table.userId),
    // Users can only manage their own favorites
    pgPolicy("favorites_crud_own", {
      for: "all",
      to: authenticatedRole,
      using: sql`${table.userId} = ${authUid}`,
      withCheck: sql`${table.userId} = ${authUid}`,
    }),
  ]
);

// orders - De-Risking Report purchases (RLS enabled)
export const orders = pgTable.withRLS(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    nameId: uuid("name_id")
      .notNull()
      .references(() => generatedNames.id),
    productType: text("product_type", {
      enum: ["de-risking-report", "premium-report"],
    }).notNull(),
    polarOrderId: text("polar_order_id").unique(),
    status: text("status", {
      enum: ["pending", "processing", "completed", "failed", "cancelled"],
    }).notNull(),
    amountCents: integer("amount_cents").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("orders_user_id_idx").on(table.userId),
    // Users can only view their own orders
    pgPolicy("orders_select_own", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.userId} = ${authUid}`,
    }),
    // Insert only for own user_id (order creation)
    pgPolicy("orders_insert_own", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${table.userId} = ${authUid}`,
    }),
  ]
);

// reports - generated PDF reports (RLS enabled)
export const reports = pgTable.withRLS(
  "reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .unique()
      .references(() => orders.id, { onDelete: "cascade" }),
    pdfUrl: text("pdf_url"),
    generatedAt: timestamp("generated_at"),
  },
  (table) => [
    // Users can read reports linked to their orders
    pgPolicy("reports_select_via_order", {
      for: "select",
      to: authenticatedRole,
      using: sql`EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = ${table.orderId} 
        AND orders.user_id = ${authUid}
      )`,
    }),
  ]
);
```

**RLS Implementation Notes:**

1. **`pgTable.withRLS()`**: Automatically enables RLS on table creation (equivalent to `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).

2. **`authenticatedRole`** from `drizzle-orm/supabase`: Pre-defined Supabase role for logged-in users. No need to define with `.existing()`.

3. **`authUid`** from `drizzle-orm/supabase`: Resolves to `(SELECT auth.uid())` - the current user's UUID from Supabase auth.

4. **Policy Naming Convention**: `{table}_{operation}_{scope}` (e.g., `orders_select_own`, `favorites_crud_own`).

5. **Service Role Bypass**: Supabase's `service_role` bypasses RLS by default. Background jobs use service role for cross-user operations.

**Drizzle Kit Configuration for RLS:**

````typescript
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/lib/db/schema/*",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  entities: {
    roles: {
      provider: "supabase", // Excludes Supabase-managed roles from migrations
    },
  },
});

### APIs and Interfaces

**Server Actions Response Pattern:**

```typescript
// types/actions.ts
type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: ErrorCode };

type ErrorCode =
  | "AUTH_REQUIRED" // User not authenticated
  | "FORBIDDEN" // User lacks permission
  | "VALIDATION_ERROR" // Invalid input (Zod)
  | "NOT_FOUND" // Resource doesn't exist
  | "CONFLICT" // Duplicate or state conflict
  | "EXTERNAL_ERROR" // Third-party API failure
  | "INTERNAL_ERROR"; // Unexpected server error
````

**Server Actions Signatures:**

```typescript
// server/actions/auth.ts
"use server";
export async function signUp(
  input: SignUpInput
): Promise<ActionResponse<{ userId: string }>>;
export async function signIn(
  input: SignInInput
): Promise<ActionResponse<{ userId: string }>>;
export async function signOut(): Promise<ActionResponse<void>>;
export async function setUserSegment(
  segment: "lean" | "high-stakes"
): Promise<ActionResponse<void>>;

// server/actions/naming.ts (placeholder implementations)
("use server");
export async function createSession(
  criteria: NamingCriteria
): Promise<ActionResponse<{ sessionId: string }>>;
export async function generateNames(
  sessionId: string
): Promise<ActionResponse<GeneratedName[]>>;
export async function toggleFavorite(
  nameId: string
): Promise<ActionResponse<{ isFavorite: boolean }>>;

// server/actions/orders.ts (placeholder implementations)
("use server");
export async function createOrder(
  input: CreateOrderInput
): Promise<ActionResponse<{ orderId: string }>>;
export async function getOrderHistory(): Promise<ActionResponse<Order[]>>;
```

**REST Endpoints (Limited):**

| Endpoint              | Method | Purpose                        | Auth      |
| --------------------- | ------ | ------------------------------ | --------- |
| `/api/health/ready`   | GET    | Kubernetes/Vercel health probe | None      |
| `/api/webhooks/polar` | POST   | Payment webhook receiver       | Signature |

### Workflows and Sequencing

**Database Migration Flow:**

```
1. Developer modifies schema in server/lib/db/schema/*.ts
2. Run: npm run db:generate → Creates migration file in drizzle/
3. Run: npm run db:push → Applies schema to Supabase database
4. Commit migration files to version control
```

**Server Action Execution Flow:**

```
1. Client calls Server Action (e.g., createOrder)
2. Zod validates input schema
3. Supabase client created, auth checked
4. Business logic executed
5. Pino logs action with userId, duration
6. ActionResponse returned to client
7. revalidatePath called if data mutated
```

**Background Job Flow (Supabase Cron):**

```
1. pg_cron triggers job at scheduled time
2. pg_net makes HTTP POST to Edge Function
3. Edge Function executes task (e.g., cleanup sessions)
4. Result logged, errors captured by Sentry
5. Job run recorded in cron.job_run_details
```

## Non-Functional Requirements

### Performance

| Metric                | Target  | Measurement                         |
| --------------------- | ------- | ----------------------------------- |
| **Cold Start**        | < 3s    | Vercel serverless function init     |
| **Database Query**    | < 100ms | 95th percentile for indexed queries |
| **Server Action RTT** | < 500ms | Client call to response             |
| **Build Time**        | < 2 min | CI/CD pipeline                      |
| **Bundle Size**       | < 200KB | Initial JS payload (gzipped)        |

**Implementation:**

- Use Drizzle's query builder for optimized SQL
- Add indexes on frequently queried columns (user_id, session_id)
- Enable connection pooling via Supabase

### Security

| Requirement            | Implementation                                       | Source                   |
| ---------------------- | ---------------------------------------------------- | ------------------------ |
| **Authentication**     | Supabase Auth (SSR mode via @supabase/ssr)           | Architecture: Security   |
| **Authorization**      | Row Level Security (RLS) via Drizzle `pgPolicy`      | Architecture: Security   |
| **Input Validation**   | Zod schemas in Server Actions                        | Architecture: Patterns   |
| **API Key Protection** | Environment variables, never client-exposed          | Architecture: Deployment |
| **Log Redaction**      | Pino redact config for email, password, auth headers | Architecture: Logging    |
| **Session Management** | HTTP-only cookies via Supabase middleware            | Architecture: Security   |

**RLS Implementation via Drizzle:**

RLS policies are defined declaratively in the schema using Drizzle's built-in `pgPolicy` and `pgTable.withRLS()`:

```typescript
// Example: Orders table with RLS policies defined in schema
import { pgTable, pgPolicy, uuid, text, integer } from "drizzle-orm/pg-core";
import { authenticatedRole, authUid } from "drizzle-orm/supabase";
import { sql } from "drizzle-orm";

export const orders = pgTable.withRLS(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    // ... other columns
  },
  (table) => [
    pgPolicy("orders_select_own", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.userId} = ${authUid}`,
    }),
    pgPolicy("orders_insert_own", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${table.userId} = ${authUid}`,
    }),
  ]
);
```

**Generated SQL (via drizzle-kit generate):**

```sql
-- Drizzle automatically generates:
CREATE TABLE "orders" (...);
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select_own" ON "orders"
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "orders_insert_own" ON "orders"
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));
```

### Reliability/Availability

| Requirement         | Target               | Implementation                |
| ------------------- | -------------------- | ----------------------------- |
| **Uptime**          | 99.9%                | Vercel managed infrastructure |
| **Error Recovery**  | Graceful degradation | ActionResponse error codes    |
| **Data Durability** | 99.99%               | Supabase managed PostgreSQL   |
| **Failover**        | Automatic            | Vercel edge network           |

**Error Handling Pattern:**

- All Server Actions return ActionResponse (never throw to client)
- Sentry captures all unhandled exceptions
- Global error boundary provides user-friendly fallback

### Observability

| Signal          | Tool             | Configuration                             |
| --------------- | ---------------- | ----------------------------------------- |
| **Logs**        | Pino             | JSON structured, redaction, child loggers |
| **Errors**      | Sentry           | Auto-capture, PII filtering, source maps  |
| **Performance** | Sentry APM       | 10% trace sampling in production          |
| **Metrics**     | Vercel Analytics | Built-in, no configuration                |

**Pino Logger Configuration:**

```typescript
// server/lib/logger/index.ts
import pino from "pino";

export const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  redact: ["req.headers.authorization", "email", "password"],
  base: { env: process.env.NODE_ENV, service: "nyngi" },
  transport:
    process.env.NODE_ENV !== "production"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});

export const createServiceLogger = (service: string) =>
  logger.child({ service });
```

**Sentry Configuration:**

```typescript
// sentry.server.config.ts
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  beforeSend(event) {
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address;
    }
    return event;
  },
});
```

## Dependencies and Integrations

### Production Dependencies (from package.json)

| Package                | Version           | Purpose                 |
| ---------------------- | ----------------- | ----------------------- |
| `next`                 | 16.0.3            | App framework           |
| `react` / `react-dom`  | 19.2.0            | UI library              |
| `drizzle-orm`          | ^0.44.7           | Type-safe ORM           |
| `@supabase/ssr`        | ^0.7.0            | Supabase SSR client     |
| `zustand`              | ^5.0.9            | Client state management |
| `zod`                  | ^4.1.13           | Runtime validation      |
| `pino` / `pino-pretty` | ^10.1.0 / ^13.1.3 | Structured logging      |
| `@sentry/nextjs`       | ^10.28.0          | Error tracking & APM    |
| `ai`                   | ^5.0.102          | Vercel AI SDK           |
| `@ai-sdk/google`       | ^2.0.43           | Gemini integration      |
| `postgres`             | ^3.4.7            | PostgreSQL driver       |

### Dev Dependencies

| Package                         | Version             | Purpose           |
| ------------------------------- | ------------------- | ----------------- |
| `drizzle-kit`                   | ^0.31.7             | Migration tooling |
| `typescript`                    | ^5                  | Type checking     |
| `eslint` / `eslint-config-next` | ^9 / 16.0.3         | Linting           |
| `vitest`                        | 3.2.x (to install)  | Unit testing      |
| `playwright`                    | 1.52.x (to install) | E2E testing       |

### External Services

| Service          | Purpose                       | Auth Method                    |
| ---------------- | ----------------------------- | ------------------------------ |
| **Supabase**     | Database, Auth, Storage, Cron | `SUPABASE_SERVICE_ROLE_KEY`    |
| **Vercel**       | Hosting, Edge Functions       | Git integration                |
| **Sentry**       | Error tracking                | `SENTRY_DSN`                   |
| **Google Cloud** | Gemini AI (future)            | `GOOGLE_GENERATIVE_AI_API_KEY` |
| **Signa.so**     | Trademark API (future)        | `SIGNA_API_KEY`                |
| **Polar.sh**     | Payments (future)             | `POLAR_ACCESS_TOKEN`           |

## Acceptance Criteria (Authoritative)

### Story 1.3: Database Schema

1. **AC-1.3.1:** `server/lib/db/schema/public.ts` contains all 7 tables: `user_profiles`, `naming_sessions`, `generated_names`, `risk_checks`, `favorites`, `orders`, `reports`
2. **AC-1.3.2:** All tables use `snake_case` naming per Architecture ADR
3. **AC-1.3.3:** All foreign keys use `references()` with proper relationships and `onDelete: "cascade"` where appropriate
4. **AC-1.3.4:** Indexes defined inline using `index()` in table callback for `user_id` and `session_id` columns
5. **AC-1.3.5:** `npm run db:generate` creates valid migration files with RLS statements
6. **AC-1.3.6:** `npm run db:push` applies schema (including RLS policies) to Supabase successfully
7. **AC-1.3.7:** RLS policies defined using `pgTable.withRLS()` and `pgPolicy()` from `drizzle-orm/pg-core`
8. **AC-1.3.8:** RLS policies use `authenticatedRole` and `authUid` from `drizzle-orm/supabase`
9. **AC-1.3.9:** `drizzle.config.ts` configured with `entities.roles.provider: "supabase"` to exclude Supabase-managed roles

### Story 1.5: Application Shell

1. **AC-1.5.1:** `app/layout.tsx` includes global providers (Theme, Toast)
2. **AC-1.5.2:** `app/auth/layout.tsx` exists for unauthenticated routes
3. **AC-1.5.3:** Desktop layout uses CSS Grid with `30%/70%` split
4. **AC-1.5.4:** Mobile layout (<768px) uses bottom tab navigation
5. **AC-1.5.5:** Loading states use Skeleton components
6. **AC-1.5.6:** Layout components are in `components/shared/`

### Story 1.6: Zustand State Management

1. **AC-1.6.1:** `session-store.ts` has `userType`, `currentSessionId`, `setUserType()`, `setSessionId()`, `reset()`
2. **AC-1.6.2:** `naming-store.ts` has `criteria`, `generatedNames`, `selectedName`, `setCriteria()`, `addNames()`, `selectName()`
3. **AC-1.6.3:** Stores use `persist` middleware for localStorage backup
4. **AC-1.6.4:** `useHydration` hook exists for SSR hydration mismatch prevention
5. **AC-1.6.5:** All stores are typed with TypeScript generics

### Story 1.7: Server Actions Foundation

1. **AC-1.7.1:** `server/actions/auth.ts` contains signIn, signOut, signUp actions
2. **AC-1.7.2:** `server/actions/naming.ts` exists with placeholder implementations
3. **AC-1.7.3:** `server/actions/orders.ts` exists with placeholder implementations
4. **AC-1.7.4:** All actions return `ActionResponse<T>` type
5. **AC-1.7.5:** All actions validate input using Zod schemas
6. **AC-1.7.6:** All actions check authentication before processing
7. **AC-1.7.7:** All actions log via Pino with structured pattern: `{ action, userId, duration }`

### Story 1.8: Deployment Pipeline

1. **AC-1.8.1:** `vercel.json` exists with build command and output directory
2. **AC-1.8.2:** `.github/workflows/ci.yml` includes type-check, lint, test, build, e2e jobs
3. **AC-1.8.3:** All required environment variables are documented in README.md
4. **AC-1.8.4:** Preview deployments work for pull requests
5. **AC-1.8.5:** `npm run type-check` script exists (`tsc --noEmit`)

### Story 1.9: Testing Infrastructure

1. **AC-1.9.1:** `vitest.config.ts` exists with Next.js integration
2. **AC-1.9.2:** `playwright.config.ts` exists with multi-browser config
3. **AC-1.9.3:** `npm run test` runs Vitest unit tests
4. **AC-1.9.4:** `npm run test:e2e` runs Playwright tests
5. **AC-1.9.5:** `npm run test:coverage` generates coverage report
6. **AC-1.9.6:** Test directories mirror source structure: `tests/unit/`, `tests/integration/`, `tests/e2e/`
7. **AC-1.9.7:** Sample test exists verifying setup works

### Story 1.10: Background Jobs

1. **AC-1.10.1:** `pg_cron` and `pg_net` extensions are enabled in Supabase
2. **AC-1.10.2:** Vault secrets configured for project URL and service role key
3. **AC-1.10.3:** `session-cleanup` job scheduled for daily execution
4. **AC-1.10.4:** `pdf-queue-processor` job scheduled for every 5 minutes
5. **AC-1.10.5:** Edge Functions exist at `supabase/functions/cleanup-sessions/` and `supabase/functions/process-pdf-queue/`
6. **AC-1.10.6:** Jobs are visible in `cron.job` table

## Traceability Mapping

| AC        | Spec Section     | Component(s)                          | Test Idea                                             |
| --------- | ---------------- | ------------------------------------- | ----------------------------------------------------- |
| AC-1.3.1  | Data Models      | `server/lib/db/schema/public.ts`      | Unit: schema exports all 7 tables                     |
| AC-1.3.2  | Data Models      | All schema files                      | Unit: table names match snake_case regex              |
| AC-1.3.3  | Data Models      | `public.ts`                           | Unit: FK columns have `.references()` with onDelete   |
| AC-1.3.4  | Data Models      | `public.ts`                           | Integration: explain analyze shows index usage        |
| AC-1.3.5  | Workflows        | Drizzle CLI                           | Manual: run `db:generate`, verify files include RLS   |
| AC-1.3.6  | Workflows        | Drizzle CLI                           | Manual: run `db:push`, verify tables + policies exist |
| AC-1.3.7  | Security         | `public.ts`                           | Unit: all tables use `pgTable.withRLS()` pattern      |
| AC-1.3.8  | Security         | `public.ts`                           | Unit: policies import from `drizzle-orm/supabase`     |
| AC-1.3.9  | Configuration    | `drizzle.config.ts`                   | Manual: verify `entities.roles.provider: "supabase"`  |
| AC-1.5.1  | Services/Modules | `app/layout.tsx`                      | Unit: renders providers                               |
| AC-1.5.2  | Services/Modules | `app/auth/layout.tsx`                 | Unit: file exists and exports layout                  |
| AC-1.5.3  | APIs/Interfaces  | `components/shared/studio-layout.tsx` | E2E: desktop viewport shows split                     |
| AC-1.5.4  | APIs/Interfaces  | `components/shared/mobile-nav.tsx`    | E2E: mobile viewport shows bottom tabs                |
| AC-1.5.5  | APIs/Interfaces  | Layout components                     | E2E: loading states show skeletons                    |
| AC-1.6.1  | Services/Modules | `session-store.ts`                    | Unit: all exports present and callable                |
| AC-1.6.2  | Services/Modules | `naming-store.ts`                     | Unit: all exports present and callable                |
| AC-1.6.3  | Services/Modules | Both stores                           | Unit: persist middleware configured                   |
| AC-1.6.4  | Services/Modules | `useHydration` hook                   | Unit: hook prevents hydration mismatch                |
| AC-1.7.1  | APIs/Interfaces  | `server/actions/auth.ts`              | Integration: actions callable and return correct type |
| AC-1.7.4  | APIs/Interfaces  | All action files                      | Unit: return type matches ActionResponse              |
| AC-1.7.5  | APIs/Interfaces  | All action files                      | Unit: Zod validation applied                          |
| AC-1.7.6  | APIs/Interfaces  | All action files                      | Integration: unauthenticated returns AUTH_REQUIRED    |
| AC-1.7.7  | Observability    | All action files                      | Integration: logs contain action, userId, duration    |
| AC-1.8.1  | Deployment       | `vercel.json`                         | Manual: file exists with correct config               |
| AC-1.8.2  | Deployment       | `.github/workflows/ci.yml`            | CI: workflow runs all jobs                            |
| AC-1.9.1  | Testing          | `vitest.config.ts`                    | Unit: vitest runs successfully                        |
| AC-1.9.2  | Testing          | `playwright.config.ts`                | E2E: playwright runs successfully                     |
| AC-1.10.1 | Background Jobs  | Supabase Dashboard                    | Manual: extensions enabled                            |
| AC-1.10.3 | Background Jobs  | `cron.job` table                      | Query: job exists with correct schedule               |
| AC-1.10.5 | Background Jobs  | `supabase/functions/`                 | Unit: functions export handler                        |

## Risks, Assumptions, Open Questions

### Risks

| Risk                                          | Impact | Probability | Mitigation                                          |
| --------------------------------------------- | ------ | ----------- | --------------------------------------------------- |
| **R1:** Supabase Cron complexity              | Medium | Medium      | Document setup thoroughly, create migration scripts |
| **R2:** SSR hydration mismatches with Zustand | Medium | Low         | Implement `useHydration` hook, test thoroughly      |
| **R3:** Drizzle version incompatibility       | High   | Low         | Pin versions, test migrations on staging first      |
| **R4:** CI/CD pipeline slow                   | Low    | Medium      | Use npm cache, parallelize jobs                     |

### Assumptions

| ID                                              | Assumption                              | Impact if Wrong |
| ----------------------------------------------- | --------------------------------------- | --------------- |
| **A1:** Supabase Pro plan available             | Need to upgrade plan for pg_cron        |
| **A2:** Next.js 16.x compatible with Sentry SDK | May need to downgrade or wait for patch |
| **A3:** Vercel iad1 region sufficient           | May need multi-region later             |
| **A4:** 5-minute PDF queue interval acceptable  | May need faster processing              |

### Open Questions

| ID                                                     | Question | Owner             | Due Date |
| ------------------------------------------------------ | -------- | ----------------- | -------- |
| **Q1:** Should we add Redis for caching?               | MG       | Before Epic 3     |
| **Q2:** What's the Supabase plan tier?                 | MG       | Before Story 1.10 |
| **Q3:** Do we need database connection pooling config? | Dev      | During Story 1.3  |

## Test Strategy Summary

### Test Levels

| Level           | Framework  | Focus                         | Coverage Target                  |
| --------------- | ---------- | ----------------------------- | -------------------------------- |
| **Unit**        | Vitest     | Services, stores, utilities   | 80% services, 70% actions        |
| **Integration** | Vitest     | Server Actions with mocked DB | Auth flow, validation            |
| **E2E**         | Playwright | Critical user paths           | Layout responsive, auth redirect |

### Test Organization

```
tests/
├── unit/
│   ├── stores/
│   │   ├── session-store.test.ts
│   │   └── naming-store.test.ts
│   └── lib/
│       └── logger.test.ts
├── integration/
│   └── actions/
│       ├── auth.test.ts
│       └── naming.test.ts
└── e2e/
    ├── layout.spec.ts
    └── auth-redirect.spec.ts
```

### Key Test Scenarios

1. **Zustand Store Hydration:** Verify stores hydrate correctly without React warnings
2. **Server Action Auth Check:** Verify unauthenticated calls return AUTH_REQUIRED
3. **ActionResponse Pattern:** Verify all actions return consistent envelope
4. **RLS Enforcement:** Verify users cannot access other users' data
5. **Layout Responsiveness:** Verify split view on desktop, tabs on mobile
6. **Logger Redaction:** Verify sensitive fields are redacted in logs

---

_Generated by BMAD Epic Tech Context Workflow_
_Date: 2025-12-04_
_For: MG_
