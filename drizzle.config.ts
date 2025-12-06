import { defineConfig } from 'drizzle-kit'

if (process.env.NODE_ENV === 'development') {
  const dotenv = await import('dotenv')

  dotenv.config({
    path: '.env.local',
  })
}

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
