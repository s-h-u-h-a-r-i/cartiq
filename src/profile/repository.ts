import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { Effect, Schema } from 'effect';

import { Supabase } from '@/supabase';
import {
  failProfileFromParse,
  failProfileFromSupabase,
  failProfileNotFound,
  profileErrorFromUnknown,
} from './error';
import { Profile, UpdateProfileInput } from './model';

export class ProfileRepository extends Effect.Service<ProfileRepository>()(
  'cartiq/ProfileRepository',
  {
    accessors: true,
    dependencies: [Supabase.Default],
    effect: Effect.gen(function* () {
      const supabase = yield* Supabase;

      return {
        getProfile: (userId: string) =>
          readProfileResponse(() =>
            supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
          ),

        updateProfile: (userId: string, input: UpdateProfileInput) =>
          Schema.encode(UpdateProfileInput)(input).pipe(
            Effect.catchTag('ParseError', failProfileFromParse),
            Effect.flatMap((profileUpdate) =>
              readProfileResponse(() =>
                supabase
                  .from('profiles')
                  .update(profileUpdate)
                  .eq('id', userId)
                  .select()
                  .maybeSingle()
              )
            )
          ),
      };
    }),
  }
) {}

const readProfileResponse = <T>(request: () => PromiseLike<PostgrestSingleResponse<T>>) =>
  Effect.tryPromise({ try: request, catch: profileErrorFromUnknown }).pipe(
    Effect.filterOrElse(
      (response) => response.success === true,
      ({ error }) => failProfileFromSupabase(error)
    ),
    Effect.filterOrElse(
      (response) => response.data !== null,
      () => failProfileNotFound()
    ),
    Effect.flatMap(({ data }) => Schema.decodeUnknown(Profile)(data)),
    Effect.catchTag('ParseError', failProfileFromParse)
  );
