import type { AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { Data } from 'effect';

export class AuthError extends Data.TaggedError('AuthError')<{
  readonly message: string;
  readonly code: string;
}> {}

export function supabaseErrorToAuthError(error: SupabaseAuthError) {
  return new AuthError({ code: error.code ?? 'unknown', message: error.message });
}
