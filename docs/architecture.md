# Architecture

## Executive Summary

"Name Your Next Great Idea" is a "Launch Certainty Engine" built on a modern, type-safe stack (Next.js 15, Supabase, Drizzle). The architecture prioritizes "Certainty" through strict compile-time validation and a "Trojan Horse" monetization flow that leverages friction as a feature. It uses a feature-based organization structure to separate the "Narrative Architect" (Chat) from the "Traffic Light" (Risk) logic, ensuring scalability and maintainability.

## Project Initialization

The project was initialized using **Create Next App**

**Starter Template:** `create-next-app@15.1.0`  
**Verification Date:** 2025-12-04  
**Source:** [Next.js GitHub Releases](https://github.com/vercel/next.js/releases)

### Decisions Provided by Starter

The following decisions are **PROVIDED BY STARTER** and should not be overridden:

| Decision     | Provided Value          | Notes                   |
| ------------ | ----------------------- | ----------------------- |
| Framework    | Next.js 15 (App Router) | LTS stable release      |
| Language     | TypeScript 5.x          | Strict mode enabled     |
| Styling Base | Tailwind CSS 4.x        | PostCSS integration     |
| Linting      | ESLint 9.x              | Next.js config preset   |
| Build Tool   | Turbopack               | Dev server default      |
| Import Alias | `@/*`                   | Path mapping configured |

### Additional Technology Decisions (Beyond Starter)

| Technology     | Decision                      | Rationale                                                       |
| -------------- | ----------------------------- | --------------------------------------------------------------- |
| UI Components  | shadcn/ui + Aceternity        | Professional base + creative flair for "Elevated Creative" feel |
| Backend        | Supabase (Auth/DB)            | Managed Postgres + Auth simplifies infrastructure               |
| ORM            | Drizzle ORM                   | Type-safe queries prevent "False Negative" risk bugs            |
| Client State   | Zustand                       | Lightweight, unopinionated state for session context            |
| AI Integration | Vercel AI SDK + Google Gemini | Streaming responses for Narrative Architect                     |
| Payment        | Polar.sh                      | Merchant of Record for tax/compliance                           |
| Observability  | Pino + Sentry                 | Structured logging + error tracking                             |

## Decision Summary

| Category             | Decision                | Version                      | Verified Date | Source       | Affects Epics       | Rationale                                                          |
| -------------------- | ----------------------- | ---------------------------- | ------------- | ------------ | ------------------- | ------------------------------------------------------------------ |
| **Framework**        | **Next.js**             | 15.1.0 (LTS)                 | 2025-12-04    | package.json | All Epics           | **PROVIDED BY STARTER** - App Router, React 19 support, stable LTS |
| **Data Persistence** | **Drizzle ORM**         | 0.44.7                       | 2025-12-04    | package.json | All Epics           | Strict type safety prevents "False Negative" risk bugs             |
| **Database**         | **Supabase (Postgres)** | 2.49.1 (@supabase/ssr 0.7.0) | 2025-12-04    | package.json | All Epics           | Managed Postgres with Auth, RLS, and realtime capabilities         |
| **Client State**     | **Zustand**             | 5.0.9                        | 2025-12-04    | package.json | Narrative Architect | Simple state for "Trojan Horse" session context                    |
| **AI SDK**           | **Vercel AI SDK**       | 5.0.102                      | 2025-12-04    | package.json | Narrative Architect | Streaming chat, tool calling, Google Gemini integration            |
| **AI Model**         | **Google Gemini**       | @ai-sdk/google 2.0.43        | 2025-12-04    | package.json | Narrative Architect | Cost-effective, fast inference for name generation                 |
| **Payment Provider** | **Polar.sh**            | 0.48.x (latest)              | 2025-12-04    | NPM Registry | Monetization        | Merchant of Record handles tax/compliance                          |
| **PDF Generation**   | **React-PDF**           | 4.3.x (latest)               | 2025-12-04    | NPM Registry | Reports             | Component-based PDF for "De-Risking Reports"                       |
| **Testing (Unit)**   | **Vitest**              | 3.2.x (latest)               | 2025-12-04    | NPM Registry | All Epics           | Fast, Vite-native testing with TypeScript                          |
| **Testing (E2E)**    | **Playwright**          | 1.52.x (latest)              | 2025-12-04    | NPM Registry | All Epics           | Cross-browser E2E for critical user flows                          |
| **Date Handling**    | **Dayjs**               | 1.11.13                      | 2025-12-04    | NPM Registry | Reports, Checkout   | Lightweight, immutable dates with timezone support                 |
| **Logging**          | **Pino**                | 10.1.0                       | 2025-12-04    | package.json | All Epics           | High-performance JSON structured logging                           |
| **APM/Errors**       | **Sentry**              | 10.28.0 (@sentry/nextjs)     | 2025-12-04    | package.json | All Epics           | Error tracking, performance monitoring, session replay             |
| **Validation**       | **Zod**                 | 4.1.13                       | 2025-12-04    | package.json | All Epics           | Runtime type validation for all inputs                             |

## Project Structure

```
/
├── app/
│   ├── auth/                 # Auth routes group (unauthenticated)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── verify-email/
│   │   ├── └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── studio/             # Main naming experience
│   │   │   └── page.tsx
│   │   ├── reports/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── orders/
│   │       └── page.tsx
│   ├── api/
│   │   ├── health/
│   │   │   └── ready/
│   │   │       └── route.ts    # Health check endpoint
│   │   └── webhooks/
│   │       └── polar/
│   │           └── route.ts    # Payment webhook handler
│   ├── global-error.tsx        # Global error boundary
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Landing page (marketing)
│   └── globals.css             # Global styles + CSS variables
├── components/
│   ├── features/               # Feature-based components
│   │   ├── naming/             # Epic 3: Core Naming Experience
│   │   │   ├── chat-interface.tsx
│   │   │   ├── name-card.tsx
│   │   │   ├── name-grid.tsx
│   │   │   └── segmentation-prompt.tsx
│   │   ├── risk/               # Epic 3: Risk Assessment
│   │   │   ├── traffic-light-badge.tsx
│   │   │   ├── risk-reveal-modal.tsx
│   │   │   └── risk-summary.tsx
│   │   ├── reports/            # Epic 4: De-Risking Reports
│   │   │   ├── report-preview.tsx
│   │   │   ├── report-viewer.tsx
│   │   │   └── download-button.tsx
│   │   ├── checkout/           # Epic 4: Monetization
│   │   │   ├── checkout-button.tsx
│   │   │   ├── order-summary.tsx
│   │   │   └── launch-checklist.tsx
│   │   └── auth/               # Epic 2: Authentication
│   │       ├── login-form.tsx
│   │       ├── register-form.tsx
│   │       └── social-auth-buttons.tsx
│   ├── lib/
│   │   ├── stores/             # Zustand stores
│   │   │   ├── session-store.ts
│   │   │   └── naming-store.ts
│   │   ├── supabase/
│   │   │   └── client.ts       # Browser Supabase client
│   │   └── utils.ts            # Utility functions (cn, etc.)
│   ├── providers/              # React context providers
│   │   ├── theme-provider.tsx
│   │   └── query-provider.tsx
│   ├── shared/                 # Shared layout components
│   │   ├── studio-layout.tsx
│   │   ├── mobile-nav.tsx
│   │   └── header.tsx
│   └── ui/                     # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── skeleton.tsx
│       ├── toast.tsx
│       └── ...
├── server/
│   ├── actions/                # Server Actions (API Layer)
│   │   ├── auth.ts             # signIn, signOut, signUp
│   │   ├── naming.ts           # generateNames, refineNames
│   │   ├── risk.ts             # checkRisk, getRiskFactors
│   │   ├── orders.ts           # createOrder, getOrders
│   │   └── reports.ts          # generateReport, getReport
│   ├── services/               # Business Logic (Service Layer)
│   │   ├── trademark.ts        # Signa.so API integration
│   │   ├── risk-engine.ts      # Risk calculation logic
│   │   ├── report-generator.ts # React-PDF generation
│   │   ├── polar.ts            # Polar.sh payment integration
│   │   └── ai/
│   │       ├── narrative-architect.ts  # Chat system prompts
│   │       └── name-generator.ts       # LLM name generation
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts        # DB connection
│   │   │   └── schema/
│   │   │       ├── auth.ts     # User profiles (extends Supabase)
│   │   │       └── public.ts   # Application tables
│   │   ├── logger/
│   │   │   ├── index.ts        # Pino logger configuration
│   │   │   └── sentry-integration.ts
│   │   ├── sentry/
│   │   │   ├── index.ts
│   │   │   ├── sentry.server.config.ts
│   │   │   └── sentry.edge.config.ts
│   │   └── supabase/
│   │       ├── server.ts       # Server-side Supabase client
│   │       └── middleware.ts   # Auth middleware
│   └── jobs/                   # Background job definitions
│       └── pdf-generation.ts   # Async PDF generation job
├── drizzle/                    # Database migrations
│   ├── meta/
│   │   └── _journal.json
│   └── 0000_*.sql
├── tests/                      # All tests (mirrors src structure)
│   ├── unit/
│   │   ├── services/
│   │   │   ├── risk-engine.test.ts
│   │   │   └── trademark.test.ts
│   │   └── stores/
│   │       └── session-store.test.ts
│   ├── integration/
│   │   └── actions/
│   │       ├── naming.test.ts
│   │       └── orders.test.ts
│   └── e2e/
│       ├── auth.spec.ts
│       ├── naming-flow.spec.ts
│       └── checkout.spec.ts
├── public/
│   ├── favicon.ico
│   └── images/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD pipeline
├── drizzle.config.ts
├── next.config.ts
├── package.json
├── tsconfig.json
├── components.json             # shadcn/ui config
├── instrumentation.ts          # Sentry server instrumentation
└── instrumentation-client.ts   # Sentry client instrumentation
```

## Epic to Architecture Mapping

| Epic                             | Primary Components                                    | Data Models                          | Key Services                     | API Pattern               |
| -------------------------------- | ----------------------------------------------------- | ------------------------------------ | -------------------------------- | ------------------------- |
| **Foundation (Epic 1)**          | `StudioLayout`, `Providers`                           | `user_profiles`                      | Logger, Sentry                   | Server Actions            |
| **Authentication (Epic 2)**      | `LoginForm`, `RegisterForm`, `SegmentationPrompt`     | `user_profiles`                      | Supabase Auth                    | Server Actions            |
| **Narrative Architect (Epic 3)** | `ChatInterface`, `NameCard`, `NameGrid`               | `naming_sessions`, `generated_names` | `NamingService`, `NameGenerator` | Server Actions            |
| **Risk Assessment (Epic 3)**     | `TrafficLightBadge`, `RiskRevealModal`, `RiskSummary` | `risk_checks`                        | `RiskEngine`, `TrademarkService` | Server Actions            |
| **Monetization (Epic 4)**        | `CheckoutButton`, `ReportPreview`, `LaunchChecklist`  | `orders`, `reports`                  | `PolarService`, `OrderService`   | Server Actions + Webhooks |
| **De-Risking Reports (Epic 4)**  | `ReportViewer`, `DownloadButton`                      | `reports`                            | `ReportGenerator` (React-PDF)    | Server Actions            |

## Technology Stack Details

### Core Technologies

| Technology        | Version | Purpose                                 | Documentation                                              |
| ----------------- | ------- | --------------------------------------- | ---------------------------------------------------------- |
| **Next.js**       | 15.1.0  | App Router, RSC, Server Actions         | [nextjs.org/docs](https://nextjs.org/docs)                 |
| **React**         | 19.2.0  | UI components, hooks                    | [react.dev](https://react.dev)                             |
| **TypeScript**    | 5.x     | Type safety, IDE support                | [typescriptlang.org](https://www.typescriptlang.org/docs/) |
| **Tailwind CSS**  | 4.1.17  | Utility-first styling                   | [tailwindcss.com](https://tailwindcss.com/docs)            |
| **shadcn/ui**     | Latest  | Accessible component primitives (Radix) | [ui.shadcn.com](https://ui.shadcn.com)                     |
| **Aceternity UI** | Latest  | Animated components for creative UI     | [ui.aceternity.com](https://ui.aceternity.com)             |
| **Supabase**      | 2.49.1  | PostgreSQL database, Auth, Storage      | [supabase.com/docs](https://supabase.com/docs)             |
| **Drizzle ORM**   | 0.44.7  | Type-safe database queries              | [orm.drizzle.team](https://orm.drizzle.team)               |
| **Zustand**       | 5.0.9   | Client-side state management            | [zustand-demo.pmnd.rs](https://zustand-demo.pmnd.rs)       |

### AI & LLM Integration

| Technology        | Version               | Purpose                          | Documentation                          |
| ----------------- | --------------------- | -------------------------------- | -------------------------------------- |
| **Vercel AI SDK** | 5.0.102               | Unified LLM interface, streaming | [ai-sdk.dev](ai-sdk.dev/llms.txt)      |
| **Google Gemini** | @ai-sdk/google 2.0.43 | Name generation, chat completion | [ai.google.dev](https://ai.google.dev) |

**AI SDK Configuration:**

```typescript
// server/services/ai/name-generator.ts
import { google } from "@ai-sdk/google";
import { generateText, streamText } from "ai";

const model = google("gemini-2.5-flash");

// Streaming for Narrative Architect chat
export async function streamChatResponse(messages: Message[]) {
  return streamText({
    model,
    messages,
    system: NARRATIVE_ARCHITECT_SYSTEM_PROMPT,
  });
}

// Batch generation for name lists
export async function generateNames(criteria: NamingCriteria) {
  return generateText({
    model,
    prompt: buildNamingPrompt(criteria),
    maxTokens: 2000,
  });
}
```

### Integration Points

#### Polar.sh (Payment Processing)

- **Purpose:** Merchant of Record for De-Risking Reports ($7.99)
- **Integration Pattern:** Webhooks + Server Actions
- **Webhook URL:** `POST /api/webhooks/polar`
- **Environment Variables:**
  - `POLAR_ACCESS_TOKEN` - API authentication
  - `POLAR_WEBHOOK_SECRET` - Webhook signature verification
  - `POLAR_ORGANIZATION_ID` - Organization identifier

**Webhook Handler Pattern:**

```typescript
// app/api/webhooks/polar/route.ts
import { validateWebhookSignature } from "@polar-sh/sdk/webhooks";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("polar-signature");

  // Verify webhook signature
  const isValid = validateWebhookSignature(
    payload,
    signature,
    POLAR_WEBHOOK_SECRET
  );
  if (!isValid) return new Response("Invalid signature", { status: 401 });

  const event = JSON.parse(payload);

  // Idempotency check
  const existing = await db.query.orders.findFirst({
    where: eq(orders.polar_order_id, event.data.id),
  });
  if (existing) return new Response("Already processed", { status: 200 });

  // Process event
  switch (event.type) {
    case "checkout.completed":
      await handleCheckoutCompleted(event.data);
      break;
    // ... other events
  }

  return new Response("OK", { status: 200 });
}
```

#### Signa.so (Trademark Search API)

- **Purpose:** Trademark search, clearance, and risk scoring
- **Base URL:** `https://api.signa.so/v1`
- **Integration:** `server/services/trademark.ts`
- **Auth:** Bearer token via `SIGNA_API_KEY`
- **Rate Limits:** 100 requests/minute, implement exponential backoff

**Key Endpoints:**
| Endpoint | Method | Purpose | Credits | Latency |
|----------|--------|---------|---------|---------|
| `/search` | GET | Text search across 147M+ trademarks | 1 | 200-400ms |
| `/analysis/check` | POST | Quick conflict detection | 2 | 300-800ms |
| `/analysis/clearance` | POST | AI-powered risk scoring (CLEAR/LOW/MEDIUM/HIGH) | 5 | 1-3s |

**Service Pattern:**

```typescript
// server/services/trademark.ts
import { logger } from "@/server/lib/logger";

const SIGNA_BASE_URL = "https://api.signa.so/v1";

export async function checkTrademarkRisk(name: string): Promise<RiskResult> {
  const startTime = Date.now();

  try {
    const response = await fetch(`${SIGNA_BASE_URL}/analysis/check`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SIGNA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, jurisdictions: ["USPTO", "EUIPO"] }),
    });

    if (!response.ok) {
      throw new Error(`Signa API error: ${response.status}`);
    }

    const data = await response.json();

    logger.info({
      service: "trademark",
      action: "check",
      name,
      duration: Date.now() - startTime,
      riskLevel: data.riskLevel,
    });

    return mapToRiskResult(data);
  } catch (error) {
    logger.error({ service: "trademark", action: "check", name, error });
    throw error;
  }
}
```

## Novel Pattern Designs

### Pattern 1: The "Trojan Horse" Segmentation

- **Purpose:** Bifurcate users into "Lean Entrepreneur" (Speed) vs "High-Stakes Founder" (Safety) paths immediately upon first interaction.
- **Components:** `SegmentationPrompt` (Client), `session-store.ts` (Zustand).
- **Data Flow:**
  1. User lands on `/studio` for the first time
  2. Check `session-store.userType` → if null, render `SegmentationPrompt` overlay
  3. User selects path → Update `userType` in store + persist to `user_profiles.segment`
  4. `NarrativeArchitect` reads `userType` and adjusts system prompt:
     - **Lean:** Short form, "vibe" focused, speed-optimized prompts
     - **High-Stakes:** Deep dive, "meaning spectrum" focused, safety-optimized prompts
  5. Route to appropriate Chat Flow with tailored UI

**State Machine:**

```
[Landing] → [SegmentationPrompt] → [UserType Selected]
                                         ↓
                    ┌─────────────────────┴─────────────────────┐
                    ↓                                           ↓
           [Lean Entrepreneur]                        [High-Stakes Founder]
           - Quick chat flow                          - Deep dive flow
           - Prioritize domain availability           - Prioritize trademark safety
           - Conversion: Volume reports               - Conversion: Premium reports
```

**Implementation Guide:**

```typescript
// components/features/naming/chat-interface.tsx
export function ChatInterface() {
  const userType = useSessionStore((s) => s.userType);

  // CRITICAL: Block chat until segmentation complete
  if (!userType) {
    return <SegmentationPrompt />;
  }

  const systemPrompt =
    userType === "lean" ? LEAN_ENTREPRENEUR_PROMPT : HIGH_STAKES_FOUNDER_PROMPT;

  return <NarrativeArchitectChat systemPrompt={systemPrompt} />;
}
```

**Edge Cases:**

- **Missing session data:** Re-show `SegmentationPrompt`
- **User wants to switch paths:** Provide "Change Mode" option in settings
- **Session expires:** Restore from `user_profiles.segment` on re-auth

### Pattern 2: The "Friction as a Feature" Traffic Light

- **Purpose:** Deliberately pause user flow on "Amber" results to drive monetization while providing genuine value.
- **Components:** `TrafficLightBadge`, `RiskRevealModal`, `ReportPreview`.
- **Data Flow:**

| Risk Status | Click Behavior                     | Friction Level | Outcome                  |
| ----------- | ---------------------------------- | -------------- | ------------------------ |
| **Green**   | Instant details → Launch Checklist | Low            | Affiliate revenue        |
| **Amber**   | **INTERCEPT** → `RiskRevealModal`  | **High**       | Upsell De-Risking Report |
| **Red**     | Danger warning → Legal Referral    | Medium         | Referral revenue         |

**State Machine:**

```
[NameCard Click] → Check riskStatus
                         ↓
    ┌──────────────────┼──────────────────┐
    ↓                  ↓                  ↓
  [Green]           [Amber]             [Red]
    ↓                  ↓                  ↓
[DetailsPanel]   [RiskRevealModal]   [DangerModal]
    ↓                  ↓                  ↓
[LaunchChecklist]  [ReportPreview]   [LegalReferral]
                       ↓
              [Blur Effect + CTA]
                       ↓
              [CheckoutButton $7.99]
```

**Implementation Guide:**

```typescript
// components/features/naming/name-card.tsx
export function NameCard({ name, riskStatus, onSelect }: NameCardProps) {
  const handleClick = () => {
    // CRITICAL: Switch behavior based on riskStatus - do NOT use generic handler
    switch (riskStatus) {
      case "green":
        onSelect({ type: "show-details", name });
        break;
      case "amber":
        onSelect({ type: "intercept-upsell", name }); // Opens RiskRevealModal
        break;
      case "red":
        onSelect({ type: "show-danger", name });
        break;
    }
  };

  return (
    <Card onClick={handleClick} className="cursor-pointer hover:shadow-lg">
      <CardHeader>
        <CardTitle>{name.value}</CardTitle>
        <TrafficLightBadge status={riskStatus} />
      </CardHeader>
      <CardContent>
        <DomainAvailability domains={name.domains} />
      </CardContent>
    </Card>
  );
}
```

**Edge Cases:**

- **Risk check pending:** Show skeleton/loading state, disable click
- **Risk check failed:** Show "Unable to check" badge, allow manual retry
- **User dismisses modal:** Track analytics, allow continued browsing
- **Multiple amber names:** Each gets its own modal instance

### Pattern 3: Streaming Chat with Structured Output

- **Purpose:** Enable real-time AI responses in Narrative Architect while maintaining type safety.
- **Components:** `ChatInterface`, `MessageStream`, `NameSuggestionCard`

**Data Flow:**

1. User sends message via `ChatInterface`
2. Server Action calls AI SDK `streamText()`
3. Stream tokens back to client using ReadableStream
4. Parse structured outputs (name suggestions) from stream
5. Render `NameSuggestionCard` components inline in chat

**Implementation Guide:**

```typescript
// server/actions/naming.ts
"use server";

import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { createStreamableValue } from "ai/rsc";

export async function streamNamingChat(messages: Message[]) {
  const stream = createStreamableValue("");

  (async () => {
    const { textStream } = await streamText({
      model: google("gemini-2.5-flash"),
      messages,
      system: getSystemPrompt(),
    });

    for await (const text of textStream) {
      stream.update(text);
    }

    stream.done();
  })();

  return { output: stream.value };
}
```

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents:

### API Communication Pattern

**Primary Pattern:** Server Actions (React Server Components)

Server Actions are the **ONLY** approved method for frontend-to-backend communication. Do NOT use:

- ❌ REST API routes (except health checks and webhooks)
- ❌ tRPC
- ❌ GraphQL
- ❌ Direct database access from client

**Rationale:** Server Actions provide type-safe RPC with automatic serialization, work seamlessly with React 19 features, and simplify the codebase by eliminating API route boilerplate.

### CRUD Operations Pattern

All database operations MUST follow this pattern:

```typescript
// server/actions/orders.ts
"use server";

import { db } from "@/server/lib/db";
import { orders } from "@/server/lib/db/schema/public";
import { createClient } from "@/server/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { logger } from "@/server/lib/logger";

// 1. Define Zod schema for input validation
const CreateOrderSchema = z.object({
  nameId: z.string().uuid(),
  productType: z.enum(["de-risking-report", "premium-report"]),
});

// 2. Type the action response
type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

// 3. Implement the action
export async function createOrder(
  input: z.infer<typeof CreateOrderSchema>
): Promise<ActionResponse<{ orderId: string }>> {
  const startTime = Date.now();

  try {
    // 4. Validate input
    const validated = CreateOrderSchema.parse(input);

    // 5. Check authentication
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized", code: "AUTH_REQUIRED" };
    }

    // 6. Execute business logic
    const [order] = await db
      .insert(orders)
      .values({
        user_id: user.id,
        name_id: validated.nameId,
        product_type: validated.productType,
        status: "pending",
        amount_cents:
          validated.productType === "de-risking-report" ? 799 : 2499,
      })
      .returning();

    // 7. Log success
    logger.info({
      action: "createOrder",
      userId: user.id,
      orderId: order.id,
      duration: Date.now() - startTime,
    });

    // 8. Revalidate affected paths
    revalidatePath("/orders");

    return { success: true, data: { orderId: order.id } };
  } catch (error) {
    // 9. Handle errors consistently
    logger.error({ action: "createOrder", error });

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid input",
        code: "VALIDATION_ERROR",
      };
    }

    return {
      success: false,
      error: "Failed to create order",
      code: "INTERNAL_ERROR",
    };
  }
}

// READ operation
export async function getOrders(): Promise<ActionResponse<Order[]>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized", code: "AUTH_REQUIRED" };
  }

  const userOrders = await db.query.orders.findMany({
    where: eq(orders.user_id, user.id),
    orderBy: [desc(orders.created_at)],
  });

  return { success: true, data: userOrders };
}

// UPDATE operation
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<ActionResponse<void>> {
  // ... similar pattern with auth check, validation, logging
}

// DELETE operation (soft delete)
export async function cancelOrder(
  orderId: string
): Promise<ActionResponse<void>> {
  // ... similar pattern, update status to 'cancelled'
}
```

### Consistency Rules

### Naming Conventions

| Context              | Convention                | Example                                           |
| -------------------- | ------------------------- | ------------------------------------------------- |
| **Database tables**  | `snake_case`              | `user_profiles`, `generated_names`, `risk_checks` |
| **Database columns** | `snake_case`              | `user_id`, `created_at`, `risk_status`            |
| **Foreign keys**     | `{table}_id`              | `user_id`, `order_id`, `name_id`                  |
| **Server Actions**   | `camelCase` verb-first    | `createOrder`, `checkRisk`, `generateNames`       |
| **Services**         | `camelCase` verb-first    | `checkTrademarkRisk`, `generateReport`            |
| **React Components** | `PascalCase`              | `TrafficLightBadge`, `NameCard`, `ChatInterface`  |
| **Component files**  | `kebab-case.tsx`          | `traffic-light-badge.tsx`, `name-card.tsx`        |
| **Zustand stores**   | `kebab-case-store.ts`     | `session-store.ts`, `naming-store.ts`             |
| **Test files**       | `*.test.ts` / `*.spec.ts` | `risk-engine.test.ts`, `auth.spec.ts`             |
| **Types/Interfaces** | `PascalCase`              | `RiskResult`, `NamingCriteria`, `Order`           |
| **Env variables**    | `SCREAMING_SNAKE_CASE`    | `SIGNA_API_KEY`, `POLAR_WEBHOOK_SECRET`           |

### Code Organization

| Type                   | Location                                | Pattern                                                   |
| ---------------------- | --------------------------------------- | --------------------------------------------------------- |
| **Server Actions**     | `server/actions/{domain}.ts`            | One file per domain (auth, naming, orders, risk, reports) |
| **Services**           | `server/services/{domain}.ts`           | Business logic, external API calls                        |
| **Zustand Stores**     | `components/lib/stores/{name}-store.ts` | One store per concern                                     |
| **Feature Components** | `components/features/{feature}/`        | Co-located by feature                                     |
| **Shared Components**  | `components/shared/`                    | Layout, navigation, common UI                             |
| **UI Primitives**      | `components/ui/`                        | shadcn/ui components only                                 |
| **Unit Tests**         | `tests/unit/{mirror-src}/`              | Mirror source structure                                   |
| **Integration Tests**  | `tests/integration/actions/`            | Test Server Actions                                       |
| **E2E Tests**          | `tests/e2e/`                            | Critical user flows                                       |

### Error Handling

**Server Actions Response Pattern:**

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

**Client-Side Error Handling:**

```typescript
// Use with React Query or direct calls
const result = await createOrder({ nameId, productType });

if (!result.success) {
  switch (result.code) {
    case "AUTH_REQUIRED":
      redirect("/login");
      break;
    case "VALIDATION_ERROR":
      toast.error("Please check your input");
      break;
    default:
      toast.error(result.error);
      Sentry.captureMessage(result.error, { extra: { code: result.code } });
  }
}
```

**Global Error Boundary:**

```typescript
// app/global-error.tsx
"use client";

import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2>Something went wrong</h2>
            <button onClick={reset}>Try again</button>
          </div>
        </div>
      </body>
    </html>
  );
}
```

### Logging Strategy

**Library:** Pino 10.1.0 (JSON structured logging)

**Log Levels:**
| Level | Usage | Example |
|-------|-------|---------|
| `error` | Errors requiring attention | API failures, unhandled exceptions |
| `warn` | Potential issues | Rate limit approaching, deprecation |
| `info` | Business events | Order created, report generated |
| `debug` | Development details | Query timing, request/response |

**Configuration:**

```typescript
// server/lib/logger/index.ts
import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino({
  level: isProduction ? "info" : "debug",

  // Redact sensitive fields
  redact: ["req.headers.authorization", "email", "password"],

  // Add standard fields
  base: {
    env: process.env.NODE_ENV,
    service: "nyngi",
  },

  // Pretty print in development
  transport: isProduction
    ? undefined
    : {
        target: "pino-pretty",
        options: { colorize: true },
      },
});

// Create child loggers for services
export const createServiceLogger = (service: string) =>
  logger.child({ service });
```

**Structured Log Pattern:**

```typescript
// Always include: action, userId (if available), duration, result
logger.info({
  action: "generateNames",
  userId: user.id,
  criteria: { industry: "tech", tone: "professional" },
  nameCount: 15,
  duration: 1234,
});

logger.error({
  action: "checkTrademarkRisk",
  name: "NovusArc",
  error: error.message,
  stack: error.stack,
  externalService: "signa",
});
```

**Production Log Shipping:**

- Vercel automatically captures stdout/stderr
- Use Vercel Log Drains for external shipping (Datadog, LogDNA, etc.)
- Sentry captures errors with full context

### Observability (APM)

**Library:** Sentry 10.28.0 (@sentry/nextjs)

**Configuration:**

```typescript
// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Error sampling
  sampleRate: 1.0,

  // Capture unhandled rejections
  integrations: [new Sentry.Integrations.Http({ tracing: true })],

  // Filter PII
  beforeSend(event) {
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address;
    }
    return event;
  },
});
```

**Instrumentation Pattern:**

```typescript
// Wrap critical operations
import * as Sentry from "@sentry/nextjs";

export async function generateReport(orderId: string) {
  return Sentry.withScope(async (scope) => {
    scope.setTag("service", "report-generator");
    scope.setContext("order", { orderId });

    const transaction = Sentry.startTransaction({
      name: "generateReport",
      op: "task",
    });

    try {
      const result = await doGenerateReport(orderId);
      transaction.setStatus("ok");
      return result;
    } catch (error) {
      transaction.setStatus("internal_error");
      Sentry.captureException(error);
      throw error;
    } finally {
      transaction.finish();
    }
  });
}
```

### Date Handling

**Library:** Dayjs 1.11.13

**Rules:**

- **Storage:** Always store as UTC ISO strings in database
- **Transmission:** Always transmit as ISO 8601 strings in API responses
- **Display:** Format using Dayjs in UI components only

```typescript
// Date formatting utilities
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (date: string | Date) =>
  dayjs(date).format("MMM D, YYYY");

export const formatDateTime = (date: string | Date) =>
  dayjs(date).format("MMM D, YYYY h:mm A");

export const formatRelative = (date: string | Date) => dayjs(date).fromNow();

// For reports (consistent formatting)
export const formatReportDate = (date: string | Date) =>
  dayjs(date).format("MMMM D, YYYY");
```

## Data Architecture

**Single Source of Truth:** `server/lib/db/schema/` contains all Drizzle schema definitions.

**Schema Files:**

- `auth.ts` - User profiles extension (linked to Supabase `auth.users`)
- `public.ts` - All application tables

**Tables:**

```typescript
// server/lib/db/schema/public.ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";

export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().unique(), // FK to auth.users
  segment: text("segment", { enum: ["lean", "high-stakes"] }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const namingSessions = pgTable("naming_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  criteria: jsonb("criteria").notNull(), // { industry, description, tone, ... }
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const generatedNames = pgTable("generated_names", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").notNull(),
  name: text("name").notNull(),
  rationale: text("rationale"),
  domainStatus: jsonb("domain_status"), // { com: boolean, io: boolean, ai: boolean }
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const riskChecks = pgTable("risk_checks", {
  id: uuid("id").primaryKey().defaultRandom(),
  nameId: uuid("name_id").notNull(),
  status: text("status", { enum: ["green", "amber", "red"] }).notNull(),
  factors: jsonb("factors").notNull(), // Risk factor details from Signa
  checkedAt: timestamp("checked_at").defaultNow().notNull(),
});

export const favorites = pgTable("favorites", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  nameId: uuid("name_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  nameId: uuid("name_id").notNull(),
  productType: text("product_type", {
    enum: ["de-risking-report", "premium-report"],
  }).notNull(),
  polarOrderId: text("polar_order_id"),
  status: text("status", {
    enum: ["pending", "paid", "completed", "cancelled"],
  }).notNull(),
  amountCents: integer("amount_cents").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().unique(),
  pdfUrl: text("pdf_url"),
  generatedAt: timestamp("generated_at"),
});
```

**Migrations:**

- Managed via `drizzle-kit`
- Commands:
  - `npm run db:generate` - Create migration files
  - `npm run db:push` - Apply schema to database
  - `npm run db:studio` - Open Drizzle Studio

**Type Safety:**

- All DB queries MUST use Drizzle's query builder
- Use `db.select()...` or `db.query.{table}.findMany()` for type inference
- Never use raw SQL strings

## API Contracts

### Server Actions (Primary API)

All frontend-to-backend communication uses Server Actions:

```typescript
// Response envelope (consistent across all actions)
type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: ErrorCode };

// Example action signatures
declare function signUp(
  input: SignUpInput
): Promise<ActionResponse<{ userId: string }>>;
declare function generateNames(
  criteria: NamingCriteria
): Promise<ActionResponse<GeneratedName[]>>;
declare function checkRisk(nameId: string): Promise<ActionResponse<RiskResult>>;
declare function createOrder(
  input: CreateOrderInput
): Promise<ActionResponse<{ orderId: string }>>;
declare function getReport(orderId: string): Promise<ActionResponse<Report>>;
```

### REST API Routes (Limited Use)

Only used for health checks and webhooks:

| Endpoint              | Method | Purpose                        | Auth      |
| --------------------- | ------ | ------------------------------ | --------- |
| `/api/health/ready`   | GET    | Kubernetes/Vercel health probe | None      |
| `/api/webhooks/polar` | POST   | Payment webhook receiver       | Signature |

### Webhook Contracts

**Polar.sh Webhook Events:**

```typescript
interface PolarWebhookEvent {
  type: "checkout.completed" | "subscription.created" | "order.refunded";
  data: {
    id: string;
    customer_email: string;
    amount: number;
    currency: string;
    metadata: { nameId: string; userId: string };
  };
}
```

**Webhook Security:**

- Validate `polar-signature` header using `@polar-sh/sdk/webhooks`
- Implement idempotency via `polar_order_id` unique constraint
- Return 200 OK immediately, process async if needed

## Security Architecture

### Authentication

- **Provider:** Supabase Auth (SSR mode via `@supabase/ssr`)
- **Methods:** Email/password, Magic Link, OAuth (Google, GitHub)
- **Session:** HTTP-only cookies managed by Supabase middleware

```typescript
// server/lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) =>
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          ),
      },
    }
  );

  await supabase.auth.getUser(); // Refresh session
  return response;
}
```

### Authorization

- **Row Level Security (RLS):** Enabled on ALL Supabase tables
- **Policy Pattern:**
  ```sql
  -- Users can only access their own data
  CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);
  ```

### Input Validation

- **All inputs validated with Zod** before processing
- Validation happens in Server Actions, not services
- Return `VALIDATION_ERROR` code for invalid inputs

### Data Protection

- **PII Handling:**
  - Email addresses stored in Supabase Auth (not application tables)
  - Log redaction for sensitive fields
  - Sentry `beforeSend` filter for PII
- **API Keys:**
  - Stored in environment variables
  - Never exposed to client
  - Rotated quarterly

## Performance Considerations

### Caching Strategy

| Layer               | Tool        | TTL    | Use Case                       |
| ------------------- | ----------- | ------ | ------------------------------ |
| **CDN**             | Vercel Edge | 1 hour | Static assets, marketing pages |
| **ISR**             | Next.js     | 60s    | Landing page, pricing page     |
| **API Response**    | None        | -      | All data is fresh per-request  |
| **Trademark Cache** | In-memory   | 5 min  | Cache Signa.so results by name |

**Trademark Result Caching:**

```typescript
// server/services/trademark.ts
import { LRUCache } from "lru-cache";

const cache = new LRUCache<string, RiskResult>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
});

export async function checkTrademarkRisk(name: string): Promise<RiskResult> {
  const cached = cache.get(name);
  if (cached) return cached;

  const result = await fetchFromSigna(name);
  cache.set(name, result);
  return result;
}
```

### Background Jobs

**Tool:** Supabase Cron (pg_cron + pg_net extensions)

**Why Supabase Cron over Vercel Cron:**

- Tighter integration with Supabase ecosystem
- No separate CRON_SECRET needed (uses Vault for secrets)
- Jobs run within the database context with full access to data
- Supports invoking Edge Functions via HTTP

**Setup Requirements:**

1. Enable `pg_cron` and `pg_net` extensions in Supabase Dashboard
2. Store secrets in Vault for secure Edge Function invocation

```sql
-- Store secrets in Vault (run once in SQL Editor)
SELECT vault.create_secret(
  'https://[project-ref].supabase.co',
  'project_url'
);
SELECT vault.create_secret(
  '[service-role-key]',
  'service_role_key'
);
```

**Scheduled Jobs Pattern:**

```sql
-- Session cleanup: runs daily at midnight UTC
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

-- PDF queue processor: runs every 5 minutes
SELECT cron.schedule(
  'pdf-queue-processor',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/process-pdf-queue',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
```

**Edge Function Pattern:**

```typescript
// supabase/functions/cleanup-sessions/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Delete sessions older than 30 days
  const { error } = await supabase
    .from("naming_sessions")
    .delete()
    .lt(
      "created_at",
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    );

  if (error) {
    console.error("Cleanup failed:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
```

**PDF Generation Pattern (triggered by webhook):**

```typescript
// server/jobs/pdf-generation.ts
// Triggered by order.completed event via Polar webhook

export async function generateReportAsync(orderId: string) {
  // 1. Update order status to 'processing'
  await updateOrderStatus(orderId, "processing");

  // 2. Generate PDF (may take 5-15s)
  const pdfBuffer = await generatePdfReport(orderId);

  // 3. Upload to Supabase Storage
  const { data } = await supabase.storage
    .from("reports")
    .upload(`${orderId}.pdf`, pdfBuffer);

  // 4. Update report record with URL
  await db
    .update(reports)
    .set({ pdfUrl: data.path, generatedAt: new Date() })
    .where(eq(reports.orderId, orderId));

  // 5. Update order status to 'completed'
  await updateOrderStatus(orderId, "completed");
}
```

**Job Monitoring:**

```sql
-- View scheduled jobs
SELECT * FROM cron.job;

-- View recent job runs (last 24h)
SELECT * FROM cron.job_run_details
WHERE start_time > NOW() - INTERVAL '24 hours'
ORDER BY start_time DESC;

-- Unschedule a job
SELECT cron.unschedule('job-name');
```

**Limits:**

- Maximum 8 concurrent cron jobs recommended
- Jobs timeout after 10 minutes
- Use pg_net for async HTTP (non-blocking)

### Scalability Considerations

| Concern            | Current Approach | Scale Trigger | Future Solution                     |
| ------------------ | ---------------- | ------------- | ----------------------------------- |
| **Database**       | Supabase Pro     | >10k users    | Supabase Enterprise / Read replicas |
| **PDF Generation** | Sync in action   | >10s latency  | Supabase Edge Functions + Queue     |
| **Trademark API**  | Direct calls     | >100 req/min  | Caching + queue                     |
| **AI Requests**    | Direct to Gemini | >1000 req/day | Response caching, batching          |

## Deployment Architecture

### Platform Stack

| Service            | Provider     | Purpose                                   |
| ------------------ | ------------ | ----------------------------------------- |
| **Hosting**        | Vercel       | Next.js deployment, Edge Functions        |
| **Database**       | Supabase     | PostgreSQL, Auth, Storage, Realtime, Cron |
| **Payments**       | Polar.sh     | Merchant of Record, subscriptions         |
| **Error Tracking** | Sentry       | APM, error monitoring, session replay     |
| **Trademarks**     | Signa.so     | Trademark search API                      |
| **AI**             | Google Cloud | Gemini API                                |

### Environment Configuration

| Variable                        | Description                        | Required |
| ------------------------------- | ---------------------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL               | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key             | Yes      |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service key (server only) | Yes      |
| `DATABASE_URL`                  | Postgres connection string         | Yes      |
| `SENTRY_DSN`                    | Sentry project DSN                 | Yes      |
| `SENTRY_AUTH_TOKEN`             | Sentry release upload token        | Yes      |
| `GOOGLE_GENERATIVE_AI_API_KEY`  | Gemini API key                     | Yes      |
| `SIGNA_API_KEY`                 | Signa.so API key                   | Yes      |
| `POLAR_ACCESS_TOKEN`            | Polar.sh API token                 | Yes      |
| `POLAR_WEBHOOK_SECRET`          | Polar webhook signature secret     | Yes      |
| `POLAR_ORGANIZATION_ID`         | Polar organization ID              | Yes      |

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - run: npm ci

      - name: Type Check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Unit Tests
        run: npm run test

      - name: Build
        run: npm run build

  e2e:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E Tests
        run: npm run test:e2e
```

### Deployment Environments

| Environment     | Branch | URL              | Purpose    |
| --------------- | ------ | ---------------- | ---------- |
| **Production**  | `main` | `nyngi.com`      | Live users |
| **Preview**     | PRs    | `*.vercel.app`   | PR review  |
| **Development** | local  | `localhost:3000` | Local dev  |

### Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

## Development Environment

### Prerequisites

| Tool             | Version  | Installation                       |
| ---------------- | -------- | ---------------------------------- |
| **Node.js**      | 20.x LTS | [nodejs.org](https://nodejs.org)   |
| **npm**          | 10.x     | Included with Node.js              |
| **Supabase CLI** | Latest   | `npm install -g supabase`          |
| **Git**          | Latest   | [git-scm.com](https://git-scm.com) |

### Setup Commands

```bash
# Clone repository
git clone https://github.com/your-org/nyngi.git
cd nyngi

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Start Supabase locally (optional)
supabase start

# Push database schema
npm run db:push

# Start development server
npm run dev

# Run tests
npm run test           # Unit tests
npm run test:e2e       # E2E tests (requires dev server)
npm run test:coverage  # Coverage report
```

### npm Scripts

| Script          | Command                | Purpose                      |
| --------------- | ---------------------- | ---------------------------- |
| `dev`           | `next dev`             | Start dev server (Turbopack) |
| `build`         | `next build`           | Production build             |
| `start`         | `next start`           | Start production server      |
| `lint`          | `eslint`               | Run ESLint                   |
| `format`        | `oxfmt`                | Format code                  |
| `type-check`    | `tsc --noEmit`         | TypeScript validation        |
| `test`          | `vitest`               | Run unit tests               |
| `test:e2e`      | `playwright test`      | Run E2E tests                |
| `test:coverage` | `vitest --coverage`    | Coverage report              |
| `db:generate`   | `drizzle-kit generate` | Generate migrations          |
| `db:push`       | `drizzle-kit push`     | Apply schema                 |
| `db:studio`     | `drizzle-kit studio`   | Open Drizzle Studio          |

## Testing Patterns

### Test Organization

| Type            | Location             | Tool       | Purpose                       |
| --------------- | -------------------- | ---------- | ----------------------------- |
| **Unit**        | `tests/unit/`        | Vitest     | Services, stores, utilities   |
| **Integration** | `tests/integration/` | Vitest     | Server Actions with mocked DB |
| **E2E**         | `tests/e2e/`         | Playwright | Critical user flows           |

### Minimum Coverage Requirements

| Layer              | Target         | Rationale                          |
| ------------------ | -------------- | ---------------------------------- |
| **Services**       | 80%            | Business logic must be well-tested |
| **Server Actions** | 70%            | Input validation and auth flows    |
| **Components**     | 50%            | Interactive components only        |
| **E2E**            | Critical paths | Auth, naming, checkout flows       |

### Test Examples

```typescript
// tests/unit/services/risk-engine.test.ts
import { describe, it, expect, vi } from "vitest";
import { calculateRiskLevel } from "@/server/services/risk-engine";

describe("RiskEngine", () => {
  describe("calculateRiskLevel", () => {
    it("returns green for no conflicts", () => {
      const result = calculateRiskLevel({ conflicts: [] });
      expect(result).toBe("green");
    });

    it("returns amber for low similarity conflicts", () => {
      const result = calculateRiskLevel({
        conflicts: [{ similarity: 0.6, classes: ["42"] }],
      });
      expect(result).toBe("amber");
    });

    it("returns red for high similarity conflicts", () => {
      const result = calculateRiskLevel({
        conflicts: [{ similarity: 0.9, classes: ["9", "42"] }],
      });
      expect(result).toBe("red");
    });
  });
});

// tests/e2e/checkout.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Checkout Flow", () => {
  test("user can purchase de-risking report", async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');

    // Navigate to studio
    await page.goto("/studio");

    // Generate names
    await page.fill('[data-testid="chat-input"]', "Tech startup for AI tools");
    await page.click('[data-testid="send-button"]');
    await page.waitForSelector('[data-testid="name-card"]');

    // Click amber name
    await page.click('[data-testid="name-card"]:has([data-status="amber"])');

    // Verify upsell modal
    await expect(
      page.locator('[data-testid="risk-reveal-modal"]')
    ).toBeVisible();
    await expect(page.locator("text=$7.99")).toBeVisible();
  });
});
```

## Architecture Decision Records (ADRs)

### ADR-001: Drizzle ORM over Prisma

**Status:** Accepted  
**Date:** 2025-11-30  
**Context:** Need type-safe database access with minimal overhead.  
**Decision:** Use Drizzle ORM for database operations.  
**Rationale:** Stricter type safety at query level prevents "False Negative" risk bugs. Lighter than Prisma, no client generation step.  
**Consequences:** Team must learn Drizzle query syntax. No Prisma Studio (use Drizzle Studio instead).

### ADR-002: Polar.sh as Payment Provider

**Status:** Accepted  
**Date:** 2025-11-30  
**Context:** Need to sell De-Risking Reports with minimal tax/legal complexity.  
**Decision:** Use Polar.sh as Merchant of Record.  
**Rationale:** Handles VAT, sales tax, and compliance automatically. Built for developer products.  
**Consequences:** 10% fee on transactions. Limited payment method customization.

### ADR-003: Server Actions as Primary API

**Status:** Accepted  
**Date:** 2025-12-04  
**Context:** Multiple API patterns possible (REST, tRPC, GraphQL, Server Actions).  
**Decision:** Server Actions are the ONLY approved frontend-backend API pattern.  
**Rationale:** Type-safe by default, no API route boilerplate, works with React 19 features, simpler codebase.  
**Consequences:** No REST API for future mobile apps (will need to add later if needed).

### ADR-004: Vercel AI SDK for LLM Integration

**Status:** Accepted  
**Date:** 2025-11-30  
**Context:** Need to integrate LLM for Narrative Architect chat.  
**Decision:** Use Vercel AI SDK with Google Gemini.  
**Rationale:** Unified interface, streaming support, works seamlessly with Next.js App Router.  
**Consequences:** Vendor abstraction allows switching models easily. Must stay current with AI SDK updates.

### ADR-005: Signa.so for Trademark API

**Status:** Accepted  
**Date:** 2025-11-30  
**Context:** Need reliable trademark search with risk scoring.  
**Decision:** Use Signa.so as trademark search provider.  
**Rationale:** Unified search across 200+ trademark offices, AI-powered clearance analysis, sub-300ms response times.  
**Consequences:** Credit-based pricing, must implement caching to control costs.

### ADR-006: Pino + Sentry for Observability

**Status:** Accepted  
**Date:** 2025-12-04  
**Context:** Need structured logging and error tracking for production.  
**Decision:** Use Pino for logging, Sentry for APM and error tracking.  
**Rationale:** Pino is fastest JSON logger, Sentry provides full-stack observability with Next.js integration.  
**Consequences:** Must configure log drains for centralized logging. Sentry has volume-based pricing.

### ADR-007: Feature-Based Component Organization

**Status:** Accepted  
**Date:** 2025-12-04  
**Context:** Need scalable component organization as app grows.  
**Decision:** Organize components by feature, not by type.  
**Rationale:** Keeps related code together, easier navigation, clearer ownership.  
**Consequences:** May have some duplication. Must resist creating "utils" dumping ground.

### ADR-008: Supabase Cron over Vercel Cron

**Status:** Accepted  
**Date:** 2025-12-04  
**Context:** Need scheduled background jobs for session cleanup and PDF queue processing.  
**Decision:** Use Supabase Cron (pg_cron + pg_net extensions) instead of Vercel Cron.  
**Rationale:** Tighter Supabase integration, secrets stored in Vault, no separate CRON_SECRET needed, jobs run within DB context.  
**Consequences:** Requires enabling pg_cron/pg_net extensions. Edge Functions needed for HTTP endpoints. Max 8 concurrent jobs.

---

_Generated by BMAD Decision Architecture Workflow v1.0_
_Date: 4 December 2025_
_For: MG_
_Validation Status: Revised to address validation report findings_
