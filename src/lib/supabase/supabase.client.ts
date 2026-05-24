import { createClient } from '@supabase/supabase-js';
import { Effect } from 'effect';
import type { Database } from './database.types';

export class Supabase extends Effect.Service<Supabase>()('Supabase', {
  effect: Effect.sync(makeSupabaseClient),
}) {}

function makeSupabaseClient() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  }

  return createClient<Database>(url, anonKey);
}
