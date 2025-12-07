# Story 1.9: Testing Infrastructure Setup

**Status:** review

## Story

As a **developer**,
I want **Vitest and Playwright configured for unit and E2E testing**,
So that **code quality can be verified automatically**.

## Acceptance Criteria

| AC ID    | Criteria                                                                                                   | Source                               |
| -------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| AC-1.9.1 | Vitest is configured with `vitest.config.ts` and Next.js integration                                       | [Tech Spec: Story 1.9]               |
| AC-1.9.2 | Test file pattern is `tests/**/*.test.ts`                                                                  | [Tech Spec: Story 1.9]               |
| AC-1.9.3 | Coverage reporting is enabled                                                                              | [Tech Spec: Story 1.9]               |
| AC-1.9.4 | jsdom environment is configured for component tests                                                        | [Tech Spec: Story 1.9]               |
| AC-1.9.5 | Playwright is configured with `playwright.config.ts` and multiple browsers                                 | [Tech Spec: Story 1.9]               |
| AC-1.9.6 | Playwright base URL points to dev server                                                                   | [Tech Spec: Story 1.9]               |
| AC-1.9.7 | Screenshot on failure is enabled in Playwright                                                             | [Tech Spec: Story 1.9]               |
| AC-1.9.8 | E2E tests are located in `tests/e2e/`                                                                      | [Tech Spec: Story 1.9]               |
| AC-1.9.9 | npm scripts exist: `test`, `test:watch`, `test:e2e`, `test:coverage`                                       | [Tech Spec: Story 1.9]               |
| AC-1.9.10| Minimum coverage requirements are configured (Services 80%, Actions 70%, Components 50%)                   | [Tech Spec: Story 1.9]               |
| AC-1.9.11| Sample unit test exists verifying the setup works                                                          | [Tech Spec: Story 1.9]               |
| AC-1.9.12| Test organization mirrors source structure (`tests/unit/`, `tests/integration/`, `tests/e2e/`)             | [Tech Spec: Story 1.9]               |
| AC-1.9.13| authenticate setup is added in E2E (using magic link generation) to simplify building authenticated test scenarios                                          | [Tech Spec: Story 1.9]               |

## Tasks / Subtasks

- [x] **Task 1: Configure Vitest (Unit Testing)** (AC: 1.9.1, 1.9.2, 1.9.3, 1.9.4, 1.9.10)
  - [x] 1.1 Install Vitest and dependencies (`vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`)
  - [x] 1.2 Create `vitest.config.ts` with Next.js alias support and coverage settings
  - [x] 1.3 Configure coverage thresholds (80% services, 70% actions, 50% components)
  - [x] 1.4 Create `tests/setup.ts` for global test configuration

- [x] **Task 2: Configure Playwright (E2E Testing)** (AC: 1.9.5, 1.9.6, 1.9.7, 1.9.8)
  - [x] 2.1 Install Playwright (`@playwright/test`)
  - [x] 2.2 Create `playwright.config.ts` with webServer config (auto-start dev server)
  - [x] 2.3 Configure multi-browser support (Chromium, Firefox, WebKit)
  - [x] 2.4 Configure screenshot on failure and trace retention

- [x] **Task 3: Update npm Scripts & CI** (AC: 1.9.9)
  - [x] 3.1 Update `package.json` scripts: `test`, `test:watch`, `test:e2e`, `test:coverage`
  - [x] 3.2 Update `.github/workflows/ci.yml` to include `npx playwright install --with-deps`
  - [x] 3.3 Update `.github/workflows/ci.yml` to upload Playwright artifacts on failure

- [x] **Task 4: Create Test Structure & Samples** (AC: 1.9.11, 1.9.12)
  - [x] 4.1 Create directory structure: `tests/unit`, `tests/integration`, `tests/e2e`
  - [x] 4.2 Create sample unit test `tests/unit/sample.test.ts`
  - [x] 4.3 Create sample component test `tests/unit/components/ui/button.test.tsx`

- [x] **Task 5: Implement E2E Authenticate Setup** (AC: 1.9.13)
  - [x] 5.1 Create `tests/e2e/setup/authenticate.ts`
  - [x] 5.2 Implement magic link generation using `adminClient`
  - [x] 5.3 Verify setup

## Dev Notes

### Technical Implementation Details

**Vitest Configuration:**
- Use `vite-tsconfig-paths` to resolve `@/*` aliases.
- Use `jsdom` environment for React component testing.
- Exclude `node_modules`, `.next`, and `tests/e2e` from unit tests.

**Playwright Configuration:**
- `webServer` command: `npm run dev`.
- `baseURL`: `https://app.nyngi.local`.
- `projects`: Chromium, Firefox, WebKit.
- `use`: `trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`.

### Project Structure Notes

- `tests/unit/`: Mirrors `server/services`, `server/lib`, `components/lib`.
- `tests/integration/`: Mirrors `server/actions`.
- `tests/e2e/`: User flows.

### Learnings from Previous Story

**From Story 1.8 (CI Pipeline)**
- **CI Update Required**: The CI workflow needs `npx playwright install --with-deps` and artifact upload, which were deferred from Story 1.8.
- **Script Updates**: `package.json` scripts were placeholders; they need to be replaced with actual commands.
- **New Files**: `README.md` and `.env.example` were created/modified and should be maintained.

[Source: docs/sprint-artifacts/1-8-ci-pipeline-quality-checks.md#Dev-Agent-Record]

### References

- [Source: docs/sprint-artifacts/tech-spec-epic-1.md] - Technical Specification
- [Source: docs/architecture.md#Decision-Summary] - Testing tools (Vitest, Playwright)
- [Source: docs/epics.md#Story-1.9] - Acceptance criteria
- [Source: docs/sprint-artifacts/1-8-ci-pipeline-quality-checks.md] - Previous story context
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md]
- https://nextjs.org/docs/app/guides/testing/playwright
- https://nextjs.org/docs/app/guides/testing/vitest

## Change Log

| Date       | Author   | Change Description                     |
| ---------- | -------- | -------------------------------------- |
| 2025-12-07 | SM Agent | Initial story draft created from epics |
| 2025-12-07 | Dev Agent | Implemented testing infrastructure (Vitest + Playwright) |

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Claude Opus 4.5 (Preview)

### Debug Log References

- Task 1-5: Implemented Vitest and Playwright configurations
- All unit tests passing (10 tests)
- Type-check and lint passing
- Build successful

### Completion Notes List

- Vitest v4.0.15 configured with jsdom, @testing-library/react, coverage thresholds
- Playwright configured with Chromium, Firefox, WebKit, plus mobile viewports
- CI workflow updated with Playwright browser installation and artifact upload
- Sample unit test (4 tests) and Button component test (6 tests) created
- E2E authenticate setup using Supabase admin API for magic link generation
- Added `test:e2e:ui` script for Playwright UI mode

### File List

**New Files:**
- `vitest.config.ts` - Vitest configuration with coverage thresholds
- `playwright.config.ts` - Playwright configuration for multi-browser E2E
- `tests/setup.ts` - Global test setup with mocks
- `tests/unit/sample.test.ts` - Sample unit test
- `tests/unit/components/ui/button.test.tsx` - Button component test
- `tests/integration/.gitkeep` - Integration tests directory placeholder
- `tests/e2e/sample.spec.ts` - Sample E2E test
- `tests/e2e/setup/authenticate.ts` - E2E authentication helper

**Modified Files:**
- `package.json` - Updated test scripts, added dev dependencies
- `.github/workflows/ci.yml` - Added Playwright installation and artifact upload
