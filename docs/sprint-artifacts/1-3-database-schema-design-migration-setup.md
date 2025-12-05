# Story 1.3: Database Schema Design & Migration Setup

Status: done

## Story

As a **developer**,
I want **the complete Drizzle ORM schema defined with migrations ready**,
So that **all data models are type-safe and database changes are version-controlled**.

## Acceptance Criteria

| AC ID    | Criteria                                                                                                                                                       | Source                   |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| AC-1.3.1 | `server/lib/db/schema/public.ts` contains all 7 tables: `user_profiles`, `naming_sessions`, `generated_names`, `risk_checks`, `favorites`, `orders`, `reports` | [Tech Spec: Data Models] |
| AC-1.3.2 | All tables use `snake_case` naming per Architecture ADR                                                                                                        | [Architecture: ADR-001]  |
| AC-1.3.3 | All foreign keys use `references()` with proper relationships                                                                                                  | [Tech Spec: Data Models] |
| AC-1.3.4 | Indexes exist on `user_id` and `session_id` columns for performance                                                                                            | [Tech Spec: Data Models] |
| AC-1.3.5 | `npm run db:generate` creates valid migration files in `drizzle/` directory                                                                                    | [Epics: Story 1.3]       |
| AC-1.3.6 | `npm run db:push` applies schema to Supabase database successfully                                                                                             | [Epics: Story 1.3]       |
| AC-1.3.7 | RLS policies are defined for all tables protecting user data                                                                                                   | [Architecture: Security] |

## Tasks / Subtasks

- [x] **Task 1: Extend public.ts schema with all application tables (enable RLS by using .enableRLS()) ** (AC: 1.3.1, 1.3.2, 1.3.3)

  - [x] 1.1 Define `user_profiles` table with `id`, `user_id` FK, `segment` enum, `first_run_completed`, timestamps
  - [x] 1.2 Define `naming_sessions` table with `id`, `user_id` FK, `criteria` JSONB, timestamps
  - [x] 1.3 Define `generated_names` table with `id`, `session_id` FK, `name`, `rationale`, `domain_status` JSONB, timestamp
  - [x] 1.4 Define `risk_checks` table with `id`, `name_id` FK, `status` enum (pending/green/amber/red), `factors` JSONB, `checked_at`
  - [x] 1.5 Define `favorites` table with `id`, `user_id` FK, `name_id` FK, timestamp
  - [x] 1.6 Define `orders` table with `id`, `user_id` FK, `name_id` FK, `product_type` enum, `polar_order_id`, `status` enum, `amount_cents`, timestamp
  - [x] 1.7 Define `reports` table with `id`, `order_id` FK (unique), `pdf_url`, `generated_at`
  - [x] 1.8 Verify all table and column names follow `snake_case` convention

- [x] **Task 2: Add performance indexes** (AC: 1.3.4)

  - [x] 2.1 Create index on `naming_sessions.user_id`
  - [x] 2.2 Create index on `generated_names.session_id`
  - [x] 2.3 Create index on `favorites.user_id`
  - [x] 2.4 Create index on `orders.user_id`
  - [x] 2.5 Create composite index on `favorites(user_id, name_id)` for uniqueness check

- [x] **Task 3: Verify Drizzle configuration and generate migration** (AC: 1.3.5)

  - [x] 3.1 Verify `drizzle.config.ts` has correct schema path (`./server/lib/db/schema/*`)
  - [x] 3.2 Verify output directory is `./drizzle`
  - [x] 3.3 Create npm scripts: `db:generate`, `db:migrate`, `db:push`, `db:check`
  - [x] 3.4 Run `npm run db:generate` and verify migration SQL file is created
  - [x] 3.5 Review generated SQL for correctness and proper FK relationships

- [x] **Task 4: Apply schema to Supabase** (AC: 1.3.6)

  - [x] 4.1 Run `npm run db:migrate` to apply migrations
  - [x] 4.2 Verify schema consistency with `npm run db:check`
  - [ ] 4.3 Verify all tables exist in Supabase dashboard (manual)
  - [ ] 4.4 Verify FK constraints are properly created (manual)

- [x] **Task 5: Create RLS policies migration** (AC: 1.3.7)

  - [x] 5.1 RLS policies defined declaratively in schema using pgPolicy
  - [x] 5.2 Enable RLS on all 7 tables using .enableRLS()
  - [x] 5.3 Create SELECT policy: users can only view their own data
  - [x] 5.4 Create INSERT policy: users can only insert their own data
  - [x] 5.5 Create UPDATE policy: users can only update their own data
  - [x] 5.6 Create DELETE policy for `favorites` table (via 'all' policy)
  - [x] 5.7 RLS policies applied via migration (drizzle-kit migrate)

- [ ] **Task 6: Testing and verification** (AC: All) - Deferred to Story 1.9
  - [ ] 6.1 Write unit test verifying schema exports all 7 tables (needs vitest - Story 1.9)
  - [ ] 6.2 Write unit test verifying all table names match snake_case regex (needs vitest - Story 1.9)
  - [ ] 6.3 Manually test RLS by attempting cross-user access (manual verification)
  - [ ] 6.4 Verify `explain analyze` shows index usage on common queries (manual verification)

## Dev Notes

### Technical Implementation Details

**Drizzle ORM Pattern (per Architecture ADR-001):**

- Use `pgTable` from `drizzle-orm/pg-core` (v0.44.7)
- Define proper foreign key relationships with `references()` function
- Use `timestamp` with `defaultNow()` for `created_at` fields
- Use `uuid` with `defaultRandom()` for primary keys
- JSONB columns use the `jsonb()` type for type-safe JSON storage

**Schema Location:**

- Existing: `server/lib/db/schema/auth.ts` - User profiles extension (links to Supabase `auth.users`)
- Target: `server/lib/db/schema/public.ts` - All application tables

**Enum Definitions:**

```typescript
// Segment types for Trojan Horse pattern
segment: text("segment", { enum: ["lean", "high-stakes"] });

// Risk status from Signa.so API
status: text("status", { enum: ["pending", "green", "amber", "red"] });

// Order status lifecycle
status: text("status", {
  enum: ["pending", "processing", "completed", "failed", "cancelled"],
});

// Product types
productType: text("product_type", {
  enum: ["de-risking-report", "premium-report"],
});
```

**Index Naming Convention:**

```typescript
// Pattern: {table_name}_{column_name}_idx
export const namingSessionsUserIdIdx = index("naming_sessions_user_id_idx").on(
  namingSessions.userId
);
```

### Project Structure Notes

**Existing Files:**

- `server/lib/db/index.ts` - Database connection (already configured)
- `server/lib/db/schema/auth.ts` - Auth schema (already exists)
- `drizzle.config.ts` - Drizzle configuration (already configured)
- `drizzle/0000_early_spacker_dave.sql` - Initial migration (exists)

**Files to Create/Modify:**

- `server/lib/db/schema/public.ts` - Add all 7 application tables
- `drizzle/XXXX_*.sql` - New migration will be generated
- `supabase/migrations/` or SQL editor - RLS policies

### RLS Policy Templates

```sql
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE naming_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Example: Users can only view their own sessions
CREATE POLICY "Users can view own sessions" ON naming_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Example: Users can only insert their own sessions
CREATE POLICY "Users can create own sessions" ON naming_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Edge Cases and Considerations

1. **Cascade Deletes:** Consider whether deleting a `naming_session` should cascade delete `generated_names`. Currently not specified - may need clarification.

2. **Unique Constraints:**

   - `user_profiles.user_id` - Already marked as `.unique()`
   - `orders.polar_order_id` - Already marked as `.unique()`
   - `reports.order_id` - Already marked as `.unique()` (one report per order)

3. **Nullable Fields:**
   - `user_profiles.segment` - Nullable until Trojan Horse prompt completed
   - `generated_names.rationale` - Optional field
   - `generated_names.domain_status` - Nullable until domain check runs
   - `reports.pdf_url` - Nullable until PDF generated
   - `reports.generated_at` - Nullable until PDF generated

### References

- [Source: docs/architecture.md#Project-Structure] - Schema location conventions
- [Source: docs/architecture.md#Data-Persistence] - Drizzle ORM pattern
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Data-Models-and-Contracts] - Complete schema definitions
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Security] - RLS policy requirements
- [Source: docs/epics.md#Story-1.3] - Original story definition and acceptance criteria

## Change Log

| Date       | Author    | Change Description                                                       |
| ---------- | --------- | ------------------------------------------------------------------------ |
| 2025-12-05 | SM Agent  | Initial story draft created from epics.md, tech-spec-epic-1.md           |
| 2025-12-05 | Dev Agent | Implemented all 7 tables with RLS, FKs, indexes; migration applied to DB |

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/1-3-database-schema-design-migration-setup.context.xml`

### Agent Model Used

Claude Opus 4.5 (Preview)

### Debug Log References

1. Replaced placeholder `ideas` table with 7 application tables
2. Used `pgTable()` + `.enableRLS()` pattern (not `pgTable.withRLS()` which doesn't exist in v0.44.7)
3. Added `authUsers.id` FK references to all `user_id` columns via `drizzle-orm/supabase`
4. Added `entities.roles.provider: 'supabase'` to drizzle.config.ts to exclude Supabase roles from migrations

### Completion Notes List

- All 7 tables defined: `userProfiles`, `namingSessions`, `generatedNames`, `riskChecks`, `favorites`, `orders`, `reports`
- RLS enabled on all tables with declarative `pgPolicy` definitions
- FK references use `authUsers` from `drizzle-orm/supabase` for type-safe auth.users references
- Cascade deletes configured: user deletion cascades to all user data
- Migration `0001_same_omega_red.sql` generated and applied successfully
- Task 6 (unit tests) deferred - requires Story 1.9 (Testing Infrastructure)

### File List

**Modified:**

- `server/lib/db/schema/public.ts` - Complete schema with 7 tables, RLS policies, indexes
- `drizzle.config.ts` - Added `entities.roles.provider: 'supabase'`
- `package.json` - Added `db:generate`, `db:migrate`, `db:push`, `db:check` scripts

**Created:**

- `drizzle/0001_same_omega_red.sql` - Migration with tables, RLS, policies, indexes
