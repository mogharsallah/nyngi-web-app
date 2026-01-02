import type { UIMessage } from 'ai'
import { Criteria } from '@/common/types/session'
import { customJsonb } from '@/server/lib/db/schema/custom-types/jsonb'
import { sql } from 'drizzle-orm'
import { pgTable, pgPolicy, uuid, text, boolean, timestamp, jsonb, integer, index } from 'drizzle-orm/pg-core'
import { authenticatedRole, authUid, authUsers } from 'drizzle-orm/supabase'

// ============================================================================
// Enums (defined as text with enum constraint for Drizzle compatibility)
// ============================================================================

// Segment types for Trojan Horse pattern
// Values: 'lean' | 'high-stakes'

// Risk status from Signa.so API
// Values: 'pending' | 'green' | 'amber' | 'red'

// Order status lifecycle
// Values: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'

// Product types
// Values: 'de-risking-report' | 'premium-report'

// ============================================================================
// Tables
// ============================================================================

/**
 * user_profiles - extends Supabase auth.users
 * Links to auth.users via user_id FK (handled at DB level, not Drizzle reference)
 */
export const userProfiles = pgTable(
  'user_profiles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .unique()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    firstRunCompleted: boolean('first_run_completed').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    // RLS Policies: Users can only read/update their own profile
    pgPolicy('user_profiles_select_own', {
      for: 'select',
      to: authenticatedRole,
      using: sql`${table.userId} = ${authUid}`,
    }),
    pgPolicy('user_profiles_insert_own', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: sql`${table.userId} = ${authUid}`,
    }),
    pgPolicy('user_profiles_update_own', {
      for: 'update',
      to: authenticatedRole,
      using: sql`${table.userId} = ${authUid}`,
      withCheck: sql`${table.userId} = ${authUid}`,
    }),
  ]
).enableRLS()

/**
 * naming_sessions - chat conversation context
 * Stores criteria collected via Narrative Architect
 */
export const namingSessions = pgTable(
  'naming_sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    plan: text('plan', { enum: ['velocity', 'legacy'] }).notNull(),
    criteria: customJsonb<Partial<Criteria>>('criteria').notNull(),
    messages: customJsonb<UIMessage[]>('messages').notNull().default([]),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('naming_sessions_user_id_idx').on(table.userId),
    // RLS Policy: Users can only access their own sessions
    pgPolicy('naming_sessions_crud_own', {
      for: 'all',
      to: authenticatedRole,
      using: sql`${table.userId} = ${authUid}`,
      withCheck: sql`${table.userId} = ${authUid}`,
    }),
  ]
).enableRLS()

/**
 * generated_names - AI-generated name suggestions
 * Linked to sessions, includes domain availability status
 */
export const generatedNames = pgTable(
  'generated_names',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionId: uuid('session_id')
      .notNull()
      .references(() => namingSessions.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    rationale: text('rationale'),
    domainStatus: jsonb('domain_status'), // { com: boolean, io: boolean, ai: boolean }
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('generated_names_session_id_idx').on(table.sessionId),
    // RLS Policy: Users can access names in their sessions (via session ownership)
    pgPolicy('generated_names_select_via_session', {
      for: 'select',
      to: authenticatedRole,
      using: sql`EXISTS (
        SELECT 1 FROM naming_sessions 
        WHERE naming_sessions.id = ${table.sessionId} 
        AND naming_sessions.user_id = ${authUid}
      )`,
    }),
    pgPolicy('generated_names_insert_via_session', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: sql`EXISTS (
        SELECT 1 FROM naming_sessions 
        WHERE naming_sessions.id = ${table.sessionId} 
        AND naming_sessions.user_id = ${authUid}
      )`,
    }),
  ]
).enableRLS()

/**
 * risk_checks - trademark risk assessment results
 * Traffic Light status from Signa.so API
 */
export const riskChecks = pgTable(
  'risk_checks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    nameId: uuid('name_id')
      .notNull()
      .references(() => generatedNames.id, { onDelete: 'cascade' }),
    status: text('status', {
      enum: ['pending', 'green', 'amber', 'red'],
    }).notNull(),
    factors: jsonb('factors').notNull(), // Signa.so response data
    checkedAt: timestamp('checked_at').defaultNow().notNull(),
  },
  (table) => [
    // RLS Policy: Users can read risk checks for names in their sessions
    pgPolicy('risk_checks_select_via_name', {
      for: 'select',
      to: authenticatedRole,
      using: sql`EXISTS (
        SELECT 1 FROM generated_names gn
        JOIN naming_sessions ns ON ns.id = gn.session_id
        WHERE gn.id = ${table.nameId}
        AND ns.user_id = ${authUid}
      )`,
    }),
  ]
).enableRLS()

/**
 * favorites - user saved names
 * Allows users to bookmark names they like
 */
export const favorites = pgTable(
  'favorites',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    nameId: uuid('name_id')
      .notNull()
      .references(() => generatedNames.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('favorites_user_id_idx').on(table.userId),
    index('favorites_user_id_name_id_idx').on(table.userId, table.nameId),
    // RLS Policy: Users can only manage their own favorites
    pgPolicy('favorites_crud_own', {
      for: 'all',
      to: authenticatedRole,
      using: sql`${table.userId} = ${authUid}`,
      withCheck: sql`${table.userId} = ${authUid}`,
    }),
  ]
).enableRLS()

/**
 * orders - De-Risking Report purchases
 * Tracks Polar.sh payment integration
 */
export const orders = pgTable(
  'orders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    nameId: uuid('name_id')
      .notNull()
      .references(() => generatedNames.id),
    productType: text('product_type', {
      enum: ['de-risking-report', 'premium-report'],
    }).notNull(),
    polarOrderId: text('polar_order_id').unique(),
    status: text('status', {
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    }).notNull(),
    amountCents: integer('amount_cents').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('orders_user_id_idx').on(table.userId),
    // RLS Policy: Users can only view their own orders
    pgPolicy('orders_select_own', {
      for: 'select',
      to: authenticatedRole,
      using: sql`${table.userId} = ${authUid}`,
    }),
    // Insert only for own user_id (order creation)
    pgPolicy('orders_insert_own', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: sql`${table.userId} = ${authUid}`,
    }),
  ]
).enableRLS()

/**
 * reports - generated PDF reports
 * One report per order (unique constraint on order_id)
 */
export const reports = pgTable(
  'reports',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('order_id')
      .notNull()
      .unique()
      .references(() => orders.id, { onDelete: 'cascade' }),
    pdfUrl: text('pdf_url'),
    generatedAt: timestamp('generated_at'),
  },
  (table) => [
    // RLS Policy: Users can read reports linked to their orders
    pgPolicy('reports_select_via_order', {
      for: 'select',
      to: authenticatedRole,
      using: sql`EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = ${table.orderId} 
        AND orders.user_id = ${authUid}
      )`,
    }),
  ]
).enableRLS()
