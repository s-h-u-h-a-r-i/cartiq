import type { PostgrestError } from '@supabase/supabase-js';
import { Data } from 'effect';

class ProfileError extends Data.TaggedError('ProfileError')<{
  readonly code: string;
  readonly message: string;
}> {}

export function supabaseErrorToProfileError(error: PostgrestError) {
  return new ProfileError({ code: error.code, message: error.message });
}
