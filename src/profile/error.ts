import { type PostgrestError } from '@supabase/supabase-js';
import { type ZodError } from 'zod';

export class ProfileError extends Error {
  readonly name = 'ProfileError';

  constructor(
    readonly code: string,
    message: string,
    options?: ErrorOptions
  ) {
    super(message, options);
  }

  static fromUnknown(error: unknown): ProfileError {
    return new ProfileError(
      'unexpected_profile_error',
      error instanceof Error ? error.message : 'Unexpected profile error',
      { cause: error }
    );
  }

  static fromPostgrest(error: PostgrestError): ProfileError {
    return new ProfileError(error.code, error.message, { cause: error });
  }

  static fromZod(error: ZodError): ProfileError {
    return new ProfileError('invalid_profile_data', error.message, {
      cause: error,
    });
  }

  static notFound(): ProfileError {
    return new ProfileError('profile_not_found', 'Profile not found');
  }
}
