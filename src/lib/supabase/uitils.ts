import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export const isSupabaseSuccess = <T>(response: PostgrestSingleResponse<T>) =>
  response.success === true;
