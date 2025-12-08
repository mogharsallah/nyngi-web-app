# Sprint Change Proposal: Session-Based Plan Selection

**Date:** 2025-12-07
**Trigger:** User Feedback on Monetization Strategy
**Status:** Approved & Documented

## 1. Issue Summary

**Problem:**
The original "Trojan Horse" segmentation model forced users to choose between "Lean Entrepreneur" and "High-Stakes Founder" profiles permanently upon onboarding. This was identified as:
1.  **User Unfriendly:** Users felt boxed in.
2.  **Inflexible:** A single user might have different needs for different projects (e.g., a quick side hustle vs. a serious startup).
3.  **Confusing:** The binary choice didn't map well to real-world usage patterns.

**Solution:**
Shift from **User-based Segmentation** to **Session-based Plan Selection**. Users now choose a "Velocity Plan" (Speed) or "Legacy Plan" (Safety) at the start of *each* naming project.

## 2. Impact Analysis

### Epic Impact
- **Epic 2 (Authentication):** Significant changes. Removed permanent segmentation from onboarding. Added "New User Welcome" to guide users to start a project.
- **Epic 3 (Core Naming):** The "Narrative Architect" system prompt must now be initialized based on the *session's* plan, not the user's profile.

### Artifact Conflicts Resolved
- **PRD/Brief:** Updated User Journey to include "Plan Selection" as Step 1.
- **Architecture:** Updated "Trojan Horse" pattern to be session-scoped.
- **Database Schema:** Moved `segment` from `user_profiles` to `naming_sessions` (renamed to `plan`).

## 3. Detailed Changes

### 3.1 Database Schema
**Table:** `user_profiles`
- **Removed:** `segment` column.

**Table:** `naming_sessions`
- **Added:** `plan` column (Enum: `'velocity' | 'legacy'`).

### 3.2 User Flows
**Old Flow:**
Register → Onboarding (Choose Segment) → Dashboard → Chat (Segment-locked)

**New Flow:**
Register → Dashboard (Empty State) → "Start New Project" → **Plan Selection** → Chat (Session-scoped)

### 3.3 State Management
**Zustand Store:** `sessionStore`
- **Removed:** `userType`
- **Added:** `currentSessionPlan`

## 4. Implementation Handoff

**Scope:** Moderate
**Route To:** Development Team

### Action Items for Developers:

1.  **Database Migration:**
    - Create migration to drop `segment` from `user_profiles`.
    - Add `plan` column to `naming_sessions`.
    - Update Drizzle schema files.

2.  **Frontend Updates:**
    - **Delete:** `components/features/auth/segmentation-prompt.tsx` (or refactor into `plan-selection.tsx`).
    - **Create:** `components/features/naming/plan-selection.tsx` (New component for Story 2.6).
    - **Update:** `components/features/onboarding/first-run-modal.tsx` (Simplify to generic welcome).
    - **Update:** `app/layout.tsx` / `providers` to remove segment checks.

3.  **Backend Logic:**
    - **Update:** `server/actions/naming.ts` to read plan from session input, not user profile.
    - **Update:** System prompts in `server/services/ai/narrative-architect.ts` to accept `plan` parameter.

4.  **Middleware:**
    - **Update:** `middleware.ts` to remove redirection logic based on `segment`.

## 5. Success Criteria
- Users can start multiple sessions with different plans.
- The AI persona correctly switches based on the selected plan for the current session.
- No "segmentation" step exists during sign-up.
