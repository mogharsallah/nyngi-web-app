# Sprint Change Proposal - 2025-12-07

**Trigger:** User request to re-prioritize Authentication features and move polish/advanced features to the final epic to accelerate MVP delivery.

## 1. Issue Summary
The initial plan for Epic 2 (User Authentication) included advanced features (Social Auth, Magic Links, UI Polish) that are not strictly necessary for the initial MVP. The user has requested to move these to the final epic (Epic 4) and mark completed items as Done.

## 2. Impact Analysis
*   **Epic 2 (Auth):** Significantly reduced scope. Focus shifts to "Basic Email/Password Auth" only.
*   **Epic 4 (Monetization):** Scope increases. Will now include "Social Auth", "Auth Polish", and "Email Verification" enforcement at the point of purchase.
*   **Risk:** Delaying email verification until purchase reduces friction for new users (good for "Lean" segment) but might lead to unverified accounts accumulating.
*   **Benefit:** Faster time-to-value for the core naming experience (Epic 3).

## 3. Recommended Approach
**Batch Update:** Apply all requested moves and status updates immediately.

## 4. Detailed Change Proposals

### Epic 2: User Authentication & Onboarding

**Story 2.1: Email/Password Registration Flow**
*   **Change:** Remove advanced ACs.
*   **Removed ACs:**
    *   Progress indicator
    *   Password visibility toggle
    *   Security context tooltip
    *   Password strength meter
    *   OR divider with Magic Link
    *   Accessibility & Mobile polish
*   **Status:** Remains "In Progress" (Basic auth implemented).

**Story 2.2: Email Verification Handling**
*   **Change:** Remove from Epic 2. Requirement moved to Epic 4 (Order Flow).

**Story 2.3: Social Authentication**
*   **Change:** Move entire story to Epic 4.

**Story 2.4: Login Flow**
*   **Change:** Mark as **(Done)**.

**Story 2.5: Password Reset Flow**
*   **Change:** Mark as **(Done)**.

### Epic 4: Monetization & Conversion

**Story 4.2: De-Risking Report Purchase Flow**
*   **Change:** Add Pre-requisite/Step: "User must verify email before purchase".

**New Story 4.9: Social Authentication**
*   **Source:** Moved from Story 2.3.
*   **Content:** Google & GitHub login implementation.

**New Story 4.10: Authentication Refinement**
*   **Source:** Moved from Story 2.1.
*   **Content:**
    *   Progress indicator
    *   Password visibility toggle
    *   Security context tooltip
    *   Password strength meter
    *   Magic Link integration
    *   Accessibility & Mobile polish

## 5. Implementation Handoff
*   **Scope:** Moderate (Backlog reorganization).
*   **Action:** Update `docs/epics.md` to reflect these changes.
