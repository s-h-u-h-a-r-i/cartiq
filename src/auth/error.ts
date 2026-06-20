import { AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { Data, Effect, ParseResult } from 'effect';

export class AuthError extends Data.TaggedError('AuthError')<{
  readonly code: string;
  readonly message: string;
}> {}

export function authErrorFromSupabase(error: SupabaseAuthError) {
  return new AuthError({
    code: error.code ?? 'supabase_auth_error',
    message: error.message,
  });
}

export function authErrorFromUnknown(error: unknown) {
  return new AuthError({
    code: 'unexpected_auth_error',
    message: error instanceof Error ? error.message : 'Unexpected auth error',
  });
}

export function authErrorFromParse(error: ParseResult.ParseError) {
  return new AuthError({
    code: 'invalid_auth_user',
    message: error.message,
  });
}

export function failAuthFromSupabase(error: SupabaseAuthError) {
  return Effect.fail(authErrorFromSupabase(error));
}

export function failAuthFromParse(error: ParseResult.ParseError) {
  return Effect.fail(authErrorFromParse(error));
}
