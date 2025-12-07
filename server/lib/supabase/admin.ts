import { createClient } from '@supabase/supabase-js'

type SupabaseClient = ReturnType<typeof createClient>
const globalForClient = globalThis as unknown as {
  client: SupabaseClient
}

export function createAdminClient() {
  if (!globalForClient.client) {
    globalForClient.client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
      },
    })
  }
  return globalForClient.client
}

export const adminClient = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return Reflect.get(createAdminClient(), prop)
  },
})
