import { Effect } from 'effect';

import { Supabase } from '@/lib/supabase';
import { supabaseErrorToProfileError } from './profile.errors';

export class ProfileRepository extends Effect.Service<ProfileRepository>()('ProfileRepository', {
  dependencies: [Supabase.Default],
  effect: Effect.gen(function* () {
    const supabase = yield* Supabase;

    return {
      getById: (id: string) =>
        Effect.promise(() => supabase.from('profiles').select('*').eq('id', id).single()).pipe(
          Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(supabaseErrorToProfileError(error)) : Effect.succeed(data)
          )
        ),
    };
  }),
}) {}
