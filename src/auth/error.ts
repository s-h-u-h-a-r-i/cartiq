import { type AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { Data, type ParseResult } from 'effect';

export class AuthError extends Data.TaggedError('AuthError')<{
  readonly code: string;
  readonly message: string;
}> {
  static fromUnknown(error: unknown) {
    return new AuthError({
      code: 'unexpected_auth_error',
      message: error instanceof Error ? error.message : 'Unexpected auth error',
    });
  }

  static fromAuth(error: SupabaseAuthError) {
    return new AuthError({
      code: error.code ?? 'supabase_auth_error',
      message: error.message,
    });
  }

  static fromParse(error: ParseResult.ParseError) {
    return new AuthError({
      code: 'invalid_auth_data',
      message: error.message,
    });
  }
}

