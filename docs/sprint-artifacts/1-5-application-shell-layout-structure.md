# Story 1.5: Application Shell & Layout Structure

Status: done

## Story

As a **user**,
I want **a consistent application layout with proper navigation structure**,
So that **I can navigate the app intuitively across all pages**.

## Acceptance Criteria

| AC ID    | Criteria                                                                                                                | Source                               |
| -------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| AC-1.5.1 | `app/layout.tsx` includes global providers (Theme, Toast)                                                               | [Tech Spec: Story 1.5 AC]            |
| AC-1.5.2 | `app/auth/layout.tsx` exists for unauthenticated routes                                                                 | [Tech Spec: Story 1.5 AC]            |
| AC-1.5.3 | Desktop layout (>1024px) uses CSS Grid with `30%/70%` Chat/Canvas split                                                 | [Epics: Story 1.5], [Architecture]   |
| AC-1.5.4 | Tablet layout (768-1024px) uses `35%/65%` split                                                                         | [Epics: Story 1.5]                   |
| AC-1.5.5 | Mobile layout (<768px) uses responsive top header with view toggle (Chat/Canvas segmented control)                      | [Tech Spec: Story 1.5 AC]            |
| AC-1.5.6 | Loading states use Skeleton components from shadcn/ui                                                                   | [Tech Spec: Story 1.5 AC]            |
| AC-1.5.7 | Layout components are placed in `components/shared/`                                                                    | [Tech Spec: Story 1.5 AC]            |
| AC-1.5.8 | Route group layouts exist: `app/studio/layout.tsx`, `app/reports/layout.tsx`, `app/orders/layout.tsx`                   | [Epics: Story 1.5]                   |
| AC-1.5.9 | Root layout has proper `<html>` with lang attribute and SEO metadata defaults                                           | [Epics: Story 1.5]                   |

## Tasks / Subtasks

- [x] **Task 1: Configure root layout with providers** (AC: 1.5.1, 1.5.9)
  - [x] 1.1 Update `app/layout.tsx` with proper `<html lang="en">` attribute
  - [x] 1.2 Add SEO metadata defaults (title, description, OpenGraph)
  - [x] 1.3 Create `components/providers/theme-provider.tsx` using next-themes
  - [x] 1.4 Create `components/providers/toast-provider.tsx` using shadcn/ui Toaster
  - [x] 1.5 Wrap children with ThemeProvider and ToastProvider in root layout
  - [x] 1.6 Verify providers don't cause hydration mismatches (use `suppressHydrationWarning`)

- [x] **Task 2: Create auth layout for unauthenticated routes** (AC: 1.5.2)
  - [x] 2.1 Create `app/auth/layout.tsx` with centered card layout
  - [x] 2.2 Add minimal branding/logo header
  - [x] 2.3 Ensure layout is responsive (full-width on mobile, max-w-md centered on desktop)

- [x] **Task 3: Create Studio layout with responsive split view** (AC: 1.5.3, 1.5.4, 1.5.5, 1.5.7, 1.5.8)
  - [x] 3.1 Create `components/shared/studio-layout.tsx` with CSS Grid
  - [x] 3.2 Implement desktop split: `grid-cols-[30%_70%]` for >1024px
  - [x] 3.3 Implement tablet split: `md:grid-cols-[35%_65%]` for 768-1024px
  - [x] 3.4 Add mobile view toggle (segmented control) to header for Chat/Canvas switching
  - [x] 3.5 Implement view switching state (Chat/Canvas) for mobile using header toggle
  - [x] 3.6 Ensure header remains fixed at top on mobile with proper safe area padding
  - [x] 3.7 Create `app/studio/layout.tsx` that wraps children with StudioLayout
  - [x] 3.8 Add 44x44px minimum touch targets for mobile header controls

- [x] **Task 4: Create additional route group layouts** (AC: 1.5.8)
  - [x] 4.1 Create `app/reports/layout.tsx` with appropriate structure
  - [x] 4.2 Create `app/orders/layout.tsx` with appropriate structure
  - [x] 4.3 Ensure consistent header/navigation across authenticated routes

- [x] **Task 5: Implement loading states with Skeletons** (AC: 1.5.6)
  - [x] 5.1 Create `app/studio/loading.tsx` with split-view skeleton
  - [x] 5.2 Create `app/reports/loading.tsx` with list skeleton
  - [x] 5.3 Create `app/orders/loading.tsx` with table skeleton
  - [x] 5.4 Use shadcn/ui `Skeleton` component for all loading states

- [x] **Task 6: Create shared layout components** (AC: 1.5.7)
  - [x] 6.1 Create `components/shared/header.tsx` with navigation and user menu placeholder
  - [x] 6.2 Ensure all shared components follow existing style patterns
  - [x] 6.3 Export all shared components from an index file

- [ ] **Task 7: Testing and verification** (AC: All) - Deferred to Story 1.9
  - [ ] 7.1 Write E2E test verifying desktop viewport shows 30/70 split
  - [ ] 7.2 Write E2E test verifying mobile viewport shows top header with view toggle
  - [ ] 7.3 Write E2E test verifying loading states show skeletons
  - [ ] 7.4 Manual verification of responsive breakpoints

## Dev Notes

### Technical Implementation Details

**Provider Setup Pattern:**

```typescript
// components/providers/theme-provider.tsx
"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
```

**Studio Layout Grid Pattern:**

```typescript
// Desktop (>1024px): 30% Chat / 70% Canvas
// Tablet (768-1024px): 35% / 65%
// Mobile (<768px): Full-screen with top header view toggle
<div className="grid lg:grid-cols-[30%_70%] md:grid-cols-[35%_65%] grid-cols-1 h-screen">
  <ChatPanel className="hidden md:block" />
  <CanvasPanel className="hidden md:block" />
  {/* Mobile: Show one panel based on state */}
</div>
```

**Mobile Header with View Toggle:**

```typescript
// components/shared/mobile-header.tsx
// Fixed top, safe area aware, 44px touch targets
<header className="fixed top-0 left-0 right-0 md:hidden bg-background border-b pt-safe z-50">
  <div className="flex items-center justify-between h-14 px-4">
    <Logo className="h-8" />
    {/* View Toggle - Segmented Control */}
    <div className="flex bg-muted rounded-lg p-1">
      <button 
        className={cn("px-3 py-1.5 rounded-md min-h-[44px] min-w-[44px] text-sm font-medium", 
          activeView === 'chat' && "bg-background shadow-sm")}
      >
        Chat
      </button>
      <button 
        className={cn("px-3 py-1.5 rounded-md min-h-[44px] min-w-[44px] text-sm font-medium",
          activeView === 'canvas' && "bg-background shadow-sm")}
      >
        Canvas
      </button>
    </div>
    <ProfileMenu />
  </div>
</header>
```

### Project Structure Notes

**Existing Files:**
- `app/layout.tsx` - Root layout (needs enhancement)
- `app/page.tsx` - Landing page
- `app/globals.css` - Global styles
- `app/auth/` - Auth route group (already exists)
- `components/ui/` - shadcn/ui components (Skeleton available)
- `components/providers/` - Providers directory (exists)

**Files to Create:**
- `components/providers/theme-provider.tsx` - Theme provider wrapper
- `components/providers/toast-provider.tsx` - Toast provider wrapper (or use Toaster directly)
- `components/shared/studio-layout.tsx` - Studio split view layout
- `components/shared/mobile-header.tsx` - Mobile responsive header with view toggle
- `components/shared/header.tsx` - Shared header component
- `app/studio/layout.tsx` - Studio route layout
- `app/studio/loading.tsx` - Studio loading state
- `app/reports/layout.tsx` - Reports route layout
- `app/reports/loading.tsx` - Reports loading state
- `app/orders/layout.tsx` - Orders route layout
- `app/orders/loading.tsx` - Orders loading state

### Breakpoint Reference (Tailwind CSS 4)

| Breakpoint | Size     | Layout                    |
| ---------- | -------- | ------------------------- |
| Default    | <768px   | Mobile (header toggle)    |
| `md`       | ≥768px   | Tablet (35/65)            |
| `lg`       | ≥1024px  | Desktop (30/70)           |

### Dependencies

- `next-themes` - For theme switching (light/dark mode)
- shadcn/ui `Skeleton` component - Already installed
- shadcn/ui `Toaster` component - For toast notifications

### Learnings from Previous Story

**From Story 1-3-database-schema-design-migration-setup (Status: review)**

- **Drizzle Configuration Pattern**: `entities.roles.provider: 'supabase'` configured in `drizzle.config.ts` - this pattern may be useful if any layout components need to interact with auth context
- **Schema Location**: Database schema is at `server/lib/db/schema/public.ts` with 7 tables ready for data operations
- **File Organization**: Story 1.3 established the pattern of detailed task breakdowns and inline code examples in Dev Notes - follow this pattern
- **Deferred Tests**: Unit tests were deferred to Story 1.9 (Testing Infrastructure) - continue this pattern for layout tests

[Source: docs/sprint-artifacts/1-3-database-schema-design-migration-setup.md#Dev-Agent-Record]

### Edge Cases and Considerations

1. **Hydration Mismatch Prevention**: Use `suppressHydrationWarning` on `<html>` element when using next-themes
2. **Safe Area Insets**: Mobile header needs `pt-safe` (env(safe-area-inset-top)) for notched devices
3. **View Transition State**: Mobile view switching should use URL state or Zustand store (from Story 1.6) for persistence
4. **Loading State Duration**: Skeletons should be shown for minimum 200ms to prevent flash
5. **Header Height Offset**: Mobile content needs `pt-14` (or similar) to account for fixed header height

### References

- [Source: docs/architecture.md#Project-Structure] - Component organization and layout patterns
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Story-1.5-Application-Shell] - Acceptance criteria
- [Source: docs/epics.md#Story-1.5] - Original story definition with interaction patterns
- [Source: docs/ux-design-specification.md] - Studio layout visual requirements

## Change Log

| Date       | Author    | Change Description                                     |
| ---------- | --------- | ------------------------------------------------------ |
| 2025-12-05 | Dev Agent | Implemented all layout tasks (Tasks 1-6), Task 7 deferred to Story 1.9 |
| 2025-12-05 | PM Agent  | Updated mobile navigation from bottom tabs to top header with view toggle (Course Correction) |
| 2025-12-05 | SM Agent  | Initial story draft created from epics and tech spec  |

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/1-5-application-shell-layout-structure.context.xml`

### Agent Model Used

Claude Opus 4.5 (Preview)

### Debug Log References

- Task 1: Installed shadcn/ui components (skeleton, sonner, card, button), created ThemeProvider and ToastProvider, updated root layout with SEO metadata and suppressHydrationWarning
- Task 2: Created auth layout with centered card, branding header, responsive (full-width mobile, max-w-md desktop)
- Task 3: Implemented StudioLayout with CSS Grid (lg:30%/70%, md:35%/65%), MobileHeader with segmented view toggle, safe area padding, 44px touch targets
- Task 4: Created reports and orders route layouts with shared Header component
- Task 5: Created loading.tsx files with Skeleton components for studio, reports, orders
- Task 6: Created Header, MobileHeader, StudioLayout components, exported from index.ts

### Completion Notes List

- All ACs satisfied (1.5.1-1.5.9) except Task 7 (testing) which is deferred to Story 1.9
- Used sonner instead of deprecated toast component per shadcn/ui guidance
- Created lib/utils.ts to support shadcn/ui @/lib/utils alias
- Build passes successfully (pre-existing drizzle.config.ts type issue unrelated to this story)
- Lint passes with no errors

### File List

**Created:**
- `lib/utils.ts` - cn() utility for shadcn/ui components
- `components/providers/theme-provider.tsx` - next-themes wrapper
- `components/providers/toast-provider.tsx` - sonner toaster wrapper
- `components/shared/header.tsx` - shared header with navigation
- `components/shared/mobile-header.tsx` - mobile header with view toggle
- `components/shared/studio-layout.tsx` - responsive split view layout
- `components/shared/index.ts` - barrel export
- `components/ui/skeleton.tsx` - shadcn/ui skeleton (via npx shadcn)
- `components/ui/sonner.tsx` - shadcn/ui sonner (via npx shadcn)
- `components/ui/card.tsx` - shadcn/ui card (via npx shadcn)
- `components/ui/button.tsx` - shadcn/ui button (via npx shadcn)
- `app/auth/layout.tsx` - auth route layout
- `app/studio/layout.tsx` - studio route layout
- `app/studio/page.tsx` - studio page placeholder
- `app/studio/loading.tsx` - studio loading skeleton
- `app/reports/layout.tsx` - reports route layout
- `app/reports/page.tsx` - reports page placeholder
- `app/reports/loading.tsx` - reports loading skeleton
- `app/orders/layout.tsx` - orders route layout
- `app/orders/page.tsx` - orders page placeholder
- `app/orders/loading.tsx` - orders loading skeleton

**Modified:**
- `app/layout.tsx` - added providers, SEO metadata, suppressHydrationWarning
- `package.json` - added sonner dependency (via shadcn)
