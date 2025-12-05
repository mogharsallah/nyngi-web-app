# Project Technology References (llms.txt)

> **Purpose**: This file contains llms.txt documentation endpoints for technologies used in this project.
> AI agents should fetch the relevant llms.txt URL when they need up-to-date documentation for implementation, architecture decisions, or code review.

---

## Core Framework

| Technology | When to Use | Documentation |
|------------|-------------|---------------|
| **Next.js 16** | Routing, Server Components, App Router, API routes, middleware | [llms-full.txt](https://nextjs.org/docs/llms-full.txt) |
| **React 19** | Components, hooks, state management patterns | [llms.txt](https://react.dev/llms.txt) |

## UI & Styling

| Technology | When to Use | Documentation |
|------------|-------------|---------------|
| **Shadcn/ui** | Component library, design system, accessible UI patterns | [llms.txt](https://ui.shadcn.com/llms.txt) |
| **Tailwind CSS v4** | Utility classes, responsive design, theming | [llms.txt](https://tailwindcss.com/llms.txt) |

## Database & Backend

| Technology | When to Use | Documentation |
|------------|-------------|---------------|
| **Supabase** | Auth, database client, RLS policies, storage | [llms.txt](https://supabase.com/llms.txt) |
| **Drizzle ORM** | Schema definitions, migrations, queries, relations | [llms.txt](https://orm.drizzle.team/llms.txt) |

## AI Integration

| Technology | When to Use | Documentation |
|------------|-------------|---------------|
| **Vercel AI SDK** | Streaming, chat UI, RAG patterns, tool calling | [llms.txt](https://ai-sdk.dev/llms.txt) |
| **Google Gemini API** | Model configuration, prompting, multimodal | [llms.txt](https://ai.google.dev/gemini-api/docs/llms.txt) |

## State & Validation

| Technology | When to Use | Documentation |
|------------|-------------|---------------|
| **Zustand** | Client-side state management, stores | [llms.txt](https://raw.githubusercontent.com/pmndrs/zustand/refs/heads/main/docs/llms.txt) |
| **Zod** | Schema validation, type inference, form validation | [llms.txt](https://zod.dev/llms.txt) |

## Payments

| Technology | When to Use | Documentation |
|------------|-------------|---------------|
| **Polar** | Subscriptions, payments, entitlements | [llms-full.txt](https://polar.sh/docs/llms-full.txt) |

---

## Usage Notes for AI Agents

1. **Fetch on demand**: Only fetch llms.txt when you need specific implementation guidance
2. **Prefer full versions**: Use `llms-full.txt` when available for comprehensive documentation
3. **Cross-reference**: For integration questions (e.g., "Supabase + Next.js Auth"), fetch both relevant docs
4. **Cache awareness**: llms.txt content is current as of fetch time - re-fetch for long sessions

