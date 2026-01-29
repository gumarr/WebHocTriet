import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create client with anon key for public read access
// Use dummy values during build if env vars are not set
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Create client with service role key for admin operations (server-side only)
// Only create if the service role key is available
export const supabaseAdmin = (process.env.SUPABASE_SERVICE_ROLE_KEY && supabaseUrl)
  ? createClient(
      supabaseUrl, 
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false // Don't persist admin session
        }
      }
    )
  : null
