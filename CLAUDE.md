# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nyngi is an AI-powered business naming platform with real-time IP/trademark risk assessment. Built with Next.js 16, it features a multi-agent AI system using Google Gemini, PostgreSQL with Row-Level Security via Supabase, and streaming chat interfaces.

## Common Commands

```bash
# Development (runs Caddy reverse proxy + Next.js concurrently)
bun dev

# Build
bun build

# Type checking
bun type-check

# Testing
bun test                 # Unit tests (Vitest)
bun test:watch           # Watch mode
bun test:e2e             # E2E tests (Playwright)
bun test:e2e:ui          # Playwright UI mode
bun test:coverage        # Coverage report

# Database (Drizzle ORM)
bun db:generate          # Generate migrations
bun db:migrate           # Run migrations
bun db:check             # Check schema

# Linting & Formatting
bun lint                 # ESLint
bun format               # oxfmt
```

## Architecture

### Directory Structure

```
app/                      # Next.js App Router routes
  api/                    # API routes (chat streaming, health checks)
  auth/                   # Authentication pages
  studio/[id]/            # Main workspace with parallel routes (@chat, @canvas)
  orders/, reports/       # Order and report pages

components/
  ui/                     # Shadcn/ui components
  features/               # Feature components (chat/, auth/, ai/)
  providers/              # Context providers (Theme, Toast, StudioStore)
  lib/                    # Client utilities, Zustand stores, Supabase client

server/
  agents/                 # AI agents with tool definitions
  agents/instructions/    # Markdown files with agent prompts
  actions/                # Server actions (studio.ts, orders.ts)
  services/               # Business logic (report-generator, risk-engine)
  lib/
    db/                   # Drizzle ORM setup and schema
    supabase/             # Server/admin/middleware Supabase clients
    logger/               # Pino logging with Sentry integration
    actions/              # authenticatedAction wrapper

common/types/             # Shared TypeScript types
drizzle/                  # SQL migration files
```

### Key Patterns

**Server Actions**: Use `authenticatedAction` wrapper from `server/lib/actions/safe-action.ts` for all mutations. It handles Zod validation, auth checks, and typed responses.

**AI Agents**: Located in `server/agents/`. Each agent has:
- A TypeScript file with tool definitions using Zod schemas
- Markdown instructions in `server/agents/instructions/`
- Streaming responses via `toUIMessageStreamResponse()`

**State Management**: Zustand store in `components/lib/stores/studio-store.ts` for client state. Access via `useStudioStore` hook.

**Database**: Drizzle ORM with PostgreSQL. Schema in `server/lib/db/schema/public.ts`. All tables have RLS policies enforcing user ownership via `auth.uid()`.

**Supabase Clients**:
- `server/lib/supabase/server.ts` - Server components/actions
- `server/lib/supabase/admin.ts` - Service role operations
- `components/lib/supabase/client.ts` - Browser client

### Data Flow

1. User authenticates via Supabase Auth
2. Server actions validate with `authenticatedAction`
3. Database operations use Drizzle with RLS enforcement
4. AI chat streams through `/api/chat/[id]/criteria` route
5. Agents use tools to update session criteria in real-time

### Testing Structure

- `tests/unit/` - Vitest unit tests
- `tests/integration/` - Integration tests
- `tests/e2e/` - Playwright E2E tests with auth state reuse

Coverage thresholds: Services 80%, Actions 70%, Components 50%

## Important Files

- `next.config.ts` - Next.js config with Sentry and i18n plugins
- `drizzle.config.ts` - Database configuration (snake_case convention)
- `components.json` - Shadcn UI configuration
- `server/lib/db/schema/public.ts` - Complete database schema
