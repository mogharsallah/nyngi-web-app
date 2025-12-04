import dotenv from 'dotenv'

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local',
})

import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: ['./server/lib/db/schema/public.ts'],
  dialect: 'postgresql',
  casing: 'snake_case',
  schemaFilter: ['public'],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  entities: {
    roles: {
      provider: 'supabase', // Excludes Supabase-managed roles from migrations
    },
  },
})
