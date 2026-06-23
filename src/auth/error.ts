import { type AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { type ZodError } from 'zod';

export class AuthError extends Error {
  readonly name = 'AuthError';

  constructor(
    readonly code: string,
    message: string,
    options?: ErrorOptions
  ) {
    super(message, options);
  }

  static fromUnknown(error: unknown): AuthError {
    return new AuthError(
      'unexpected_auth_error',
      error instanceof Error ? error.message : 'Unexpected auth error',
      { cause: error }
    );
  }

  static fromAuth(error: SupabaseAuthError): AuthError {
    return new AuthError(error.code ?? 'supabase_auth_error', error.message, {
      cause: error,
    });
  }

  static fromZod(error: ZodError): AuthError {
    return new AuthError('invalid_auth_data', error.message, { cause: error });
  }
}
