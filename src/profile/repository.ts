import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { Effect, Schema } from 'effect';

import { Supabase } from '@/supabase';
import {
  failProfileFromParse,
  failProfileFromSupabase,
  failProfileNotFound,
  ProfileError,
  profileErrorFromUnknown,
} from './error';
import { Profile, UpdateProfileInput } from './model';

export class ProfileRepository extends Effect.Service<ProfileRepository>()(
  'cartiq/ProfileRepository',
  {
    accessors: true,
    dependencies: [Supabase.Default], // TODO: maybe make this contain CRUD with error conversions
    effect: Effect.gen(function* () {
      const supabase = yield* Supabase;

      return {
        getProfile: (userId: string) =>
          readProfileResponse(
            Effect.tryPromise({
              try: () => supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
              catch: profileErrorFromUnknown,
            })
          ),

        updateProfile: (userId: string, input: UpdateProfileInput) =>
          Schema.encode(UpdateProfileInput)(input).pipe(
            Effect.catchTag('ParseError', failProfileFromParse),
            Effect.flatMap((profileUpdate) =>
              readProfileResponse(
                Effect.tryPromise({
                  try: () =>
                    supabase
                      .from('profiles')
                      .update(profileUpdate)
                      .eq('id', userId)
                      .select()
                      .maybeSingle(),
                  catch: profileErrorFromUnknown,
                })
              )
            )
          ),
      };
    }),
  }
) {}

const readProfileResponse = <T>(effect: Effect.Effect<PostgrestSingleResponse<T>, ProfileError>) =>
  Effect.gen(function* () {
    const response = yield* effect;
    if (!response.success) {
      return yield* failProfileFromSupabase(response.error);
    }
    if (response.data === null) {
      return yield* failProfileNotFound();
    }
    const decoded = yield* Schema.decodeUnknown(Profile)(response.data).pipe(
      Effect.catchTag('ParseError', failProfileFromParse)
    );
    return decoded;
  });
