import { createClient, SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
      {
        global: {
          fetch: (url, options = {}) =>
            fetch(url, { ...options, cache: 'no-store' }),
        },
      }
    )
  }
  return client
}
