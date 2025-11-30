# Architecture

## Executive Summary

"Name Your Next Great Idea" is a "Launch Certainty Engine" built on a modern, type-safe stack (Next.js, Supabase, Drizzle). The architecture prioritizes "Certainty" through strict compile-time validation and a "Trojan Horse" monetization flow that leverages friction as a feature. It uses a feature-based organization structure to separate the "Narrative Architect" (Chat) from the "Traffic Light" (Risk) logic, ensuring scalability and maintainability.

## Project Initialization

The project is initialized using the **Modern Full-Stack** pattern.

This establishes the base architecture with these decisions:

- **Framework:** Next.js 16.0.3 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Backend:** Supabase (Auth/DB)
- **ORM:** Drizzle ORM
- **State:** TanStack Query (Server) + Zustand (Client)

## Decision Summary

| Category             | Decision                | Version           | Affects Epics       | Rationale                                                                |
| -------------------- | ----------------------- | ----------------- | ------------------- | ------------------------------------------------------------------------ |
| **Data Persistence** | **Drizzle ORM**         | v0.44.7           | All Epics           | Strict type safety prevents "False Negative" risk bugs.                  |
| **Client State**     | **Zustand**             | v5.0.9            | Narrative Architect | Simple, unopinionated state for "Trojan Horse" session context.          |
| **Server State**     | **TanStack Query**      | v5.90.11          | Traffic Light       | Robust caching and synchronization for risk check results.               |
| **Payment Provider** | **Polar.sh**            | v0.41.5           | Monetization        | Merchant of Record handles tax/compliance for "Lean Entrepreneurs".      |
| **PDF Generation**   | **React-PDF**           | v4.3.1            | Reports             | Component-based PDF creation ensures professional "De-Risking Reports".  |
| **Testing**          | **Vitest + Playwright** | v4.0.14 / v1.57.0 | All Epics           | High trust requires rigorous unit (Vitest) and E2E (Playwright) testing. |
| **Date Handling**    | **Dayjs**               | Latest            | Reports, Checkout   | Lightweight, immutable date library for consistent formatting.           |

## Project Structure

```
/
├── app/
│   ├── (auth)/                 # Auth routes group
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/            # Protected routes
│   │   ├── dashboard/
│   │   └── reports/
│   ├── api/
│   │   ├── webhooks/
│   │   │   └── polar/          # Webhook handler
│   │   └── trpc/               # If using tRPC (optional)
│   ├── layout.tsx
│   └── page.tsx                # Landing page
├── components/
│   ├── lib/
│   │   ├── stores/             # Zustand stores
│   │   ├── supabase/
│   │   │   └── client.ts
│   │   └── utils.ts
│   ├── providers/              # App providers
│   ├── features/               # Feature-based components
│   │   ├── naming/             # Narrative Architect & Traffic Light
│   │   │   ├── chat-interface.tsx
│   │   │   ├── traffic-light-badge.tsx
│   │   │   └── name-card.tsx
│   │   ├── reports/            # Report generation & viewing
│   │   │   └── report-preview.tsx
│   │   └── checkout/           # Payment flows
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   └── ...
│   └── shared/                 # Shared utilities
├── server/
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts           # Drizzle schema (Single Source of Truth)
│   │   │   └── index.ts            # DB connection
│   │   └── supabase/
│   │       └── server.ts
│   ├── actions/                # Server Actions (API Layer)
│   │   ├── naming.ts
│   │   └── orders.ts
│   └── agents/                 # AI Agents definition
│   └── services/               # Business Logic (Service Layer)
│       ├── trademark.ts
│       ├── risk-engine.ts
│       └── report-generator.ts
├── drizzle/                    # Migrations
├── public/
├── tests/                      # Vitest/Playwright tests
├── drizzle.config.ts
├── next.config.mjs
├── package.json
└── tsconfig.json
```

## Epic to Architecture Mapping

| Epic                    | Primary Components                     | Data Models        | Key Services                     |
| ----------------------- | -------------------------------------- | ------------------ | -------------------------------- |
| **Narrative Architect** | `ChatInterface`, `NameCard`            | `UserSession`      | `NamingService`                  |
| **Risk Assessment**     | `TrafficLightBadge`, `RiskRevealModal` | `RiskCheck`        | `RiskEngine`, `TrademarkService` |
| **Monetization**        | `CheckoutButton`, `ReportPreview`      | `Order`, `Product` | `PolarService`, `OrderService`   |
| **De-Risking Reports**  | `ReportViewer`, `DownloadButton`       | `Report`           | `ReportGenerator` (React-PDF)    |

## Technology Stack Details

### Core Technologies

- **Next.js 16.0.3:** App Router for routing and Server Actions.
- **Supabase:** PostgreSQL database and Authentication.
- **Drizzle ORM:** Type-safe database interaction.
- **Tailwind CSS v4:** Utility-first styling.
- **shadcn/ui:** Accessible component primitives.
- **aceternity/ui:** Styled shadcn components.
- **AI SDK:** From the creators of Next.js, the AI SDK is a free open-source library that gives you the tools you need to build AI-powered products.
- **Google Gemini API:** AI chat completion and live assistants

### Integration Points

- **Polar.sh:** Payment processing and Merchant of Record.
  - _Integration:_ Webhook at `api/webhooks/polar`.
- **USPTO/Trademarkia:** External trademark data.
  - _Integration:_ `server/services/trademark.ts`.
- **Vercel AI SDK:** LLM integration for Narrative Architect.
  - _Integration:_ `server/actions/naming.ts`.

## Novel Pattern Designs

### Pattern 1: The "Trojan Horse" Segmentation

- **Purpose:** Bifurcate users into "Lean Entrepreneur" (Speed) vs "High-Stakes Founder" (Safety) paths immediately.
- **Components:** `SegmentationPrompt` (Client), `UserSession` (State).
- **Data Flow:** User Selection -> Update Session Context -> Adjust Narrative Architect System Prompt -> Route to appropriate Chat Flow.
- **Implementation Guide:** The `NarrativeArchitect` component must read the `userType` from the session store _before_ initializing the chat. If `userType` is missing, render `SegmentationPrompt` overlay first.

### Pattern 2: The "Friction as a Feature" Traffic Light

- **Purpose:** Deliberately pause user flow on "Amber" results to drive monetization.
- **Components:** `TrafficLightBadge`, `RiskRevealModal`, `ReportPreview`.
- **Data Flow:**
  - Green: Click -> Show Details (Low Friction).
  - Amber: Click -> **INTERCEPT** -> Show `RiskRevealModal` (High Friction) -> Upsell Report.
  - Red: Click -> Show Danger Warning -> Lead Gen Form.
- **Implementation Guide:** The `NameCard` `onClick` handler must switch behavior based on the `riskStatus` prop. Do not use a generic "open details" handler.

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents:

### Consistency Rules

### Naming Conventions

- **Database:** `snake_case` for tables and columns (e.g., `user_profiles`, `is_active`).
- **API/Server Actions:** `camelCase` (e.g., `createOrder`, `checkRisk`).
- **Components:** `PascalCase` (e.g., `TrafficLightBadge`).
- **Files:** `kebab-case` (e.g., `traffic-light-badge.tsx`, `schema.ts`).

### Code Organization

- **Server Actions:** MUST be placed in `server/actions/{domain}.ts`.
- **Services:** Business logic MUST go in `server/services/{domain}.ts`. Server actions only handle input validation and auth.
- **Tests:** Co-located `__tests__` folders are NOT used. All tests go in `tests/` mirroring the source structure.

### Error Handling

- **Server Actions:** Return a tuple or standard response object:
  ```typescript
  type ActionResponse<T> =
    | { success: true; data: T }
    | { success: false; error: string; code?: string };
  ```
- **Global:** Use a global Error Boundary for unexpected crashes.

### Logging Strategy

- **Library:** `pino` (lightweight, JSON-structured).
- **Format:** JSON for queryability in logs.

### Date Handling

- **Library:** `dayjs`.
- **Storage:** UTC ISO strings in DB.
- **Display:** Format using `dayjs` in UI components.

## Data Architecture

- **Single Source of Truth:** `server/lib/db/schema.ts` defines the Drizzle schema.
- **Migrations:** Managed via `drizzle-kit`.
- **Type Safety:** All DB queries MUST use Drizzle's query builder or `db.select()...` for type inference.

## API Contracts

- **Server Actions:** Defined as async functions exporting `ActionResponse<T>`.
- **Webhooks:** Validate signatures before processing. Idempotency required.

## Security Architecture

- **Auth:** Supabase Auth (SSR).
- **RLS:** Row Level Security enabled on all Supabase tables (even if accessed via ORM, good practice for direct client access).
- **Validation:** Zod used for all input validation in Server Actions.

## Performance Considerations

- **Caching:** TanStack Query for server state caching.
- **PDF Generation:** Offload to async job if generation takes >10s.
- **Edge:** Use Edge Runtime for simple redirects/middleware.

## Deployment Architecture

- **Platform:** Vercel.
- **Database:** Supabase (Managed PostgreSQL).
- **CI/CD:** GitHub Actions running Vitest and Playwright.

## Development Environment

### Prerequisites

- Node.js v20+
- npm v10+
- Supabase CLI (optional, for local dev)

### Setup Commands

```bash
npm install
npm run dev
```

## Architecture Decision Records (ADRs)

- **ADR-001: Drizzle ORM:** Chosen for strict type safety to prevent risk assessment bugs.
- **ADR-002: Polar.sh:** Chosen as Merchant of Record to simplify tax compliance.
- **ADR-003: Server Services:** Business logic placed in `server/services` to separate from shared `lib` code.
- **ADR-004: AI SDK:** AI SDK shall be used to interact with ai models. Visit [AI SDK LLM documentation](https://ai-sdk.dev/llms.txt)

---

_Generated by BMAD Decision Architecture Workflow v1.0_
_Date: 30 November 2025_
_For: MG_
