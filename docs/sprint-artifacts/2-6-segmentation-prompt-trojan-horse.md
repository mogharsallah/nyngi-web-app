# Story 2.6: Session Plan Selection

**Status:** ready-for-dev

## Story

As a **user**,
I want **to choose the right plan for my current project**,
So that **I get the appropriate level of depth and safety for my specific needs**.

## Acceptance Criteria

| AC ID    | Criteria                                                                                                             | Source                               |
| -------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| AC-2.6.1 | User is presented with Plan Selection screen after providing initial business details (Industry, Description)        | [Epics: Story 2.6]                   |
| AC-2.6.2 | **Plan A ("Velocity Plan")** is displayed with: Tagline "Name it. Claim it. Launch it.", Focus on Speed/Availability | [Epics: Story 2.6]                   |
| AC-2.6.3 | **Plan B ("Legacy Plan")** is displayed with: Tagline "Build a Brand That Lasts.", Focus on Defensibility/Safety     | [Epics: Story 2.6]                   |
| AC-2.6.4 | Selecting a plan creates a session with `plan: 'velocity' \| 'legacy'`                                               | [Epics: Story 2.6]                   |
| AC-2.6.5 | User is taken to Narrative Architect chat interface after selection                                                  | [Epics: Story 2.6]                   |
| AC-2.6.6 | AI system prompt is initialized with the selected plan's persona                                                     | [Epics: Story 2.6]                   |
| AC-2.6.7 | Plan selection applies **only to the current session**                                                               | [Epics: Story 2.6]                   |
| AC-2.6.8 | User can start a new session later with a different plan                                                             | [Epics: Story 2.6]                   |

## Tasks / Subtasks

- [ ] **Task 1: Update Database Schema** (AC: 2.6.4)
  - [ ] 1.1 Verify `naming_sessions` table in `server/lib/db/schema/public.ts` has `plan` enum column ('velocity', 'legacy')
  - [ ] 1.2 If missing, create migration to add `plan` column
  - [ ] 1.3 Remove `segment` from `user_profiles` table if present (cleanup from previous design)

- [ ] **Task 2: Update Session Store** (AC: 2.6.7, 2.6.8)
  - [ ] 2.1 Update `SessionState` in `components/lib/stores/session-store.ts` to include `currentSessionPlan`
  - [ ] 2.2 Add action `setSessionPlan(plan: 'velocity' | 'legacy')`
  - [ ] 2.3 Ensure `reset()` clears the plan selection
  - [ ] 2.4 Add unit tests for store updates in `tests/unit/stores/session-store.test.ts`

- [ ] **Task 3: Create Plan Selection Component** (AC: 2.6.2, 2.6.3)
  - [ ] 3.1 Create `components/features/onboarding/plan-selection.tsx`
  - [ ] 3.2 Implement UI for "Velocity" vs "Legacy" cards using shadcn/ui Card
  - [ ] 3.3 Add visual distinction (Electric Teal vs Indigo/Gold)
  - [ ] 3.4 Implement selection handler that calls `setSessionPlan` and server action
  - [ ] 3.5 Add component tests in `tests/unit/components/features/onboarding/plan-selection.test.tsx`

- [ ] **Task 4: Implement Server Action for Session** (AC: 2.6.4)
  - [ ] 4.1 Create/Update `createNamingSession` in `server/actions/naming.ts`
  - [ ] 4.2 Validate input using Zod (industry, description, plan)
  - [ ] 4.3 Insert into `naming_sessions` table
  - [ ] 4.4 Return session ID

- [ ] **Task 5: Integrate with Chat Interface** (AC: 2.6.1, 2.6.5, 2.6.6)
  - [ ] 5.1 Update `components/features/naming/chat-interface.tsx` to check `currentSessionPlan`
  - [ ] 5.2 If no plan selected, render `PlanSelection` component (or overlay)
  - [ ] 5.3 Pass selected plan to `NarrativeArchitect` system prompt generation
  - [ ] 5.4 Ensure `useChat` hook receives the correct initial system prompt

- [ ] **Task 6: E2E Testing** (AC: 2.6.1 - 2.6.8)
  - [ ] 6.1 Create `tests/e2e/naming-flow.spec.ts`
  - [ ] 6.2 Test flow: Start -> Input Details -> Select Plan -> Verify Chat Interface loads
  - [ ] 6.3 Verify session is persisted in DB (via API or UI check)

## Dev Notes

### Technical Implementation Details

**Architecture Pattern 1: The "Trojan Horse" Session Plan**
- This story implements the core "Trojan Horse" pattern defined in `docs/architecture.md`.
- **State Machine:** `[New Session] → [PlanSelection] → [Plan Selected] → [Chat Interface]`
- **Data Flow:**
  1. User starts new session (or first run)
  2. Check `session-store.currentSessionPlan` → if null, render `PlanSelection` overlay
  3. User selects plan → Update `currentSessionPlan` in store + persist to `naming_sessions.plan`
  4. `NarrativeArchitect` reads `currentSessionPlan` and adjusts system prompt.

**Database Schema:**
- `naming_sessions` table should already have `plan` column from Story 1.3.
- `plan` type should be an enum or check constraint: `'velocity' | 'legacy'`.

**UI/UX:**
- Use `aceternity` components if applicable for the "Elevated Creative" feel, or standard `shadcn/ui` with custom styling.
- "Velocity" = Speed, Teal/Cyan.
- "Legacy" = Safety, Indigo/Gold.

### Cross-Epic Context

**From Story 1.9 (Testing Infrastructure - Epic 1)**
- **Testing is Ready:** Vitest and Playwright are fully configured. Use `npm run test` for unit/component tests and `npm run test:e2e` for E2E.
- **Component Testing:** Use `tests/unit/components/ui/button.test.tsx` as a reference for testing `PlanSelection`.
- **E2E Auth:** Use the `authenticate` helper from `tests/e2e/setup/authenticate.ts` if the flow requires login (Story 2.6 implies user is logged in or anonymous? Epics say "User Authentication & Onboarding" is Epic 2, so likely authenticated).

[Source: docs/sprint-artifacts/1-9-testing-infrastructure-setup.md#Dev-Agent-Record]

### References

- [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Story-2.6-Plan-Selection] - Authoritative AC Source
- [Source: docs/architecture.md#Pattern-1-The-Trojan-Horse-Session-Plan] - Architecture Pattern
- [Source: docs/epics.md#Story-2.6] - Acceptance Criteria
- [Source: docs/sprint-artifacts/1-3-database-schema-design-migration-setup.md] - DB Schema Context
- [Source: docs/sprint-artifacts/1-6-zustand-state-management-setup.md] - Store Context

## Dev Agent Record

### Context Reference
- [Context File](docs/sprint-artifacts/2-6-segmentation-prompt-trojan-horse.context.xml)

## Change Log

| Date       | Author   | Change Description                     |
| ---------- | -------- | -------------------------------------- |
| 2025-12-08 | SM Agent | Initial story draft created from epics |
