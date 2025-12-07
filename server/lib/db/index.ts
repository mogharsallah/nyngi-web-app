import 'dotenv/config'
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres, { Sql } from 'postgres'

import * as schema from '@/server/lib/db/schema/public'

type DbSchema = typeof schema

function getConnectionString(): string {
  const host = process.env.HOST ?? ''
  let connectionString = process.env.DATABASE_URL ?? ''

  if (host.includes('postgres:postgres@supabase_db_')) {
    const url = URL.parse(host)!
    url.hostname = url.hostname.split('_')[1]
    connectionString = url.href
  }

  return connectionString
}

/**
 * Database client singleton.
 * Uses globalThis to persist across hot reloads in development.
 * Lazily initialized to avoid running during Next.js build.
 */
const globalForDb = globalThis as unknown as {
  client: Sql | undefined
  db: PostgresJsDatabase<DbSchema> | undefined
}

export function getClient(): Sql {
  if (!globalForDb.client) {
    // Disable prefetch as it is not supported for "Transaction" pool mode
    globalForDb.client = postgres(getConnectionString(), { prepare: false })
  }
  return globalForDb.client
}

export function getDb(): PostgresJsDatabase<DbSchema> {
  if (!globalForDb.db) {
    globalForDb.db = drizzle(getClient(), { casing: 'snake_case', schema })
  }
  return globalForDb.db
}

// For backwards compatibility - lazily evaluated getters
// Use a function proxy to support tagged template literal usage (client`select 1`)
export const client = new Proxy((() => {}) as unknown as Sql, {
  get(_, prop) {
    return Reflect.get(getClient(), prop)
  },
  apply(_, __, args) {
    // Support tagged template literal: client`select 1`
    return Reflect.apply(getClient() as unknown as CallableFunction, getClient(), args)
  },
})

export const db = new Proxy({} as PostgresJsDatabase<DbSchema>, {
  get(_, prop) {
    return Reflect.get(getDb(), prop)
  },
})
