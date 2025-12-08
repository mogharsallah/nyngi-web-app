# Story 2.9: First Run Experience & Segment-Aware Welcome

Status: ready-for-dev

## Story

As a newly registered user,
I want a guided welcome that helps me start my first project,
so that I immediately understand how to use the app.

## Acceptance Criteria

1. **Welcome Overlay:**
   - Appears ONLY on the first visit to the dashboard/studio (checked via `user_profiles.first_run_completed`).
   - Displays Headline: "Welcome to Name Your Next Great Idea! 🚀".
   - Displays Subtext: "Let's find the perfect name for your venture.".
   - Primary CTA: "Start New Project" -> Triggers Plan Selection (Story 2.6).
   - Secondary Action: "Explore Dashboard" -> Dismisses overlay.
2. **Behavior & Animation:**
   - Animates in smoothly (fade + slide up).
   - On Mobile: Full-screen takeover with clear touch targets.
   - Can be dismissed and is never shown again (persisted in DB).
3. **Post-Dismissal State:**
   - User lands on the dashboard (empty state).
   - "Start New Project" button is prominent in the UI to allow restarting the flow.
4. **Data Persistence:**
   - `first_run_completed` flag in `user_profiles` is updated to `true` upon interaction (Start or Skip).

## Tasks / Subtasks

- [ ] Database Schema Update (AC: #4)
  - [ ] Add `first_run_completed` boolean column to `user_profiles` table (default: false).
  - [ ] Generate and push migration.
- [ ] Server Action Updates (AC: #4)
  - [ ] Update `server/actions/auth.ts` (or create `user.ts`) to include `completeFirstRun` action.
  - [ ] Ensure `getUserProfile` returns `first_run_completed` status.
- [ ] Component Implementation: `FirstRunModal` (AC: #1, #2)
  - [ ] Create `components/features/onboarding/first-run-modal.tsx`.
  - [ ] Implement UI with Headline, Subtext, CTA, and Skip link.
  - [ ] Add Aceternity UI spotlight effect (optional/if available) or smooth CSS animations.
  - [ ] Implement responsive design (Modal on desktop, Full-screen on mobile).
- [ ] Integration (AC: #1, #3)
  - [ ] Integrate `FirstRunModal` into `app/studio/page.tsx` (or `app/studio/layout.tsx`).
  - [ ] Connect "Start New Project" to Plan Selection flow (Story 2.6).
  - [ ] Connect "Explore Dashboard" to simple dismissal.
- [ ] Testing (AC: #1, #2, #3, #4)
  - [ ] Unit test `FirstRunModal` rendering.
  - [ ] E2E test: Register new user -> Verify Modal appears -> Interact -> Verify DB update -> Refresh -> Verify Modal does not reappear.

## Dev Notes

- **Architecture Alignment:**
  - Use `components/features/onboarding/` for the component.
  - Use Server Actions for updating the user profile.
  - Use `Zustand` if complex state is needed, but local state + Server Action might suffice for this modal.
- **UX Details:**
  - The "Start New Project" button should ideally trigger the same action as the main "New Project" button in the dashboard.
  - Ensure the "Trojan Horse" segmentation (Plan Selection) is the immediate next step after clicking "Start New Project".

### Project Structure Notes

- `components/features/onboarding/` does not exist yet, create it.
- `server/lib/db/schema/public.ts` needs modification.

### References

- [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Story-2.9-First-Run-Experience] (Authoritative ACs)
- [Source: docs/epics.md#Story-2.9-New-User-Welcome]
- [Source: docs/architecture.md#Project-Structure]
- [Source: docs/ux-design-specification.md#Journey-1-The-Lean-Entrepreneur]

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/2-9-first-run-experience-segment-aware-welcome.context.xml

### Agent Model Used

Gemini 3 Pro (Preview)

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-08 | Story validated; added tech spec citation, AC refs to tasks | SM Agent |
