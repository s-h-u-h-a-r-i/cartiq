import {
  createClient,
  type SupabaseClient,
} from '@supabase/supabase-js';

import { type Database } from './database.types';

export type AppSupabaseClient = SupabaseClient<Database>;

export function createSupabaseClient(): AppSupabaseClient {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  }

  return createClient<Database>(url, anonKey);
}
