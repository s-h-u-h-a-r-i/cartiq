import { type PostgrestError } from '@supabase/supabase-js';
import { Data, type ParseResult } from 'effect';

export class ProfileError extends Data.TaggedError('ProfileError')<{
  readonly code: string;
  readonly message: string;
}> {
  static fromUnknown(error: unknown) {
    return new ProfileError({
      code: 'unexpected_profile_error',
      message: error instanceof Error ? error.message : 'Unexpected profile error',
    });
  }

  static fromPostgrest(error: PostgrestError) {
    return new ProfileError({
      code: error.code,
      message: error.message,
    });
  }

  static fromParse(error: ParseResult.ParseError) {
    return new ProfileError({
      code: 'invalid_profile_data',
      message: error.message,
    });
  }

  static notFound() {
    return new ProfileError({
      code: 'profile_not_found',
      message: 'Profile not found',
    });
  }
}

