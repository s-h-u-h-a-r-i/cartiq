import { type PostgrestError, type AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { Data, type ParseResult } from 'effect';

export class SessionError extends Data.TaggedError('SessionError')<{
  readonly code: string;
  readonly message: string;
}> {
  static fromUnknown(error: unknown) {
    return new SessionError({
      code: 'unexpected_session_error',
      message: error instanceof Error ? error.message : 'Unexpected session error',
    });
  }

  static fromAuth(error: SupabaseAuthError) {
    return new SessionError({
      code: error.code ?? 'supabase_auth_error',
      message: error.message,
    });
  }

  static fromPostgrest(error: PostgrestError) {
    return new SessionError({
      code: error.code,
      message: error.message,
    });
  }

  static fromParse(error: ParseResult.ParseError) {
    return new SessionError({
      code: 'invalid_session_data',
      message: error.message,
    });
  }

  static profileNotFound() {
    return new SessionError({
      code: 'session_profile_not_found',
      message: 'Session profile not found',
    });
  }
}
