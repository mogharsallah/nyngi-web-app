# Name Your Next Great Idea - Epic Breakdown

**Author:** MG
**Date:** 4 December 2025
**Project Level:** Web Application (LegalTech)
**Target Scale:** MVP → Growth
**Last Updated:** Architecture alignment update (2025-12-04)

---

## Overview

This document provides the complete epic and story breakdown for "Name Your Next Great Idea," decomposing the requirements from the [PRD](./prd.md) into implementable stories.

**Living Document Notice:** This version incorporates full context from PRD, UX Design, and the **updated Architecture document (2025-12-04)**. Stories include interaction patterns, technical decisions with verified dependency versions, Signa.so trademark API integration, and detailed acceptance criteria.

### Epic Summary

| Epic  | Title                            | Goal                                                         | FRs Covered                              |
| ----- | -------------------------------- | ------------------------------------------------------------ | ---------------------------------------- |
| **1** | Foundation & Infrastructure      | Project setup, DB schema, auth config, deployment pipeline   | Infrastructure for all FRs               |
| **2** | User Authentication & Onboarding | Users can register, log in, and complete segmentation        | FR1, FR2                                 |
| **3** | Core Naming Experience           | Users generate names and see real-time Traffic Light risk    | FR4, FR5, FR6, FR7, FR8, FR9, FR14, FR15 |
| **4** | Monetization & Conversion        | Purchase reports, affiliates, legal referrals, order history | FR3, FR10, FR11, FR12, FR13              |

---

## Functional Requirements Inventory

| FR ID | Functional Requirement                                                                      |
| ----- | ------------------------------------------------------------------------------------------- |
| FR1   | Users can create accounts to save their progress and generated names                        |
| FR2   | Users can log in via email or social providers                                              |
| FR3   | Users can view their order history (De-Risking Reports)                                     |
| FR4   | Users can input business criteria (industry, description, tone) via a chat interface        |
| FR5   | System generates "Elevated Creative" names based on user input using LLM                    |
| FR6   | Users can refine generation parameters (e.g., "more abstract", "shorter")                   |
| FR7   | System performs preliminary IP checks on generated names against trademark databases        |
| FR8   | System displays a "Traffic Light" risk indicator (Green/Amber/Red) for each name            |
| FR9   | Users can view a summary of the risk factors for a selected name                            |
| FR10  | Users can purchase a "De-Risking Report" for "Amber" or "Green" names                       |
| FR11  | System generates and delivers a PDF De-Risking Report upon purchase                         |
| FR12  | System presents "Launch Readiness Checklist" with affiliate hosting links for "Green" names |
| FR13  | System presents a "Legal Referral" CTA link for "Red" names                                 |
| FR14  | Users can save favorite names to a list                                                     |
| FR15  | System stores generated names and risk statuses associated with the user account            |

---

## FR Coverage Map

| Epic   | FRs Covered                              | Coverage Notes                                                                           |
| ------ | ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| Epic 1 | —                                        | Enables all FRs (DB schema, Supabase auth config, API structure, deployment)             |
| Epic 2 | FR1, FR2                                 | Account creation, email/social login, segmentation prompt                                |
| Epic 3 | FR4, FR5, FR6, FR7, FR8, FR9, FR14, FR15 | Chat interface, LLM generation, refinement, IP checks, Traffic Light, favorites, storage |
| Epic 4 | FR3, FR10, FR11, FR12, FR13              | Order history, Polar.sh payment, React-PDF reports, affiliate links, legal referral CTA  |

---

## Epic 1: Foundation & Infrastructure

**Goal:** Establish the complete technical foundation—project structure, database schema, authentication configuration, styling system, and deployment pipeline—enabling all subsequent epics to deliver user-facing features.

**User Value:** While this epic doesn't deliver direct user features, it creates the infrastructure that makes all user-facing functionality possible. Without this foundation, no user can register, generate names, or purchase reports.

**FRs Enabled:** Infrastructure for ALL FRs (FR1-FR15)

---

### Story 1.3: Database Schema Design & Migration Setup

**As a** developer,
**I want** the complete Drizzle ORM schema defined with migrations ready,
**So that** all data models are type-safe and database changes are version-controlled.

**Acceptance Criteria:**

**Given** Drizzle ORM is installed (Already done)
**When** the schema is defined
**Then** `server/lib/db/schema/` contains:

- `auth.ts` - User profiles extension (linked to `auth.users`) (Already done)
- `public.ts` - All application tables:
  - `user_profiles` (id, user_id FK, segment: 'lean'|'high-stakes', created_at, updated_at)
  - `naming_sessions` (id, user_id FK, criteria JSONB, created_at)
  - `generated_names` (id, session_id FK, name, rationale, domain_status JSONB, created_at)
  - `risk_checks` (id, name_id FK, status: 'green'|'amber'|'red', factors JSONB, checked_at)
  - `favorites` (id, user_id FK, name_id FK, created_at)
  - `orders` (id, user_id FK, name_id FK, product_type, polar_order_id, status, amount_cents, created_at)
  - `reports` (id, order_id FK, pdf_url, generated_at)

**And** `drizzle.config.ts` is configured with:

- Schema path: `./server/lib/db/schema/*` (Already done)
- Output directory: `./drizzle` (Already done)
- Database driver: `pg` with `DATABASE_URL` (Already done)

**And** `npm run db:generate` creates migration files
**And** `npm run db:push` applies schema to Supabase database
**And** all tables use `snake_case` per Architecture ADR

**Prerequisites:** Story 1.2

**Technical Notes:**

- Use `pgTable` from `drizzle-orm/pg-core` (Drizzle ORM v0.44.7)
- Define proper foreign key relationships with `references()`
- Add indexes on frequently queried columns (user_id, session_id)
- Use `timestamp` with `defaultNow()` for created_at fields
- All tables must have RLS policies (see Architecture Security section)
- Per ADR-001: Drizzle chosen over Prisma for stricter type safety

---

### Story 1.5: Application Shell & Layout Structure

**As a** user,
**I want** a consistent application layout with proper navigation structure,
**So that** I can navigate the app intuitively across all pages.

**Acceptance Criteria:**

**Given** shadcn/ui is installed
**When** the layout is implemented
**Then** `app/layout.tsx` includes:

- `<html>` with proper lang attribute
- Global providers wrapper (Theme, Auth, Toast)
- Metadata with SEO defaults

**And** the "Studio" layout pattern is established:

- Desktop (>1024px): 30% Chat / 70% Canvas split
- Tablet (768-1024px): 35% / 65% split
- Mobile (<768px): Responsive top header with view toggle (Chat/Canvas segmented control)

**And** `app/auth/layout.tsx` exists for unauthenticated routes
**And** `app/studio/layout.tsx` exists for studio routes
**And** `app/reports/layout.tsx` exists for reports routes
**And** `app/orders/layout.tsx` exists for orders routes
**And** loading states use Skeleton components

**Prerequisites:** Story 1.2

**Technical Notes:**

- Use CSS Grid for split layout: `grid-cols-[30%_70%]`
- Implement responsive breakpoints with Tailwind: `md:grid-cols-[35%_65%]`
- Header uses `fixed top-0` positioning on mobile with view toggle segmented control
- Layout components go in `components/shared/`

---

### Story 1.6: Zustand State Management Setup

**As a** developer,
**I want** Zustand stores configured for client-side state,
**So that** session context persists across components without prop drilling.

**Acceptance Criteria:**

**Given** Zustand is installed
**When** the stores are configured
**Then** `components/lib/stores/` contains:

- `session-store.ts` - Store factory and types:
  - `createSessionStore()` factory function
  - `SessionState`: `userType`, `currentSessionId`
  - `SessionActions`: `setUserType()`, `setSessionId()`, `reset()`
- `naming-store.ts` - Store factory and types:
  - `createNamingStore()` factory function
  - `NamingState`: `criteria`, `generatedNames`, `selectedName`
  - `NamingActions`: `setCriteria()`, `addNames()`, `clearNames()`, `selectName()`, `reset()`

**And** `components/providers/` contains Context providers:

- `session-store-provider.tsx` - Provides `useSessionStore` hook
- `naming-store-provider.tsx` - Provides `useNamingStore` hook
- `store-provider.tsx` - Combined provider for root layout

**And** stores use SSR-safe patterns:

- Factory pattern with `createStore` from `zustand/vanilla`
- `skipHydration: true` in persist options
- Manual `rehydrate()` in provider `useEffect`
- `devtools` middleware enabled in development
- `version` field for migration support

**And** stores use the `persist` middleware for localStorage backup
**And** stores are properly typed with TypeScript

**Prerequisites:** None (scaffold complete)

**Technical Notes:**

- Use `createStore` from `zustand/vanilla` for SSR-safe factory pattern
- Wrap stores in React Context providers per Next.js App Router best practices
- Use `useState` lazy initializer (not `useRef`) for React 19 compatibility
- Implement `persist` middleware with `skipHydration: true` and manual rehydration
- Add `version` field to persist config for future schema migrations
- Enable `devtools` middleware in development for Redux DevTools integration
- Stores support the "Trojan Horse" segmentation pattern (see Architecture Pattern 1)
- Session restoration on auth refresh reads from `user_profiles.segment`

---

### Story 1.7: API Structure & Server Actions Foundation

**As a** developer,
**I want** server actions organized by domain with consistent patterns,
**So that** business logic is centralized and type-safe.

**Acceptance Criteria:**

**Given** the project structure exists
**When** server actions are implemented
**Then** `server/actions/` contains domain files:

- `naming.ts` - Name generation actions (placeholder)
- `orders.ts` - Order management actions (placeholder)

**And** each action follows the response pattern:

```typescript
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
```

**And** `server/services/` contains business logic:

- `trademark.ts` - Signa.so API integration with LRU cache (5-min TTL)
- `risk-engine.ts` - Risk calculation logic from Signa.so responses
- `report-generator.ts` - React-PDF v4.3.x generation

**And** all actions validate input using Zod schemas (v4.1.13)
**And** all actions check authentication before processing
**And** all actions log via Pino (v10.1.0) with structured logging pattern

**Prerequisites:** Story 1.2, Story 1.3

**Technical Notes:**

- Use `'use server'` directive at file top
- Import `createClient` from server Supabase client
- Wrap all DB operations in try/catch with proper error responses
- Log errors using pino logger with: `{ action, userId, duration }` pattern
- Per ADR-003: Server Actions are ONLY approved API pattern (no REST/tRPC/GraphQL)

---

### Story 1.8: CI Pipeline & Quality Checks

**As a** developer,
**I want** a robust CI pipeline that verifies code quality and build integrity,
**So that** broken code is never merged to main, ensuring stable deployments via Coolify.

**Acceptance Criteria:**

**Given** the project is in a Git repository
**When** the CI pipeline is configured
**Then** GitHub Actions workflow `.github/workflows/ci.yml` includes:

- Trigger on push to main and pull requests
- Node.js 20.x setup with caching
- Install dependencies: `npm ci`
- Type check: `npm run type-check`
- Lint: `npm run lint`
- Unit tests: `npm run test`
- Build verification: `npm run build`
- E2E tests job (after unit tests pass): `npm run test:e2e`

**And** Docker build verification:
- CI job to verify `docker build .` succeeds (ensures Coolify deployment will succeed)

**And** environment variables are documented in `README.md`:

| Variable                        | Required | Description                        |
| ------------------------------- | -------- | ---------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Yes      | Supabase project URL               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes      | Supabase anonymous key             |
| `SUPABASE_SERVICE_ROLE_KEY`     | Yes      | Supabase service key (server only) |
| `DATABASE_URL`                  | Yes      | Postgres connection string         |
| `SENTRY_DSN`                    | Yes      | Sentry project DSN                 |
| `SENTRY_AUTH_TOKEN`             | Yes      | Sentry release upload token        |
| `GOOGLE_GENERATIVE_AI_API_KEY`  | Yes      | Gemini API key                     |
| `SIGNA_API_KEY`                 | Yes      | Signa.so API key                   |
| `POLAR_ACCESS_TOKEN`            | Yes      | Polar.sh API token                 |
| `POLAR_WEBHOOK_SECRET`          | Yes      | Polar webhook signature secret     |
| `POLAR_ORGANIZATION_ID`         | Yes      | Polar organization ID              |

**Prerequisites:** None (scaffold complete)

**Technical Notes:**

- Use `actions/setup-node@v4` with cache enabled
- Add `type-check` script: `tsc --noEmit`
- Configure branch protection requiring CI pass
- Deployment is handled separately by Coolify (listening to GitHub webhooks)
- Background jobs handled by Supabase Cron (see Story 1.10)

---

### Story 1.9: Testing Infrastructure Setup

**As a** developer,
**I want** Vitest and Playwright configured for unit and E2E testing,
**So that** code quality can be verified automatically.

**Acceptance Criteria:**

**Given** the project structure exists
**When** testing infrastructure is configured
**Then** Vitest is configured with:

- `vitest.config.ts` with Next.js integration
- Test file pattern: `tests/**/*.test.ts`
- Coverage reporting enabled
- jsdom environment for component tests

**And** Playwright is configured with:

- `playwright.config.ts` with multiple browsers
- Base URL pointing to dev server
- Screenshot on failure enabled
- E2E tests in `tests/e2e/`

**And** npm scripts exist:

- `npm run test` - Run unit tests
- `npm run test:watch` - Watch mode
- `npm run test:e2e` - Run Playwright tests
- `npm run test:coverage` - Coverage report

**And** minimum coverage requirements (per Architecture):

| Layer              | Target         | Rationale                          |
| ------------------ | -------------- | ---------------------------------- |
| **Services**       | 80%            | Business logic must be well-tested |
| **Server Actions** | 70%            | Input validation and auth flows    |
| **Components**     | 50%            | Interactive components only        |
| **E2E**            | Critical paths | Auth, naming, checkout flows       |

**And** a sample test exists verifying the setup works
**And** test organization mirrors source structure:

- `tests/unit/` - Vitest unit tests (services, stores)
- `tests/integration/` - Server Actions with mocked DB
- `tests/e2e/` - Playwright critical user flows

**Prerequisites:** None (scaffold complete)

**Technical Notes:**

- Use `@vitejs/plugin-react` for React component testing
- Configure `webServer` in Playwright to auto-start dev server
- Add `tests/` to `.gitignore` for coverage output
- Create `tests/setup.ts` for global test configuration
- Vitest v3.2.x with jsdom environment
- Playwright v1.52.x with Chromium, Firefox, WebKit

---

### Story 1.10: Background Job Infrastructure (Supabase Cron)

**As a** developer,
**I want** scheduled background jobs using Supabase pg_cron,
**So that** long-running tasks like PDF generation and session cleanup run reliably.

**Acceptance Criteria:**

**Given** the database is configured
**When** background job infrastructure is set up
**Then** the following extensions are enabled:

- `pg_cron` - PostgreSQL job scheduler
- `pg_net` - Asynchronous HTTP requests from Postgres

**And** Vault secrets are configured for secure API calls:

```sql
-- Store project URL and service role key in Vault
SELECT vault.create_secret(
  'https://[project-ref].supabase.co',
  'project_url'
);
SELECT vault.create_secret(
  '[service-role-key]',
  'service_role_key'
);
```

**And** the following cron jobs are scheduled:

| Job Name              | Schedule      | Description                              |
| --------------------- | ------------- | ---------------------------------------- |
| `session-cleanup`     | `0 0 * * *`   | Daily cleanup of expired naming sessions |
| `pdf-queue-processor` | `*/5 * * * *` | Every 5 min: process pending PDF reports |

**And** cron jobs invoke Edge Functions via `pg_net`:

```sql
-- Example: Session cleanup job
SELECT cron.schedule(
  'session-cleanup',
  '0 0 * * *',
  $$
  SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/cleanup-sessions',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
```

**And** Edge Functions exist for background processing:

- `supabase/functions/cleanup-sessions/index.ts` - Delete sessions older than 30 days
- `supabase/functions/process-pdf-queue/index.ts` - Generate pending PDF reports

**And** job monitoring is available:

- Jobs visible in `cron.job` table
- Run history in `cron.job_run_details`
- Failed jobs logged to Sentry via Edge Function error handling

**And** documentation includes:

- How to add/modify cron jobs via migrations
- How to test Edge Functions locally
- Monitoring and debugging job failures

**Prerequisites:** Story 1.2, Story 1.3

**Technical Notes:**

- Enable extensions via Supabase Dashboard or migration
- Use `cron.unschedule('job-name')` to remove jobs
- Edge Functions deployed via `supabase functions deploy`
- Max 8 concurrent cron jobs recommended
- Jobs timeout after 10 minutes (Supabase limit)
- Per ADR: Supabase Cron (pg_cron + pg_net) chosen over Vercel Cron for tighter integration

---

**Epic 1 Complete!**

This epic establishes all foundational infrastructure. Upon completion:

- ✅ Next.js 15.1.0 + TypeScript configured _(completed in scaffold)_
- ✅ Supabase auth (v2.49.1) + database integrated
- ✅ Drizzle ORM (v0.44.7) schema with all tables
- ✅ shadcn/ui with "Hybrid" theme _(completed in scaffold)_
- ✅ Studio layout pattern implemented
- ✅ Zustand (v5.0.9) state management ready
- ✅ Server actions structure with ActionResponse pattern
- ✅ CI/CD pipeline active with E2E tests
- ✅ Testing infrastructure (Vitest + Playwright) ready
- ✅ Pino (v10.1.0) + Sentry (v10.28.0) observability configured
- ✅ Supabase Cron (pg_cron + pg_net) background job infrastructure

**Ready for:** Epic 2 - User Authentication & Onboarding

---

## Epic 2: User Authentication & Onboarding

**Goal:** Enable users to create accounts, log in securely via email or social providers, and complete the "Trojan Horse" segmentation that personalizes their entire experience.

**User Value:** After this epic, users can register, log in, and the system knows whether they're a "Lean Entrepreneur" (speed-focused) or "High-Stakes Founder" (safety-focused), tailoring all subsequent interactions.

**FRs Covered:** FR1, FR2

---

### Story 2.1: Email/Password Registration Flow

**As a** new user,
**I want** to create an account using my email and password,
**So that** I can save my generated names and purchase reports.

**Acceptance Criteria:**

**Given** I am on the registration page (`/register`)
**When** I enter my details
**Then** the form includes:

- **Progress indicator**: "Step 1 of 3: Create Account" (builds trust, reduces abandonment)
- Email field with RFC 5322 validation
- Password field with visibility toggle (eye icon)
- Password requirements displayed: 8+ chars, 1 uppercase, 1 number, 1 special
- **Security context tooltip** (ℹ️): "Strong passwords protect your valuable brand ideas from unauthorized access"
- Password strength meter (weak/medium/strong) with visual bar
- "Create Account" primary button
- **OR divider** with "Continue with Magic Link" option (passwordless - sends login link to email)

**And** when I submit valid credentials:

- Loading spinner overlay appears on button
- Account is created in Supabase Auth
- Verification email is sent within 15 seconds
- I see success message: "Check your email to verify your account"
- I am redirected to `/verify-email` holding page

**And** validation errors appear inline below fields (red text)
**And** the form is accessible: proper labels, ARIA attributes, keyboard navigation
**And** mobile: form is full-width with 44x44px touch targets

**Prerequisites:** Story 1.2

**Technical Notes:**

- Use `server/actions/auth.ts` → `signUp()` action
- Validate with Zod schema (v4.1.13) before Supabase call
- Store initial `user_profiles` row with `segment: null`
- Use Supabase email templates for verification
- Form built with shadcn/ui Form + react-hook-form
- **Magic link uses `supabase.auth.signInWithOtp({ email })`** - passwordless flow ideal for "Lean Entrepreneur" users who prioritize speed
- Supabase Auth via `@supabase/ssr` (v0.7.0) for SSR cookie handling

---

### Story 2.2: Email Verification Handling

**As a** user who just registered,
**I want** to verify my email by clicking a link,
**So that** my account is activated and I can start using the app.

**Acceptance Criteria:**

**Given** I received a verification email
**When** I click the verification link
**Then** Supabase processes the token automatically
**And** I am redirected to `/onboarding` (segmentation flow)
**And** my `email_confirmed_at` is set in Supabase Auth

**Given** the verification link has expired (>24 hours)
**When** I click it
**Then** I see an error message: "Link expired. Request a new one."
**And** a "Resend verification" button is visible
**And** clicking it sends a new email and shows confirmation toast

**And** the `/verify-email` page shows:

- Animated email icon (subtle pulse)
- Clear instructions to check inbox/spam
- "Resend email" link (rate limited to 1 per 60 seconds)
- "Use different email" link returning to `/register`

**Prerequisites:** Story 2.1

**Technical Notes:**

- Verification handled by Supabase redirect flow
- Configure `NEXT_PUBLIC_SITE_URL` for correct redirect
- Use `supabase.auth.onAuthStateChange()` to detect verification
- Add `email_verified` check before allowing dashboard access

---

### Story 2.3: Social Authentication (Google & GitHub)

**As a** user,
**I want** to sign in with my Google or GitHub account,
**So that** I can access the app without creating a new password.

**Acceptance Criteria:**

**Given** I am on the login or register page
**When** I click "Continue with Google"
**Then** I am redirected to Google OAuth consent screen
**And** after approval, I return to the app authenticated
**And** if this is my first login, a `user_profiles` row is created
**And** I am redirected to `/onboarding` (if new) or `/app` (if returning)

**And** the same flow works for "Continue with GitHub"

**And** social buttons are styled consistently:

- Full width on mobile, side-by-side on desktop
- Provider logos (Google 'G', GitHub octocat) at 20x20px

**And** if OAuth fails (user cancels or error):

- I see inline error: "Authentication cancelled" or "Something went wrong"
- I can retry immediately

**Prerequisites:** Story 2.1

**Technical Notes:**

- Configure OAuth providers in Supabase Dashboard
- Use `supabase.auth.signInWithOAuth({ provider: 'google' })`
- Set redirect URL to `/auth/callback` route handler
- Create `/app/auth/callback/route.ts` to exchange code for session
- Check `user_profiles` exists on callback, create if missing

---

### Story 2.4: Login Flow with Session Management

**As a** returning user,
**I want** to log in to my account,
**So that** I can access my saved names and order history.

**Acceptance Criteria:**

**Given** I am on the login page (`/login`)
**When** I enter valid credentials
**Then** the form includes:

- Email field
- Password field with visibility toggle
- "Remember me" checkbox (extends session to 30 days)
- "Forgot password?" link
- "Log in" primary button

**And** on successful login:

- Loading state shows on button
- Session is established (JWT + refresh token)
- I am redirected to `/app`
- Toast appears: "Welcome back, [name]!"

**And** on failed login:

- Inline error: "Invalid email or password"

**And** the page includes:

- Link to `/register` for new users
- Social login buttons (Google, GitHub)
- Divider: "or continue with email"

**Prerequisites:** Story 2.1, Story 2.3

**Technical Notes:**

- Use `server/actions/auth.ts` → `signIn()` action
- "Remember me" sets `persistSession: true` in Supabase options
- Log failed attempts to `security_events` or rate limit via middleware
- Session refresh handled by middleware on each request

---

### Story 2.5: Password Reset Flow

**As a** user who forgot my password,
**I want** to reset it via email,
**So that** I can regain access to my account.

**Acceptance Criteria:**

**Given** I click "Forgot password?" on the login page
**When** I am on `/forgot-password`
**Then** the form asks for my email only
**And** on submit:

- If email exists: "Password reset link sent!"
- If email doesn't exist: Same message (security - no enumeration)
- Email arrives within 30 seconds

**Given** I click the reset link in my email
**When** I am on `/reset-password`
**Then** the form shows:

- New password field with strength meter
- Confirm password field
- "Reset Password" button

**And** on successful reset:

- Password is updated
- All other sessions are invalidated
- I am redirected to `/login` with success toast
- I can log in with new password

**And** if reset link expired (>1 hour):

- Error message with "Request new link" button

**Prerequisites:** Story 2.4

**Technical Notes:**

- Use `supabase.auth.resetPasswordForEmail()`
- Reset page uses `supabase.auth.updateUser({ password })`
- Validate password matches requirements before submit
- Token validated by Supabase automatically

---

### Story 2.6: Segmentation Prompt (The "Trojan Horse")

**As a** new user,
**I want** to indicate my primary goal (speed vs. safety),
**So that** the app tailors its experience to my needs.

**Acceptance Criteria:**

**Given** I am a new user who just verified my email or signed up via social
**When** I land on `/onboarding`
**Then** I see the Segmentation Prompt:

- **Progress indicator**: "Step 3 of 3: Personalize Your Experience"
- Headline: "How can we help you today?"
- **Reassurance text**: "You can change this anytime in Settings"
- Two large, visually distinct cards:

**Card A - "I need a name fast"**

- Icon: Lightning bolt (⚡)
- Subtext: "Get creative names quickly and check availability"
- Border: Electric Teal accent on hover
- Visual: Speed-focused imagery

**Card B - "I need a defensible brand"**

- Icon: Shield (🛡️)
- Subtext: "Deep analysis for trademark safety and legal clarity"
- Border: Indigo accent on hover
- Visual: Security-focused imagery

**And** when I click a card:

- Card shows selected state (border highlight + checkmark)
- "Continue" button enables
- My choice is stored: `user_profiles.segment = 'lean' | 'high-stakes'`
- Zustand `sessionStore.userType` is updated
- I am redirected to first-run experience (Story 2.9)

**And** the page cannot be skipped - segment is required (but reassurance reduces hesitation)
**And** layout is centered, single-column, no distractions
**And** mobile: cards stack vertically with full width

**Prerequisites:** Story 2.1, Story 1.6

**Technical Notes:**

- Create `server/actions/auth.ts` → `setUserSegment()` action
- Update `user_profiles` table with segment choice
- Use Zustand persist to remember across sessions
- This choice affects Narrative Architect system prompt in Epic 3
- Consider animated transitions (Aceternity spotlight effect on cards)

---

### Story 2.7: Protected Route Middleware

**As a** developer,
**I want** routes properly protected based on auth state,
**So that** unauthenticated users cannot access protected features.

**Acceptance Criteria:**

**Given** the middleware is configured
**When** a user accesses different routes
**Then** the following rules apply:

| Route Pattern         | Auth Required | Segment Required | Behavior                                                      |
| --------------------- | ------------- | ---------------- | ------------------------------------------------------------- |
| `/`                   | No            | No               | Public landing page                                           |
| `/login`, `/register` | No            | No               | Redirect to `/app` if authenticated                           |
| `/onboarding`         | Yes           | No               | Redirect to `/app` if segment set                             |
| `/app/**`             | Yes           | Yes              | Redirect to `/login` if not auth, `/onboarding` if no segment |
| `/api/webhooks/**`    | No            | No               | Public (webhook endpoints)                                    |

**And** unauthorized access shows appropriate message/redirect
**And** redirect preserves original destination (`?redirect=/intended-page`)
**And** middleware runs on edge for fast response

**Prerequisites:** Story 2.6, Story 1.2

**Technical Notes:**

- Implement in `middleware.ts` at project root
- Use `@supabase/ssr` (v0.7.0) to read session from cookies
- Check `user_profiles.segment` via server action or cached in JWT claims
- Consider adding segment to JWT custom claims for faster middleware checks
- Matcher config: exclude static files, images, favicon
- Middleware uses `createServerClient` pattern from Architecture Security section

---

### Story 2.8: User Profile Display & Sign Out

**As a** logged-in user,
**I want** to see my profile information and sign out,
**So that** I can manage my session securely.

**Acceptance Criteria:**

**Given** I am authenticated and on any dashboard page
**When** I click my profile avatar/button in the header
**Then** a dropdown menu appears with:

- My email address (truncated if long)
- My segment badge ("Speed" or "Certainty")
- "Order History" link (→ `/app/orders`)
- "Settings" link (→ `/app/settings`) [placeholder]
- Divider
- "Sign Out" button (destructive style)

**And** when I click "Sign Out":

- Confirmation dialog appears: "Are you sure you want to sign out?"
- On confirm: session is destroyed, Zustand stores reset
- I am redirected to `/login`
- Toast: "You've been signed out"

**And** on mobile: profile is in header menu, opens full-screen menu
**And** avatar shows user initial if no profile picture

**Prerequisites:** Story 2.4, Story 2.6

**Technical Notes:**

- Use shadcn/ui `DropdownMenu` component
- Sign out via `server/actions/auth.ts` → `signOut()`
- Clear all Zustand stores on sign out: `sessionStore.reset()`, `namingStore.reset()`
- Avatar uses `@supabase/auth-helpers` to get user metadata

---

### Story 2.9: First-Run Experience (Segment-Aware Welcome)

**As a** newly registered user,
**I want** a guided welcome that matches my selected path,
**So that** I immediately understand how to use the app and feel confident starting.

**Acceptance Criteria:**

**Given** I just completed segmentation (Story 2.6)
**When** I land on the dashboard for the first time
**Then** I see a segment-specific welcome overlay:

**Lean Entrepreneur Path:**

- Headline: "Let's find your name in 60 seconds! ⚡"
- Single prominent CTA: "Start Naming" → opens Narrative Architect chat
- Skip link: "Explore on my own" → dismisses overlay
- Visual: Minimal, action-focused

**High-Stakes Founder Path:**

- Headline: "Let's build your brand foundation 🛡️"
- Guided prompt: "Start with your vision" → opens structured questionnaire
- Secondary option: "Jump to naming" → opens chat with safety-first system prompt
- Visual: More structured, emphasizes thoroughness

**And** the welcome overlay:

- Appears only on first dashboard visit (tracked in `user_profiles.first_run_completed`)
- Can be dismissed and never shown again
- Animates in smoothly (fade + slide up)
- Mobile: Full-screen takeover with clear touch targets

**And** after dismissal:

- User lands on dashboard with segment-appropriate default view
- Lean: Chat panel open, ready to type
- High-Stakes: Overview panel with "Start Your Brand Journey" card

**Prerequisites:** Story 2.6, Story 1.5

**Technical Notes:**

- Track `first_run_completed: boolean` in `user_profiles` table
- Use Zustand to manage overlay visibility client-side
- Overlay component: `components/features/onboarding/first-run-modal.tsx`
- Consider Aceternity UI spotlight effect for welcome emphasis
- This bridges onboarding → core naming experience (Epic 3)

---

**Epic 2 Complete!**

This epic delivers complete authentication and user segmentation. Upon completion:

- ✅ Users can register via email, magic link, or social (Google/GitHub)
- ✅ Email verification flow works
- ✅ Login with "Remember me" and session management
- ✅ Password reset flow complete
- ✅ "Trojan Horse" segmentation captures user type with reassurance
- ✅ Routes properly protected by middleware
- ✅ Profile menu with sign out
- ✅ Segment-aware first-run experience bridges to Epic 3

**FRs Delivered:** FR1 ✅, FR2 ✅

**Ready for:** Epic 3 - Core Naming Experience

---

## Epic 3: Core Naming Experience

**Goal:** Deliver the complete "Narrative Architect" chat-based naming experience with real-time "Traffic Light" risk assessment, enabling users to generate, refine, and save creative names while understanding their legal safety.

**User Value:** After this epic, users can have a conversation with the AI to generate names, instantly see which names are safe (Green), risky (Amber), or dangerous (Red), refine results, and save favorites—the core product experience.

**FRs Covered:** FR4, FR5, FR6, FR7, FR8, FR9, FR14, FR15

---

### Story 3.1: Narrative Architect Chat Interface

**As a** user,
**I want** to interact with an AI assistant through a chat interface,
**So that** I can describe my business and receive personalized name suggestions.

**Acceptance Criteria:**

**Given** I am on the dashboard with the "Studio" layout
**When** I view the chat panel (left side on desktop, Chat tab on mobile)
**Then** I see the Narrative Architect interface:

- Chat header: "Narrative Architect" with AI avatar icon
- Message history area (scrollable, auto-scroll to bottom on new messages)
- Input area at bottom with:
  - Text input field (multiline, auto-expand up to 4 lines)
  - Send button (Indigo, disabled when empty)
  - Voice input button (optional, future enhancement)

**And** the AI greeting is segment-specific:

- **Lean Entrepreneur**: "Hey! 👋 Let's find your perfect name. What's your business about?"
- **High-Stakes Founder**: "Welcome! I'm here to help you discover a defensible brand name. Let's start with your vision—tell me about your business and what makes it unique."

**And** the chat supports:

- Markdown rendering in AI responses (bold, lists, links)
- Streaming text (typewriter effect) for AI responses
- Loading indicator: "Thinking..." with animated dots
- Error state: "Something went wrong. Try again." with retry button

**And** keyboard shortcuts work:

- Enter: Send message (Shift+Enter for newline)
- Escape: Clear input

**And** AI personality is:

- **Curious**: Asks follow-up questions, shows genuine interest in the business
- **Encouraging**: Celebrates good ideas, builds confidence
- **Occasionally witty**: Light humor where appropriate, not corporate/robotic
- **Never condescending**: Treats all business ideas with respect

**Prerequisites:** Story 1.5, Story 1.6, Story 2.9

**Technical Notes:**

- Component: `components/features/naming/chat-interface.tsx`
- Use Vercel AI SDK (v5.0.102) `useChat()` hook for streaming
- Connect to `server/actions/naming.ts` → `generateResponse()`
- System prompt varies by `sessionStore.userType`
- Store conversation in `naming_sessions.criteria` as JSONB
- Use `@ai-sdk/google` (v2.0.43) with `google('gemini-2.5-flash')` model per Architecture
- **AI personality guidelines embedded in system prompt**
- Streaming uses `createStreamableValue` pattern from Architecture Pattern 3

---

### Story 3.2: Criteria Collection via Conversation

**As a** user,
**I want** the AI to naturally collect my business criteria through conversation,
**So that** it generates relevant names without filling out boring forms.

**Acceptance Criteria:**

**Given** I'm in the chat with Narrative Architect
**When** I describe my business
**Then** the AI extracts and confirms criteria:

- **Industry/Domain**: "So you're in the health tech space..."
- **Business Description**: Summarizes what user said
- **Tone/Vibe**: Asks clarifying questions: "Should the name feel playful or professional?"
- **Target Audience**: "Who are your main customers?"

**And** the AI uses "Smart Chips" for quick responses:

- Clickable suggestion pills appear below AI messages
- Examples: "Professional", "Playful", "Minimalist", "Bold"
- Clicking a chip sends it as user response
- Chips styled: `bg-slate-100 hover:bg-slate-200 rounded-full px-3 py-1`

**And** after 2-3 exchanges, AI confirms criteria:

- "Perfect! Here's what I understand: [summary]. Ready to generate names?"
- User can say "yes" or correct details
- Confirmation triggers name generation (Story 3.3)

**And** engagement target: **Average 4+ messages before first name generation**

**And** if user gives minimal input (one-word answers):

- AI offers multiple-choice options: "Is this more B2B enterprise or consumer-friendly? [Enterprise] [Consumer] [Both]"
- Smart Chips become larger and more prominent
- AI gently probes: "Tell me more! What problem does your business solve?"

**And** criteria is stored:

```typescript
{
  industry: string,
  description: string,
  tone: string[],
  audience: string,
  constraints: string[] // e.g., "must be short", "no acronyms"
}
```

**Prerequisites:** Story 3.1

**Technical Notes:**

- Criteria stored in Zustand `namingStore.criteria`
- Sync to DB: `naming_sessions` table with `criteria` JSONB column
- AI uses function calling to extract structured data from conversation
- System prompt includes criteria extraction instructions
- Smart chips generated dynamically based on conversation context

---

### Story 3.3: AI Name Generation (Elevated Creative)

**As a** user,
**I want** the system to generate creative, memorable names based on my criteria,
**So that** I have high-quality options to choose from.

**Acceptance Criteria:**

**Given** criteria has been confirmed via chat
**When** the AI generates names
**Then** it produces 10-15 names initially:

- Names follow "Elevated Creative" philosophy (not basic keyword mashers)
- Includes: invented words, metaphors, abstract concepts, compound words
- Each name has a 1-sentence rationale explaining the creative thinking
- Generation takes < 5 seconds (with loading state)

**Quality Benchmarks (enforced in system prompt):**

- ❌ NO generic names: "InnovateTech", "SynergyHub", "NextGen Solutions"
- ✅ YES creative names: "Luminary", "Kindred", "Zephyr", "Mosaic", "Helix"
- Names must feel ownable, memorable, and distinct
- System prompt includes 5 examples of "great names" and 5 "terrible names" to guide AI

**And** names appear in the Canvas (right panel):

- Displayed as Name Cards in a responsive grid (3-4 columns desktop, 2 mobile)
- Each card shows: Name (large), Rationale (smaller), Traffic Light badge (corner)
- Cards animate in with stagger effect (50ms delay between cards)

**And** the AI explains its approach in chat:

- "Here are some names inspired by your vision of [key theme]. I focused on [approach]."
- Suggests browsing the Canvas to see results

**And** names are persisted:

- Stored in `generated_names` table linked to `naming_sessions`
- Include: `name`, `rationale`, `created_at`

**Prerequisites:** Story 3.2

**Technical Notes:**

- Use Gemini via AI SDK: `google('gemini-2.5-flash')` for fast generation
- System prompt includes style guidelines for "Elevated Creative"
- **System prompt includes industry-specific name examples** when industry is known (e.g., Tech names differ from Fashion names)
- Segment influences style: Lean → catchier/shorter, High-Stakes → more substantial
- Server action: `server/actions/naming.ts` → `generateNames()`
- Batch insert to `generated_names` table via Drizzle (v0.44.7)
- Return names with IDs for subsequent risk checking
- Max tokens: 2000 per Architecture AI SDK configuration

---

### Story 3.4: Name Refinement via Chat

**As a** user,
**I want** to refine the generated names by giving feedback,
**So that** I can get closer to my ideal name.

**Acceptance Criteria:**

**Given** names have been generated and displayed
**When** I continue chatting
**Then** the AI understands refinement requests:

- "Make them shorter" → Regenerates with brevity constraint
- "More abstract" → Focuses on invented/conceptual names
- "I like NovusArc, give me more like that" → Uses that as anchor
- "Remove anything with 'tech' in it" → Filters and regenerates

**And** Smart Chips appear with common refinements:

- "Shorter", "Longer", "More playful", "More serious"
- "More abstract", "More descriptive", "Different direction"

**And** refined names:

- Append to existing Canvas (don't replace unless requested)
- New names marked with "New" badge briefly (fades after 5s)
- Maintain conversation history for context

**And** the AI tracks refinement context:

- "Based on your feedback, I'm focusing on [approach]..."
- Remembers what user liked/disliked from previous rounds

**Prerequisites:** Story 3.3

**Technical Notes:**

- Conversation history maintained in AI SDK context
- Store refinement metadata in session
- New names link to same `naming_sessions` but track iteration
- Max ~50 names per session before prompting to start fresh
- Refinement uses previous names as few-shot examples for style matching

---

### Story 3.5: Traffic Light Risk Badge Display

**As a** user,
**I want** to see an immediate risk indicator on each name,
**So that** I know which names are safe to pursue.

**Acceptance Criteria:**

**Given** names are displayed in the Canvas
**When** I view Name Cards
**Then** each card shows a Traffic Light badge:

**Green (Safe):**

- Badge: `bg-emerald-50 text-emerald-600 border-emerald-200`
- Dot: Subtle pulse animation
- Label: "Clear" or just green dot
- Meaning: No conflicts found

**Amber (Caution):**

- Badge: `bg-amber-50 text-amber-600 border-amber-200`
- Label: "Check" or amber dot
- Meaning: Potential conflicts exist

**Red (Risk):**

- Badge: `bg-red-50 text-red-600 border-red-200`
- Label: "Risk" or red dot
- Meaning: Direct conflicts found

**And** risk status is determined by Story 3.6 (IP checks)
**And** if check is pending:

- Show skeleton/loading state on badge
- Label: "Checking..."
  **And** badge position: Top-right corner of Name Card
  **And** on mobile: badges slightly larger for touch accessibility

**And** first-time users see Traffic Light explanation:

- Tooltip on first badge interaction: "🟢 Green = No trademark conflicts found. 🟡 Amber = Similar names exist, worth checking. 🔴 Red = Direct conflict, risky to use."
- "Got it" button dismisses, preference saved

**And** for Green results, build trust:

- Clicking Green shows: "✅ We checked [X] trademark databases and found no conflicts in your industry"
- Prevents user skepticism ("this seems too easy")

**Prerequisites:** Story 3.3

**Technical Notes:**

- Component: `components/features/naming/traffic-light-badge.tsx`
- Badge pulls status from `risk_checks` table via name relationship
- Status enum: 'pending' | 'green' | 'amber' | 'red'
- Use CSS animation for green pulse: `animate-pulse`
- Accessibility: `aria-label="Risk Level: Low/Medium/High"`

---

### Story 3.6: Preliminary IP Risk Checks

**As a** system,
**I want** to perform trademark checks on generated names,
**So that** users see accurate risk indicators.

**Acceptance Criteria:**

**Given** names are generated
**When** the system checks IP risk
**Then** for each name:

- Query trademark database (USPTO/Trademarkia API)
- Search for exact matches and similar names
- Check relevant trademark classes based on user's industry

**And** risk scoring determines status:

- **Green**: No matches found in relevant classes
- **Amber**: Similar names exist OR matches in adjacent classes
- **Red**: Exact or near-exact match in same/related class

**And** checks happen asynchronously:

- Names appear immediately with "Checking..." status
- **Pending names show warning tooltip**: "Risk check in progress - status may change"
- Status updates as checks complete (1-2 seconds per name)
- Batch processing: check multiple names in parallel (5 at a time)

**And** performance requirements (CRITICAL):

- **Maximum 5 seconds** for all names to show status
- **Progressive reveal**: Show completed checks immediately, don't wait for entire batch
- **Priority queue**: If user hovers or clicks a name, check that one FIRST
- If API slow: After 5s, show "Check Later" option with manual retry button

**And** results are cached:

- Same name + industry → cached result (24 hour TTL)
- Reduces API calls for common names

**And** rate limits are handled:

- Queue system prevents API throttling
- Graceful degradation: "Unable to check" status if API unavailable

**Prerequisites:** Story 3.3

**Technical Notes:**

- Service: `server/services/trademark.ts`
- Integration: **Signa.so API** (per ADR-005)
  - Base URL: `https://api.signa.so/v1`
  - Auth: Bearer token via `SIGNA_API_KEY`
  - Rate Limits: 100 requests/minute

**Signa.so Endpoints:**

| Endpoint              | Method | Purpose                                         | Credits | Latency   |
| --------------------- | ------ | ----------------------------------------------- | ------- | --------- |
| `/search`             | GET    | Text search across 147M+ trademarks             | 1       | 200-400ms |
| `/analysis/check`     | POST   | Quick conflict detection                        | 2       | 300-800ms |
| `/analysis/clearance` | POST   | AI-powered risk scoring (CLEAR/LOW/MEDIUM/HIGH) | 5       | 1-3s      |

**Risk Mapping:**

- Signa `CLEAR` → Green
- Signa `LOW`/`MEDIUM` → Amber
- Signa `HIGH` → Red

**Caching (per Architecture):**

```typescript
import { LRUCache } from "lru-cache";
const cache = new LRUCache<string, RiskResult>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
});
```

- Store results: `risk_checks` table with `factors` JSONB containing Signa response
- Risk engine: `server/services/risk-engine.ts` maps Signa score to Traffic Light
- Implement exponential backoff for rate limit handling

---

### Story 3.7: Risk Factor Summary Display

**As a** user,
**I want** to see why a name was flagged as Amber or Red,
**So that** I understand the specific risks.

**Acceptance Criteria:**

**Given** I click on a Name Card with Amber or Red status
**When** the Risk Summary modal opens
**Then** I see:

- Name displayed prominently at top
- Traffic Light badge (large)
- Signa.so `risk_score` displayed as percentage (e.g., "Risk Score: 72%")
- "Risk Factors" section with **plain-English explanations** (NO legal jargon):
  - ❌ NOT: "Class 42 registration #12345678"
  - ✅ YES: "A company called 'NovaTech' sells software in your industry"
  - Each conflict from Signa.so `conflicts[]` shows:
    - Conflicting mark text and owner
    - What they do (from `goods_services`)
    - Similarity indicator based on `risk_score`
  - Registration status in plain terms: "Active trademark" / "Application pending" / "Expired (less risky)"
  - Signa.so `conflict_reason` translated to user-friendly language

**And** for HIGH risk names, show Signa.so `alternatives_suggested[]`:

- "Consider these alternatives: [list from Signa API]"

**And** the modal includes:

- **For Amber**: "Get De-Risking Report" CTA (→ Epic 4)
- **For Red**: "This name has significant conflicts" warning + "Consult an Attorney" link (→ Epic 4)
- "Close" button or click outside to dismiss

**And** friction balance (CRITICAL):

- Modal shows **risk factors FIRST** (the value) - user should understand WHY before seeing upsell
- Upsell CTA appears AFTER user has seen the information
- User should never feel "tricked" or "baited"
- **Track modal close rate** - if >50% close without any action, reduce friction in next iteration

**And** for Green names:

- Clicking shows simpler modal: "✅ No conflicts found!"
- Show Signa.so `analysis_summary` for context
- "Save to Favorites" and "Check Domain" options

**And** modal behavior:

- Blurred backdrop (`backdrop-blur-sm`)
- Accessible: focus trap, Escape to close
- Mobile: slides up from bottom (sheet style)

**Prerequisites:** Story 3.5, Story 3.6

**Technical Notes:**

- Component: `components/features/naming/risk-reveal-modal.tsx`
- Fetch detailed factors from `risk_checks.factors` JSONB
- Display uses shadcn/ui Dialog or Sheet (mobile)
- This is the "Friction as a Feature" moment - don't make it too easy to dismiss
- Track modal opens for analytics (conversion funnel)

---

### Story 3.8: Save to Favorites

**As a** user,
**I want** to save names I like to a favorites list,
**So that** I can compare them later and not lose good options.

**Acceptance Criteria:**

**Given** I see a Name Card in the Canvas
**When** I click the heart/star icon
**Then** the name is added to my favorites:

- Icon fills in (empty → filled) with subtle scale animation
- Toast: "Saved to favorites"
- Name appears in "Saved" section/tab

**And** I can remove from favorites:

- Click filled heart → unfills
- Toast: "Removed from favorites"

**And** the Saved view shows:

- Grid of favorited Name Cards (same component, different context)
- Sorted by date saved (newest first)
- Filter by risk status (show only Green, etc.)
- Empty state: "No favorites yet. Start exploring!"

**And** favorites persist:

- Stored in `favorites` table (user_id, name_id, created_at)
- Available across sessions/devices

**And** on mobile:

- "Saved" is a bottom tab
- Heart icon is 44x44px touch target

**Prerequisites:** Story 3.3, Story 1.6

**Technical Notes:**

- Server action: `server/actions/naming.ts` → `toggleFavorite()`
- Optimistic UI: update immediately, rollback on error
- Query favorites with JOIN to get name details + risk status
- Maximum favorites per user: 100 (soft limit, show warning at 80)
- Favorites feed into "Order History" context in Epic 4

---

### Story 3.9: Domain Availability Quick Check

**As a** user,
**I want** to see if a domain is available for a name,
**So that** I know if I can actually use it online.

**Acceptance Criteria:**

**Given** I view a Name Card
**When** I look at the domain indicators
**Then** I see availability badges for common TLDs:

- `.com` - Primary, always shown
- `.io`, `.co`, `.ai` - Secondary, shown if relevant to industry
- Badge color: Green (available), Red (taken), Gray (unknown)

**And** domain check happens:

- Automatically after name generation (parallel to IP check)
- Results cached (1 hour TTL - availability changes frequently)
- Loading state: Gray with spinner

**And** clicking a domain badge:

- If available: Opens affiliate link to registrar (Namecheap, GoDaddy, etc.)
- If taken: Shows "Taken" tooltip, suggests alternatives (.io if .com taken)

**And** on the Name Card:

- Domain badges shown below name, before rationale
- Compact display: small pills in a row
- Hover/tap for full domain name

**Prerequisites:** Story 3.3

**Technical Notes:**

- Service: `server/services/domain-check.ts`
- API: WHOIS lookup or domain registrar API (GoDaddy, Namecheap)
- Store in `generated_names.domain_status` JSONB
- Affiliate links configured in environment variables
- Rate limit: 10 domains/second to avoid API throttling
- Consider DNS lookup fallback if paid API unavailable

---

### Story 3.10: Naming Session Persistence

**As a** user,
**I want** my naming session to be saved automatically,
**So that** I can continue where I left off if I close the browser.

**Acceptance Criteria:**

**Given** I'm actively using the Narrative Architect
**When** I generate names or have conversations
**Then** everything is auto-saved:

- Conversation history
- Generated names with risk statuses
- Criteria collected
- Last activity timestamp
- **"Saved ✓" indicator** appears in header after each successful sync

**And** save timing:

- **Immediate save** after EVERY name generation (not debounced)
- Conversation saves debounced (2 second delay)
- Visual feedback: subtle checkmark animation confirms save

**And** when I return to the dashboard:

- If session < 24 hours old: "Continue your session?" prompt
- If I click yes: restore chat history, show previously generated names
- If I click "Start Fresh": **Confirmation required**: "This will archive your current session with [X] names. Continue?"
- Prevents accidental data loss

**And** session data is stored:

- `naming_sessions` table with user_id, criteria, created_at, updated_at
- `generated_names` linked to session
- `favorites` remain across sessions (not session-specific)

**MVP Scope Note:** "Past Sessions" browsing UI (view old sessions, restart from criteria) is deferred to Story 3.10b post-MVP. Data IS stored; UI to browse it comes later.

**Prerequisites:** Story 3.1, Story 3.3, Story 1.3

**Technical Notes:**

- Auto-save on each interaction (debounced, 2 second delay)
- Use Zustand persist for immediate client-side backup
- Sync to DB via server action periodically
- Session restore: fetch from DB, hydrate Zustand stores
- Consider session limit: 10 active sessions per user, auto-archive old ones

---

**Epic 3 Complete!**

This epic delivers the complete core naming experience. Upon completion:

- ✅ AI-powered Narrative Architect chat interface
- ✅ Conversational criteria collection (no boring forms)
- ✅ "Elevated Creative" name generation (10-15 names per round)
- ✅ Natural language refinement ("make it shorter", "like this one")
- ✅ Real-time Traffic Light risk indicators (Green/Amber/Red)
- ✅ IP risk checks against trademark databases
- ✅ Risk factor summaries explaining why names are flagged
- ✅ Favorites system for saving/comparing names
- ✅ Domain availability quick checks with affiliate links
- ✅ Session persistence across browser closures

**FRs Delivered:** FR4 ✅, FR5 ✅, FR6 ✅, FR7 ✅, FR8 ✅, FR9 ✅, FR14 ✅, FR15 ✅

**Ready for:** Epic 4 - Monetization & Conversion

---

## Epic 4: Monetization & Conversion

**Goal:** Implement the complete revenue engine—De-Risking Report purchases via Polar.sh, PDF report generation, affiliate hosting links in the Launch Readiness Checklist, legal referral CTAs, and order history tracking.

**User Value:** After this epic, users can purchase professional De-Risking Reports for Amber names ($7.99), receive PDF downloads, access affiliate hosting links for Green names, and find attorney referrals for Red names. The "Trojan Horse" monetization model is fully operational.

**FRs Covered:** FR3, FR10, FR11, FR12, FR13

---

### Story 4.1: Polar.sh Payment Integration Setup

**As a** developer,
**I want** Polar.sh configured as the payment provider,
**So that** we can process De-Risking Report purchases with tax compliance handled.

**Acceptance Criteria:**

**Given** Polar.sh account is created and configured
**When** the integration is set up
**Then** the following exists:

- Polar.sh product created: "De-Risking Report" at $7.99
- Environment variables configured:
  - `POLAR_ACCESS_TOKEN`
  - `POLAR_ORGANIZATION_ID`
  - `POLAR_PRODUCT_ID`
  - `POLAR_WEBHOOK_SECRET`
- Webhook endpoint: `/api/webhooks/polar/route.ts`

**And** the webhook handler:

- Validates webhook signature before processing
- Handles `checkout.completed` event
- Creates `orders` record with `polar_order_id`
- Triggers report generation (Story 4.3)
- Is idempotent (same event processed twice = no duplicate orders)

**And** error handling:

- Failed webhooks retry (Polar handles this)
- Logging via pino for debugging
- Alert mechanism for failed order creation

**Prerequisites:** Story 1.7, Story 1.3

**Technical Notes:**

- Use `@polar-sh/sdk` (v0.48.x) npm package
- Polar.sh is Merchant of Record = handles VAT/sales tax (per ADR-002)
- Webhook runs on Node runtime (not Edge - needs DB access)
- Store `polar_checkout_id` for reconciliation
- Test with Polar sandbox before production
- Webhook signature validation via `@polar-sh/sdk/webhooks`
- Implement idempotency via `polar_order_id` unique constraint (per Architecture)

---

### Story 4.2: De-Risking Report Purchase Flow

**As a** user viewing an Amber name,
**I want** to purchase a De-Risking Report,
**So that** I understand if I can safely use this name.

**Acceptance Criteria:**

**Given** I click "Get De-Risking Report" on an Amber name's risk modal
**When** the checkout flow initiates
**Then** I see:

- Report preview card showing:
  - Name being analyzed
  - Price: "$7.99"
  - What's included: "Detailed trademark analysis", "Risk assessment", "Recommendations"
- "Purchase Report" primary CTA button

**And** clicking "Purchase Report":

- Creates Polar.sh checkout session
- Redirects to Polar.sh hosted checkout page
- Pre-fills user email from session
- Success URL: `/app/reports/[order_id]`
- Cancel URL: returns to dashboard with toast "Purchase cancelled"

**And** on successful payment:

- Polar webhook triggers (Story 4.1)
- Order created in `orders` table with status: 'processing'
- User redirected to report page showing "Generating your report..."
- Email sent: "Your De-Risking Report is being generated"

**And** checkout is accessible:

- Works on mobile (Polar handles responsive)
- Loading states during redirect
- Error handling if checkout fails

**Prerequisites:** Story 4.1, Story 3.7

**Technical Notes:**

- Server action: `server/actions/orders.ts` → `createCheckout()`
- Use Polar.sh Checkout Sessions API
- Store `name_id` in checkout metadata for report generation
- Consider discount codes support (Polar feature)
- Track checkout abandonment for analytics

---

### Story 4.3: PDF Report Generation

**As a** system,
**I want** to generate professional PDF De-Risking Reports,
**So that** users receive their purchased analysis.

**Acceptance Criteria:**

**Given** a successful payment webhook is received
**When** the report generation triggers
**Then** the PDF includes:

**Page 1 - Cover:**

- "De-Risking Report" title
- Name being analyzed (large, prominent)
- Traffic Light status badge
- Generated date
- "Confidential - Prepared for [User Email]"

**Page 2 - Executive Summary:**

- Overall risk score (e.g., "Medium Risk - 65/100")
- Key findings (3-5 bullet points)
- Recommendation: "Proceed with caution" / "Consider alternatives" / etc.

**Page 3+ - Detailed Analysis:**

- Each trademark conflict with:
  - Conflicting mark name and owner
  - Registration details (number, date, status)
  - Similarity analysis (why it's flagged)
  - Risk level for THIS specific conflict
- Industry/class analysis
- Geographic considerations (US focus for MVP)

**Final Page - Next Steps:**

- If viable: "Launch Readiness Checklist" preview
- If risky: "We recommend consulting an attorney"
- Disclaimer: "This report is informational only and does not constitute legal advice"

**And** the PDF:

- Is professionally styled (matches brand colors)
- Is generated within 30 seconds
- Is stored in Supabase Storage bucket
- URL saved to `reports.pdf_url`
- Order status updated to 'completed'

**And** user notification:

- Email sent with download link
- Dashboard shows "Report Ready" with download button

**Prerequisites:** Story 4.2, Story 3.6

**Technical Notes:**

- Use `@react-pdf/renderer` (v4.3.x) for PDF generation
- Component: `server/services/report-generator.ts`
- PDF template: `components/features/reports/report-template.tsx`
- Upload to Supabase Storage: `reports/{user_id}/{order_id}.pdf`
- **Background job pattern for PDF generation >10s** (per Architecture):
  ```typescript
  // server/jobs/pdf-generation.ts
  export async function generateReportAsync(orderId: string) {
    await updateOrderStatus(orderId, "processing");
    const pdfBuffer = await generatePdfReport(orderId);
    await supabase.storage.from("reports").upload(`${orderId}.pdf`, pdfBuffer);
    await updateOrderStatus(orderId, "completed");
  }
  ```
- Cache risk data at purchase time (don't re-fetch from Signa.so)
- Date formatting via Dayjs (v1.11.13) per Architecture

---

### Story 4.4: Report Viewing & Download

**As a** user who purchased a report,
**I want** to view and download my De-Risking Report,
**So that** I can reference it when making my decision.

**Acceptance Criteria:**

**Given** I navigate to `/app/reports/[order_id]`
**When** the report page loads
**Then** I see:

- Report status: "Ready" / "Generating..." / "Failed"
- If ready:
  - PDF preview (embedded viewer or first page thumbnail)
  - "Download PDF" primary button
  - "Share Report" (generates shareable link, valid 7 days)
- Report metadata: Name, Purchase date, Order ID

**And** the download:

- Triggers browser download
- Filename: `DeRisking-Report-[Name]-[Date].pdf`
- Works on mobile (opens in new tab on iOS)

**And** if generation failed:

- Show error message: "Something went wrong generating your report"
- "Contact Support" link with order ID pre-filled
- Refund instructions

**And** report is accessible:

- Only the purchasing user can view (auth check)
- Shared links work without auth (time-limited)
- Report available indefinitely in order history

**Prerequisites:** Story 4.3

**Technical Notes:**

- Page: `app/app/reports/[orderId]/page.tsx`
- Fetch from `reports` table joined with `orders`
- PDF preview: use `<iframe>` or react-pdf viewer
- Signed URL for download (Supabase Storage)
- Share links: generate token, store in `report_shares` table

---

### Story 4.5: Launch Readiness Checklist (Green Names)

**As a** user with a Green name,
**I want** to see a checklist for launching my brand,
**So that** I know the next steps and can register my domain/hosting.

**Acceptance Criteria:**

**Given** I click on a Green name
**When** the details modal opens
**Then** I see a "Launch Readiness Checklist":

**Checklist Items:**

1. ☐ **Secure Your Domain** - "[name].com is available!" + "Register Now" button
2. ☐ **Set Up Hosting** - "Get your website live" + Hosting affiliate links
3. ☐ **Reserve Social Handles** - @[name] availability indicators
4. ☐ **File Trademark** (optional) - "Protect your brand legally" + info link
5. ☐ **Create Logo** - "Design your brand identity" + affiliate/tool links

**And** affiliate links:

- Domain: Namecheap, GoDaddy, Porkbun (configurable)
- Hosting: Vercel, Netlify, Hostinger (configurable)
- Logo: Canva, Looka (configurable)
- Links include affiliate tracking parameters
- Open in new tab

**And** the checklist:

- Items can be checked off (stored locally, no backend)
- Progress indicator: "2 of 5 complete"
- Celebratory animation when all complete 🎉

**And** design:

- Friendly, action-oriented tone
- Each item has icon + description + CTA button
- Mobile: stacked layout, full-width buttons

**Prerequisites:** Story 3.7, Story 3.9

**Technical Notes:**

- Component: `components/features/checkout/launch-checklist.tsx`
- Affiliate links stored in environment variables or config
- Checklist state: localStorage (not worth DB storage)
- Track affiliate clicks for analytics
- Social handle check: use API or link to external checker

---

### Story 4.6: Legal Referral CTA (Red Names)

**As a** user with a Red name I love,
**I want** to see a referral link to a trademark attorney,
**So that** I can get professional advice on whether to proceed.

**Acceptance Criteria:**

**Given** I click on a Red name or see the legal consultation CTA
**When** the referral section displays
**Then** I see:

- Headline: "Get Expert Legal Advice"
- Subtext: "This name has significant trademark conflicts. We recommend consulting an attorney before proceeding."
- **Referral CTA button**: "Find a Trademark Attorney"
- The button links to a location-appropriate legal partner

**And** the referral link is determined by:

- User's detected location (via IP geolocation or browser locale)
- Domain/region mapping (e.g., .com → US attorneys, .co.uk → UK attorneys)
- Fallback to generic international directory if location unknown

**And** the referral links:

- Open in new tab
- Include tracking parameters for analytics
- List of legal partners will be configured in environment variables (provided later)

**And** the section includes:

- Disclaimer: "This is not legal advice. We receive referral fees from partner attorneys."
- The name's risk factors summary (from Analysis Card)

**And** design:

- Prominent but not pushy
- Uses Warning/Red visual styling consistent with risk indicators
- Mobile: full-width CTA button

**Prerequisites:** Story 3.7

**Technical Notes:**

- Component: `components/features/legal/legal-referral.tsx`
- Referral links config: `lib/config/legal-partners.ts` (populated later)
- Geolocation: use `navigator.language` or IP lookup service
- Track referral clicks via analytics (PostHog or similar)
- No database table needed - stateless referral link pattern

---

### Story 4.7: Order History Page

**As a** user,
**I want** to view my past purchases,
**So that** I can access my reports and track my spending.

**Acceptance Criteria:**

**Given** I navigate to `/app/orders` (via profile menu)
**When** the page loads
**Then** I see:

- Page title: "Order History"
- List of orders sorted by date (newest first)
- Each order card shows:
  - Order date
  - Name the report was for
  - Amount paid ($7.99)
  - Status badge: "Completed" / "Processing" / "Failed"
  - "View Report" button (if completed)

**And** empty state:

- "No orders yet"
- "Purchase a De-Risking Report to see your order history"
- Link back to dashboard

**And** order details (click to expand or separate page):

- Order ID (for support reference)
- Polar receipt link
- Download report button
- Purchase date and time

**And** the page:

- Paginates if >20 orders (unlikely for most users)
- Mobile: cards stack vertically
- Loading skeleton while fetching

**Prerequisites:** Story 4.4, Story 2.8

**Technical Notes:**

- Page: `app/app/orders/page.tsx`
- Server action: `server/actions/orders.ts` → `getOrderHistory()`
- Query `orders` table with user_id, join `reports` and `generated_names`
- Link to Polar receipt via `polar_order_id`
- FR3 delivered by this story

---

### Story 4.8: Email Notifications for Purchases

**As a** user,
**I want** to receive email updates about my purchase,
**So that** I know when my report is ready.

**Acceptance Criteria:**

**Given** I complete a purchase
**When** order events occur
**Then** I receive emails:

**Email 1 - Order Confirmed (immediate):**

- Subject: "Your De-Risking Report is being generated"
- Content: Order summary, name being analyzed, expected time (~30 seconds)

**Email 2 - Report Ready (after generation):**

- Subject: "Your De-Risking Report is ready!"
- Content: Download link (signed URL, valid 7 days), key findings preview
- CTA: "View Your Report"

**Email 3 - Report Failed (if generation fails):**

- Subject: "Issue with your report"
- Content: Apology, support contact, refund information
- CTA: "Contact Support"

**And** email design:

- Matches brand (Midnight Blue + Indigo accents)
- Mobile responsive
- Unsubscribe link (required)
- Plain text alternative

**Prerequisites:** Story 4.3, Story 4.2

**Technical Notes:**

- Use Resend or Supabase Email (configure in env)
- Email templates: `server/emails/` directory
- React Email for template components
- Track email opens/clicks for analytics
- Respect user email preferences (future: notification settings)

---

**Epic 4 Complete!**

This epic delivers the complete monetization engine. Upon completion:

- ✅ Polar.sh payment integration with webhook handling
- ✅ De-Risking Report purchase flow ($7.99)
- ✅ Professional PDF report generation with React-PDF
- ✅ Report viewing and download
- ✅ Launch Readiness Checklist with affiliate links (Green path)
- ✅ Legal referral CTA (Red path)
- ✅ Order history page
- ✅ Email notifications for purchase lifecycle

**FRs Delivered:** FR3 ✅, FR10 ✅, FR11 ✅, FR12 ✅, FR13 ✅

---

## FR Coverage Matrix

| FR   | Description                                                     | Epic   | Stories                 |
| ---- | --------------------------------------------------------------- | ------ | ----------------------- |
| FR1  | Users can create accounts to save progress and names            | Epic 2 | 2.1, 2.2, 2.6, 2.8, 2.9 |
| FR2  | Users can log in via email or social providers                  | Epic 2 | 2.1, 2.3, 2.4, 2.5      |
| FR3  | Users can view order history (De-Risking Reports)               | Epic 4 | 4.7                     |
| FR4  | Users input business criteria via chat interface                | Epic 3 | 3.1, 3.2                |
| FR5  | System generates "Elevated Creative" names using LLM            | Epic 3 | 3.3                     |
| FR6  | Users can refine generation parameters                          | Epic 3 | 3.4                     |
| FR7  | System performs preliminary IP checks against trademark DBs     | Epic 3 | 3.6                     |
| FR8  | System displays Traffic Light risk indicator                    | Epic 3 | 3.5                     |
| FR9  | Users can view risk factor summary for selected name            | Epic 3 | 3.7                     |
| FR10 | Users can purchase De-Risking Report for Amber/Green names      | Epic 4 | 4.1, 4.2                |
| FR11 | System generates and delivers PDF De-Risking Report             | Epic 4 | 4.3, 4.4, 4.8           |
| FR12 | System presents Launch Readiness Checklist with affiliate links | Epic 4 | 4.5                     |
| FR13 | System presents Legal Referral CTA link for Red names           | Epic 4 | 4.6                     |
| FR14 | Users can save favorite names to a list                         | Epic 3 | 3.8                     |
| FR15 | System stores generated names and risk statuses with user       | Epic 3 | 3.9, 3.10               |

**✅ All 15 Functional Requirements covered!**

---

## Summary

| Epic                                     | Stories        | FRs Covered            | Status       |
| ---------------------------------------- | -------------- | ---------------------- | ------------ |
| Epic 1: Foundation & Infrastructure      | 7              | Infrastructure for all | ✅           |
| Epic 2: User Authentication & Onboarding | 9              | FR1, FR2               | ✅           |
| Epic 3: Core Naming Experience           | 10             | FR4-FR9, FR14, FR15    | ✅           |
| Epic 4: Monetization & Conversion        | 8              | FR3, FR10-FR13         | ✅           |
| **TOTAL**                                | **34 stories** | **15 FRs**             | **Complete** |

---

## Architecture Alignment

This document incorporates technical decisions from the Architecture document (2025-12-04):

| ADR     | Decision                             | Impact on Epics                            |
| ------- | ------------------------------------ | ------------------------------------------ |
| ADR-001 | Drizzle ORM over Prisma              | Epic 1 (Story 1.3): Type-safe schema       |
| ADR-002 | Polar.sh as Payment Provider         | Epic 4 (Stories 4.1-4.4): MoR checkout     |
| ADR-003 | Server Actions as Primary API        | All Epics: ActionResponse pattern          |
| ADR-004 | Vercel AI SDK for LLM                | Epic 3 (Stories 3.1-3.4): Gemini streaming |
| ADR-005 | Signa.so for Trademark API           | Epic 3 (Stories 3.5-3.7): Risk checks      |
| ADR-006 | Pino + Sentry for Observability      | Epic 1 (Story 1.7): Logging setup          |
| ADR-007 | Feature-Based Component Organization | All Epics: Component structure             |

**Key Dependency Versions (verified 2025-12-04):**

- Next.js: 15.1.0
- Drizzle ORM: 0.44.7
- Supabase: 2.49.1 (@supabase/ssr 0.7.0)
- Zustand: 5.0.9
- Vercel AI SDK: 5.0.102
- @ai-sdk/google: 2.0.43
- Pino: 10.1.0
- Sentry: 10.28.0
- Zod: 4.1.13

---

_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._

_This document incorporates context from PRD, UX Design Specification, and Architecture documents (updated 2025-12-04). Ready for Phase 4: Sprint Planning._

_Architecture alignment update completed: 4 December 2025_
