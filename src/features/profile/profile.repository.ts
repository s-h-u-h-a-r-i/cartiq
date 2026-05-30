import { Effect, Schema } from 'effect';

import { Supabase } from '@/lib/supabase';
import { isSupabaseSuccess } from '@/lib/supabase/uitils';
import { supabaseErrorToProfileError } from './profile.errors';
import { ProfileRowTransformSchema } from './profile.schema';

export class ProfileRepository extends Effect.Service<ProfileRepository>()('ProfileRepository', {
  dependencies: [Supabase.Default],
  effect: Effect.gen(function* () {
    const supabase = yield* Supabase;

    return {
      getById: (id: string) =>
        Effect.promise(() => supabase.from('profiles').select('*').eq('id', id).single()).pipe(
          Effect.filterOrFail(isSupabaseSuccess, ({ error }) => supabaseErrorToProfileError(error)),
          Effect.flatMap(({ data }) => Schema.decode(ProfileRowTransformSchema)(data))
        ),
    };
  }),
}) {}
