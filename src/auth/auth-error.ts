import { AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { Data } from 'effect';

export class AuthError extends Data.TaggedError('AuthError')<{
  readonly code: string;
  readonly message: string;
}> {}

export function supabaseErrorToAuthError(error: SupabaseAuthError) {
  return new AuthError({
    code: error.code ?? 'supabase_auth_error',
    message: error.message,
  });
}

export function unknownToAuthError(error: unknown) {
  return new AuthError({
    code: 'unexpected_auth_error',
    message: error instanceof Error ? error.message : 'Unexpected auth error',
  });
}
