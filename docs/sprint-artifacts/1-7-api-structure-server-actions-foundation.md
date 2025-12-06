# Story 1.7: API Structure & Server Actions Foundation

**Status:** review

## Story

As a **developer**,
I want **server actions organized by domain with consistent patterns**,
So that **business logic is centralized and type-safe**.

## Acceptance Criteria

| AC ID    | Criteria                                                                                                   | Source                               |
| -------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| AC-1.7.1 | (Removed) Auth actions handled by Supabase client/middleware                                               | [N/A]                                |
| AC-1.7.2 | `server/actions/naming.ts` exists with placeholder implementations                                         | [Tech Spec: Story 1.7 AC]            |
| AC-1.7.3 | `server/actions/orders.ts` exists with placeholder implementations                                         | [Tech Spec: Story 1.7 AC]            |
| AC-1.7.4 | All actions return `ActionResponse<T>` type                                                                | [Tech Spec: Story 1.7 AC]            |
| AC-1.7.5 | All actions validate input using Zod schemas                                                               | [Tech Spec: Story 1.7 AC]            |
| AC-1.7.6 | All actions check authentication before processing                                                         | [Tech Spec: Story 1.7 AC]            |
| AC-1.7.7 | All actions log via Pino with structured pattern: `{ action, userId, duration }`                           | [Tech Spec: Story 1.7 AC]            |
| AC-1.7.8 | `server/services/trademark.ts` placeholder exists for Signa.so API integration                             | [Epics: Story 1.7]                   |
| AC-1.7.9 | `server/services/risk-engine.ts` placeholder exists for risk calculation logic                             | [Epics: Story 1.7]                   |
| AC-1.7.10| `server/services/report-generator.ts` placeholder exists for React-PDF generation                         | [Epics: Story 1.7]                   |

## Tasks / Subtasks

- [x] **Task 1: Define ActionResponse Types** (AC: 1.7.4)
  - [x] 1.1 Create `server/types/actions.ts` with ActionResponse<T> and ErrorCode types
  - [x] 1.2 Export types for use across all server actions

- [x] **Task 2: Create Safe Action Utility** (AC: 1.7.5, 1.7.6, 1.7.7)
  - [x] 2.1 Verify `server/lib/logger/index.ts` exists
  - [x] 2.2 Create `server/lib/actions/safe-action.ts`
  - [x] 2.3 Implement `authenticatedAction` wrapper
  - [x] 2.4 Integrate Zod validation, Supabase `getClaim` check, and Pino logging
  - [x] 2.5 Handle errors and return consistent `ActionResponse`

- [x] **Task 3: Create Naming Actions (Placeholder)** (AC: 1.7.2, 1.7.4, 1.7.5, 1.7.6, 1.7.7)
  - [x] 3.1 Create `server/actions/naming.ts` with 'use server' directive
  - [x] 3.2 Implement `createSession` placeholder using `authenticatedAction`
  - [x] 3.3 Implement `generateNames` placeholder using `authenticatedAction`
  - [x] 3.4 Implement `toggleFavorite` placeholder using `authenticatedAction`
  - [x] 3.5 Add Zod schemas for input validation

- [x] **Task 4: Create Orders Actions (Placeholder)** (AC: 1.7.3, 1.7.4, 1.7.5, 1.7.6, 1.7.7)
  - [x] 4.1 Create `server/actions/orders.ts` with 'use server' directive
  - [x] 4.2 Implement `createOrder` placeholder using `authenticatedAction`
  - [x] 4.3 Implement `getOrderHistory` placeholder using `authenticatedAction`
  - [x] 4.4 Add Zod schemas for input validation

- [x] **Task 5: Create Service Placeholders** (AC: 1.7.8, 1.7.9, 1.7.10)
  - [x] 5.1 Create `server/services/trademark.ts` with LRU cache interface stub
  - [x] 5.2 Create `server/services/risk-engine.ts` with risk calculation interface stub
  - [x] 5.3 Create `server/services/report-generator.ts` with PDF generation interface stub
  - [x] 5.4 Add proper TypeScript interfaces and JSDoc documentation

- [x] **Task 6: Integration Verification**
  - [x] 6.1 Verify actions can be imported in client components
  - [x] 6.2 Verify TypeScript compilation passes
  - [x] 6.3 Test one action end-to-end (simple placeholder)

## Dev Notes

### Technical Implementation Details

**Directory Structure:**

```
server/
├── actions/
│   ├── naming.ts       # createSession, generateNames, toggleFavorite
│   └── orders.ts       # createOrder, getOrderHistory
├── services/
│   ├── trademark.ts    # Signa.so API integration (placeholder)
│   ├── risk-engine.ts  # Risk calculation logic (placeholder)
│   └── report-generator.ts # React-PDF generation (placeholder)
├── lib/
│   ├── actions/
│   │   └── safe-action.ts # authenticatedAction wrapper
│   └── logger/
│       └── index.ts    # Pino configuration
└── types/
    └── actions.ts      # ActionResponse, ErrorCode types
```

**ActionResponse Pattern:**
[Source: docs/sprint-artifacts/tech-spec-epic-1.md#APIs-and-Interfaces]

```typescript
type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: ErrorCode };

type ErrorCode =
  | "AUTH_REQUIRED"     // User not authenticated
  | "FORBIDDEN"         // User lacks permission
  | "VALIDATION_ERROR"  // Invalid input (Zod)
  | "NOT_FOUND"         // Resource doesn't exist
  | "CONFLICT"          // Duplicate or state conflict
  | "EXTERNAL_ERROR"    // Third-party API failure
  | "INTERNAL_ERROR";   // Unexpected server error
```

**Authenticated Action Wrapper Pattern:**

```typescript
// server/lib/actions/safe-action.ts
import { z } from 'zod';
import { createClient } from '@/server/lib/supabase/server';
import { logger } from '@/server/lib/logger';
import type { ActionResponse } from '@/server/types/actions';

export function authenticatedAction<TInput, TOutput>(
  schema: z.Schema<TInput>,
  handler: (input: TInput, userId: string) => Promise<TOutput>
) {
  return async (input: TInput): Promise<ActionResponse<TOutput>> => {
    const startTime = Date.now();
    const actionName = handler.name || 'anonymous_action';

    try {
      // 1. Input Validation
      const validated = schema.safeParse(input);
      if (!validated.success) {
        logger.warn({ action: actionName, error: validated.error }, 'Validation failed');
        return { success: false, error: 'Invalid input', code: 'VALIDATION_ERROR' };
      }

      // 2. Auth Check
      const supabase = await createClient();
      const { data, error: authError } = await supabase.auth.getClaims();

      if (authError || !data || !data.claims.sub) {
        logger.warn({ action: actionName, error: authError }, 'Authentication required');
        return { success: false, error: 'Authentication required', code: 'AUTH_REQUIRED' };
      }

      const userId = data.claims.sub

      // 3. Execution
      const result = await handler(validated.data, userId);

      // 4. Logging
      logger.info({ action: actionName, userId, duration: Date.now() - startTime }, 'Action completed');
      
      return { success: true, data: result };
    } catch (error) {
      logger.error({ action: actionName, error }, 'Unexpected error');
      return { success: false, error: 'An unexpected error occurred', code: 'INTERNAL_ERROR' };
    }
  };
}
```

**Usage Example:**

```typescript
// server/actions/naming.ts
'use server';

import { z } from 'zod';
import { authenticatedAction } from '@/server/lib/actions/safe-action';

const CreateSessionSchema = z.object({
  industry: z.string(),
  description: z.string(),
});

export const createSession = authenticatedAction(
  CreateSessionSchema,
  async (input, userId) => {
    // Business logic here
    return { sessionId: '123' };
  }
);
```

### Project Structure Notes

- **Actions Location**: `server/actions/` as per architecture
- **Services Location**: `server/services/` for business logic
- **Types Location**: `server/types/` for shared action types
- **Naming Convention**: `kebab-case` for filenames, `camelCase` for functions

### Learnings from Previous Story

**From Story 1-6-zustand-state-management-setup (Status: review)**

- **Store Pattern**: Successfully implemented Zustand with persist middleware and hydration handling
- **File Organization**: `components/lib/stores/` pattern works well; services follow similar `server/services/` structure
- **TypeScript Interfaces**: Define interfaces within the file if specific, or in shared types folder if reused
- **Testing Deferred**: Unit tests deferred to Story 1.9 per plan - same applies here

[Source: docs/sprint-artifacts/1-6-zustand-state-management-setup.md#Dev-Agent-Record]

### Dependencies

- **Zod**: v4.1.13 (already installed per package.json)
- **Pino**: v10.1.0 (already installed per package.json)
- **@supabase/ssr**: v0.7.0 (already installed per package.json)

### References

- [Source: docs/architecture.md#Server-Actions-Pattern] - ActionResponse pattern
- [Source: docs/architecture.md#Observability] - Pino logger configuration
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Story-1.7-Server-Actions] - Acceptance criteria
- [Source: docs/epics.md#Story-1.7] - Functional requirements
- [Source: docs/architecture.md#ADR-003] - Server Actions as Primary API

## Change Log

| Date       | Author    | Change Description                                     |
| ---------- | --------- | ------------------------------------------------------ |
| 2025-12-06 | SM Agent  | Initial story draft created from tech spec and epics  |

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

- Implemented `ActionResponse` and `ErrorCode` types in `server/types/actions.ts`.
- Created `authenticatedAction` wrapper in `server/lib/actions/safe-action.ts` with Zod validation, Supabase auth check, and Pino logging.
- Implemented placeholder actions for Naming (`server/actions/naming.ts`) and Orders (`server/actions/orders.ts`).
- Created service placeholders for Trademark, Risk Engine, and Report Generator in `server/services/`.
- Verified TypeScript compilation and client import capability.
- Updated `drizzle-kit` to `^0.31.7` to fix TypeScript errors.

### File List

- server/types/actions.ts
- server/lib/actions/safe-action.ts
- server/actions/naming.ts
- server/actions/orders.ts
- server/services/trademark.ts
- server/services/risk-engine.ts
- server/services/report-generator.ts
