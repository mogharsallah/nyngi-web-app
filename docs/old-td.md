# Test Design: Epic 1 - Foundation & Infrastructure

**Date:** 3 December 2025
**Author:** GitHub Copilot (TEA Agent)
**Status:** Draft

---

## Executive Summary

**Scope:** Full test design for Epic 1 (Foundation & Infrastructure). This epic establishes the technical bedrock for the application.

**Risk Summary:**

- Total risks identified: 5
- High-priority risks (≥6): 3
- Critical categories: OPS, DATA, SEC

**Coverage Summary:**

- P0 scenarios: 3 (6 hours)
- P1 scenarios: 2 (2 hours)
- P2/P3 scenarios: 2 (1 hour)
- **Total effort:** 9 hours (~1.5 days)

---

## Risk Assessment

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description                                                                                                                        | Probability  | Impact       | Score | Mitigation                                                                                                | Owner   | Timeline |
| ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------ | ----- | --------------------------------------------------------------------------------------------------------- | ------- | -------- |
| R-102   | OPS      | Missing environment variables in production causing runtime crashes                                                                | 2 (Possible) | 3 (Critical) | 6     | Implement build-time environment variable validation (e.g., `t3-env` or manual check in `next.config.js`) | DevOps  | Sprint 1 |
| R-103   | DATA     | Database migration failure causing downtime or data inconsistency                                                                  | 2 (Possible) | 3 (Critical) | 6     | CI pipeline step to verify migrations; Automated backup before apply                                      | Backend | Sprint 1 |
| R-104   | SEC      | Unprotected Server Actions allowing unauthorized data access                                                                       | 2 (Possible) | 3 (Critical) | 6     | Implement a higher-order function/middleware for all actions that enforces auth checks by default         | Backend | Sprint 1 |
| R-106   | OPS      | No explicit APM (Application Performance Monitoring) solution mentioned. Missing Server-Timing headers, trace IDs for correlation. | 3 (Likely)   | 2 (Degraded) | 6     | Use Signoz for APM                                                                                        | DevOps  | Sprint 1 |

### Medium-Priority Risks (Score 3-4)

| Risk ID | Category | Description                                                         | Probability  | Impact       | Score | Mitigation                                                      | Owner    |
| ------- | -------- | ------------------------------------------------------------------- | ------------ | ------------ | ----- | --------------------------------------------------------------- | -------- |
| R-105   | TECH     | Hydration mismatches in Zustand stores causing UI flicker/errors    | 3 (Likely)   | 1 (Minor)    | 3     | Use `useHydration` hook pattern; Component tests for SSR        | Frontend |
| R-101   | SEC      | Accidental exposure of `SUPABASE_SERVICE_ROLE_KEY` to client bundle | 1 (Unlikely) | 3 (Critical) | 3     | Strict naming convention (`NEXT_PUBLIC_` prefix); Linting rules | DevOps   |
| R-107   | OPS      | No explicit health check endpoint (/api/health).                    | 2 (Possible) | 2 (Degraded) | 4     | A complete health check endpoint should be added                | Backend  |

---

## Test Coverage Plan

### P0 (Critical) - Run on every commit

**Criteria**: Blocks core functionality + High risk (≥6) + No workaround

| Requirement                | Test Level  | Risk Link | Test Count | Owner   | Notes                                               |
| -------------------------- | ----------- | --------- | ---------- | ------- | --------------------------------------------------- |
| Supabase Auth Middleware   | Integration | R-104     | 2          | Backend | Verify session refresh & redirect for unauth        |
| Database Schema/Migrations | Integration | R-103     | 1          | Backend | Verify `db:push` / migration apply works on test DB |
| Server Action Auth Wrapper | Integration | R-104     | 2          | Backend | Verify wrapper throws error when no session exists  |
| Health Check Endpoint      | Integration | R-107     | 1          | Backend | Verify /api/health returns 200 OK                   |

**Total P0**: 5 tests, 6 hours

### P1 (High) - Run on PR to main

**Criteria**: Important features + Medium risk (3-4) + Common workflows

| Requirement               | Test Level | Risk Link | Test Count | Owner    | Notes                                                |
| ------------------------- | ---------- | --------- | ---------- | -------- | ---------------------------------------------------- |
| Zustand Store Persistence | Unit       | R-105     | 2          | Frontend | Verify state persists to localStorage and rehydrates |
| App Shell Layout          | Component  | -         | 2          | Frontend | Verify responsive grid changes (Desktop vs Mobile)   |

**Total P1**: 4 tests, 2 hours

### P2 (Medium) - Run nightly/weekly

**Criteria**: Secondary features + Low risk (1-2) + Edge cases

| Requirement         | Test Level  | Risk Link | Test Count | Owner   | Notes                                           |
| ------------------- | ----------- | --------- | ---------- | ------- | ----------------------------------------------- |
| API Error Handling  | Unit        | -         | 2          | Backend | Verify standard error response format           |
| APM Tracing Headers | Integration | R-106     | 1          | DevOps  | Verify Server-Timing headers or trace IDs exist |

**Total P2**: 2 tests, 0.5 hours

### P3 (Low) - Run on-demand

**Criteria**: Nice-to-have + Exploratory + Performance benchmarks

| Requirement  | Test Level | Test Count | Owner    | Notes                             |
| ------------ | ---------- | ---------- | -------- | --------------------------------- |
| Font Loading | E2E        | 1          | Frontend | Verify Inter font loads correctly |

**Total P3**: 1 tests, 0.5 hours

---

## Execution Order

### Smoke Tests (<5 min)

- [ ] Build verification (Next.js build)
- [ ] Database connection check
- [ ] Landing page load (E2E)

### P0 Tests (<10 min)

- [ ] Auth Middleware redirects
- [ ] Server Action Auth Guard
- [ ] Schema Migration verification

### P1 Tests (<30 min)

- [ ] Zustand Store logic
- [ ] Layout responsiveness

---

## Resource Estimates

### Test Development Effort

| Priority  | Count  | Hours/Test | Total Hours | Notes                           |
| --------- | ------ | ---------- | ----------- | ------------------------------- |
| P0        | 5      | 1.2        | 6.0         | Infrastructure setup takes time |
| P1        | 4      | 0.5        | 2.0         | Standard component/unit tests   |
| P2        | 2      | 0.25       | 0.5         | Simple logic                    |
| P3        | 1      | 0.5        | 0.5         | Basic E2E                       |
| **Total** | **12** | **-**      | **9.0**     | **~1.5 days**                   |

### Prerequisites

**Test Data:**

- Test Database (Supabase local or separate project)
- Mock User Session (for Auth testing)

**Tooling:**

- Vitest (Unit/Integration)
- Playwright (E2E)
- Supabase CLI (Local Dev)

---

## Quality Gate Criteria

### Pass/Fail Thresholds

- **P0 pass rate**: 100%
- **P1 pass rate**: 100% (Infrastructure is critical)
- **High-risk mitigations**: 100% implemented

---

## Mitigation Plans

### R-102: Missing Env Vars (Score: 6)

**Mitigation Strategy:** Add a validation script (e.g., `env.mjs` with Zod) that runs during `next build` and fails if required vars are missing.
**Owner:** DevOps
**Timeline:** Sprint 1

### R-103: Migration Failure (Score: 6)

**Mitigation Strategy:** Use `drizzle-kit` checks in CI. Ensure `npm run db:generate` produces no changes (meaning migrations are up to date with schema) before deploy.
**Owner:** Backend
**Timeline:** Sprint 1

### R-104: Unprotected Actions (Score: 6)

**Mitigation Strategy:** Create a `authenticatedAction` wrapper function that checks `supabase.auth.getUser()` before executing the handler.
**Owner:** Backend
**Timeline:** Sprint 1

### R-106: Missing APM (Score: 6)

**Mitigation Strategy:** Use Signoz for APM.
**Owner:** DevOps
**Timeline:** Sprint 1

### R-107: Missing Health Check (Score: 4)

**Mitigation Strategy:** A complete health check endpoint should be added.
**Owner:** Backend
**Timeline:** Sprint 1

---

**Generated by**: BMad TEA Agent - Test Architect Module
**Workflow**: `.bmad/bmm/testarch/test-design`
