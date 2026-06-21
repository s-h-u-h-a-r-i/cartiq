import type { PostgrestMaybeSingleResponse } from '@supabase/supabase-js';
import { Effect } from 'effect';

import { Supabase } from '@/supabase';
import { ProfileError } from './error';
import {
  decodeProfile,
  encodeProfileUpdateInput,
  ProfileRow,
  ProfileUpdateInput,
} from './model';

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
          ).pipe(Effect.flatMap(decodeProfile)),

        updateProfile: (userId: string, input: ProfileUpdateInput) =>
          encodeProfileUpdateInput(input).pipe(
            Effect.flatMap((profileUpdate) =>
              readProfileResponse(() =>
                supabase
                  .from('profiles')
                  .update(profileUpdate)
                  .eq('id', userId)
                  .select()
                  .maybeSingle()
              )
            ),
            Effect.flatMap(decodeProfile)
          ),
      };
    }),
  }
) {}

const readProfileResponse = (
  request: () => PromiseLike<PostgrestMaybeSingleResponse<ProfileRow>>
) =>
  Effect.tryPromise({ try: request, catch: ProfileError.fromUnknown }).pipe(
    Effect.filterOrFail(
      (response) => response.success === true,
      ({ error }) => ProfileError.fromPostgrest(error)
    ),
    Effect.filterOrFail((response) => response.data !== null, ProfileError.notFound),
    Effect.map(({ data }) => data!)
  );

