# Epic Technical Specification: User Authentication & Onboarding

Date: 2025-12-08
Author: MG
Epic ID: 2
Status: Draft

---

## Overview

Epic 2, "User Authentication & Onboarding," establishes the secure entry point for the application and, critically, implements the "Trojan Horse" segmentation strategy. This epic goes beyond standard authentication by integrating the business model's core bifurcation—separating "Lean Entrepreneurs" (Velocity Plan) from "High-Stakes Founders" (Legacy Plan)—directly into the onboarding flow. It ensures that every user interaction from the first moment is personalized to their specific risk/speed profile.

## Objectives and Scope

### In-Scope
*   **Onboarding & Segmentation:** Implementation of the "Plan Selection" screen (Velocity vs. Legacy) which initializes the naming session context.
*   **User Profile:** Basic profile display in the application shell and secure Sign Out functionality.
*   **First Run Experience:** A guided welcome overlay that bridges the gap between registration and the first naming session.

### Out-of-Scope
*   **Payment Processing:** Actual purchase of plans or reports (handled in Epic 4).
*   **Name Generation:** The actual chat interaction and generation logic (handled in Epic 3).
*   **Advanced Profile Settings:** Editing user details, changing avatars, or managing account deletion (Future).
*   **Multi-Factor Authentication (MFA):** Deferred to future security hardening.

## System Architecture Alignment

This epic aligns with the **Foundation (Epic 1)** architecture by leveraging:
*   **Supabase Auth:** As the primary identity provider, managing `auth.users` and JWT handling.
*   **Drizzle ORM:** For managing the application-side `user_profiles` and `naming_sessions` tables.
*   **Zustand Stores:** Specifically `session-store` to manage the ephemeral `currentSessionPlan` state, decoupling it from the persistent user profile.
*   **Server Actions:** All authentication mutations (`signIn`, `signUp`, etc.) are implemented as Server Actions, adhering to the project's API pattern.
*   **Middleware:** Next.js Middleware for edge-compatible route protection.

## Detailed Design

### Services and Modules

| Module | Responsibility | Owner | Inputs | Outputs |
| :--- | :--- | :--- | :--- | :--- |
| **Session Store** (`components/lib/stores/session-store.ts`) | Manage client-side session state (`user`, `currentSessionPlan`). | Client | User actions | State updates |
| **Plan Selection** (`components/features/onboarding/plan-selection.tsx`) | UI for selecting Velocity vs. Legacy plan. | Client | User selection | `naming_sessions` update |

### Data Models and Contracts

**`public.user_profiles`**
*   Extends Supabase `auth.users`.
*   **Schema:**
    *   `id`: uuid (PK, FK to `auth.users.id`)
    *   `email`: text (not null)
    *   `full_name`: text
    *   `avatar_url`: text
    *   `first_run_completed`: boolean (default: false)
    *   `created_at`: timestamp
    *   `updated_at`: timestamp

**`public.naming_sessions`** (Updated from Epic 1)
*   **Schema:**
    *   `id`: uuid (PK)
    *   `user_id`: uuid (FK to `user_profiles.id`)
    *   `plan`: enum ('velocity', 'legacy') (NOT NULL)
    *   `criteria`: jsonb
    *   `created_at`: timestamp

### APIs and Interfaces

**Server Actions (`server/actions/naming.ts`)**

```typescript
// Create Session (Plan Selection)
function createSession(plan: 'velocity' | 'legacy'): Promise<ActionResponse<{ sessionId: string }>>
```

*Note: Standard authentication actions (`signUp`, `signIn`, `signOut`, `resetPassword`) are already implemented in the Foundation layer (Epic 1) and are available for use.*

### Workflows and Sequencing

**1. Registration & Onboarding Flow**
1.  User submits Sign Up form.
2.  System creates `auth.users` record and triggers email verification.
3.  User verifies email and logs in.
4.  System checks `user_profiles.first_run_completed`.
5.  If `false`, show **Welcome Overlay**.
6.  User clicks "Start New Project".
7.  System presents **Plan Selection** (Velocity vs. Legacy).
8.  User selects plan.
9.  System creates `naming_sessions` record with selected `plan`.
10. System updates `user_profiles.first_run_completed = true`.
11. Redirect to Studio (Epic 3).

**2. Login Flow**
1.  User submits Sign In form.
2.  System validates credentials via Supabase.
3.  Middleware establishes session cookie.
4.  Redirect to Dashboard.

## Non-Functional Requirements

### Performance
*   **Login Latency:** Authentication operations should complete in < 1s (excluding network latency).
*   **First Contentful Paint (FCP):** Dashboard should load in < 1.5s for authenticated users.

### Security
*   **Session Handling:** Use HttpOnly, Secure, SameSite cookies (Supabase default).
*   **Route Protection:** All `/app/*` routes must be protected by Middleware.
*   **Data Validation:** All inputs validated via Zod schemas before processing.

### Reliability/Availability
*   **Auth Uptime:** Rely on Supabase SLA (99.9%).
*   **Fallback:** Graceful error handling for social auth failures (e.g., "Account exists with different provider").

### Observability
*   **Logging (Pino):**
    *   **Info Level:**
        *   `onboarding.welcome.viewed`: { userId } - User presented with first-run overlay.
        *   `onboarding.plan.selected`: { userId, plan } - User made a segmentation choice.
        *   `naming.session.created`: { sessionId, userId, plan } - Session successfully initialized.
        *   `auth.sign_out`: { userId } - User explicitly signed out.
    *   **Error Level:**
        *   `onboarding.session_creation.failed`: { userId, plan, error } - Critical failure in segmentation flow.
*   **Sentry Tracing:**
    *   Instrument `createSession` server action to track latency of DB writes during plan selection.
    *   Tag transactions with `plan_type` ('velocity' vs 'legacy') to analyze performance differences.

## Dependencies and Integrations

*   **Supabase Auth:** Core identity provider (`@supabase/ssr`, `@supabase/auth-helpers-nextjs`).
*   **Zustand:** Client state management (`zustand`).
*   **Zod:** Schema validation (`zod`).
*   **React Hook Form:** Form handling (`react-hook-form`).
*   **Radix UI / shadcn/ui:** UI components (`dropdown-menu`, `dialog`, `form`, `input`).

## Acceptance Criteria (Authoritative)

**Story 2.6: Plan Selection (Segmentation)**
*   [ ] "Start New Project" triggers Plan Selection screen.
*   [ ] User sees "Velocity" and "Legacy" plan options with distinct visuals.
*   [ ] Selecting a plan creates a new `naming_sessions` record with correct `plan` enum.
*   [ ] Selection applies only to current session.

**Story 2.8: Profile & Sign Out**
*   [ ] Profile menu displays user email.
*   [ ] "Sign Out" clears session and redirects to `/login`.
*   [ ] "Sign Out" clears client-side Zustand stores.

**Story 2.9: First Run Experience**
*   [ ] New users see Welcome Overlay on first dashboard visit.
*   [ ] Overlay can be dismissed.
*   [ ] `first_run_completed` flag is updated in DB.

## Traceability Mapping

| Acceptance Criteria | Spec Section | Component / API | Test Idea |
| :--- | :--- | :--- | :--- |
| Plan Selection | Detailed Design | `createSession` Action | Verify `naming_sessions.plan` value |
| Sign Out | Detailed Design | `signOut` Action | Verify cookies cleared & store reset |

## Test Strategy

*   **Unit Tests:** Test `session-store` logic and Zod schemas.
*   **E2E Tests (Playwright):**
    *   Plan Selection Flow (Verify session created).
    *   First Run Experience (Welcome Overlay).

## Post-Review Follow-ups

*   **Story 2.6 (Plan Selection):**
    *   [ ] [High] Implement "Input Details" form or integration in `ChatInterface` to replace hardcoded data (AC-2.6.1)
    *   [ ] [High] Update E2E test to cover the full flow including Input Details (Task 6.2)

