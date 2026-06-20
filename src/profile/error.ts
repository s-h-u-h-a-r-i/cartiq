import { PostgrestError } from '@supabase/supabase-js';
import { Data, Effect, ParseResult } from 'effect';

export class ProfileError extends Data.TaggedError('ProfileError')<{
  readonly code: string;
  readonly message: string;
}> {}

export function profileErrorFromSupabase(error: PostgrestError) {
  return new ProfileError({
    code: error.code,
    message: error.message,
  });
}

export function profileErrorFromUnknown(error: unknown) {
  return new ProfileError({
    code: 'unexpected_profile_error',
    message: error instanceof Error ? error.message : 'Unexpected profile error',
  });
}

export function profileErrorFromParse(error: ParseResult.ParseError) {
  return new ProfileError({
    code: 'invalid_profile_data',
    message: error.message,
  });
}

export function profileNotFoundError() {
  return new ProfileError({
    code: 'profile_not_found',
    message: 'Profile not found',
  });
}

export function failProfileFromSupabase(error: PostgrestError) {
  return Effect.fail(profileErrorFromSupabase(error));
}

export function failProfileFromParse(error: ParseResult.ParseError) {
  return Effect.fail(profileErrorFromParse(error));
}

export function failProfileNotFound() {
  return Effect.fail(profileNotFoundError());
}
