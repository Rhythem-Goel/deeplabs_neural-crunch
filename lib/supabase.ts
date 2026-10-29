import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'missing-key')
export type Problem = { number: number; title: string | null; description: string | null; category: string | null; is_revealed: boolean; revealed_at?: string | null }
