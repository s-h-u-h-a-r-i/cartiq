import type {
  PostgrestMaybeSingleResponse,
  Session,
  AuthError as SupabaseAuthError,
} from '@supabase/supabase-js';
import { Effect, Option } from 'effect';

import { Supabase } from '@/supabase';
import { SessionError } from './error';
import {
  decodeSessionAuth,
  decodeSessionProfile,
  encodeSessionProfileUpdateInput,
  ProfileRow,
  SessionAuth,
  SessionProfile,
  SessionProfileUpdateInput,
  SessionUser,
} from './model';

export class AppSession extends Effect.Service<AppSession>()('cartiq/AppSession', {
  accessors: true,
  dependencies: [Supabase.Default],
  effect: Effect.gen(function* () {
    const supabase = yield* Supabase;

    const loadSession = (session: Session | null) =>
      Option.match(Option.fromNullable(session), {
        onNone: () => Effect.succeed(null),
        onSome: (session) =>
          readProfileResponse(() =>
            supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
          ).pipe(
            Effect.flatMap((profileRow) =>
              Effect.all({
                auth: decodeSessionAuth(session.user),
                profile: decodeSessionProfile(profileRow),
              })
            ),
            Effect.map(buildSessionUser)
          ),
      });

    return {
      signInWithGoogle: readAuthResponse(() =>
        supabase.auth.signInWithOAuth({ provider: 'google' })
      ).pipe(Effect.asVoid),

      signOut: readAuthResponse(() => supabase.auth.signOut()).pipe(Effect.asVoid),

      observeSession: (
        onChange: (user: SessionUser | null) => void,
        onError: (error: SessionError) => void
      ) =>
        Effect.sync(() => {
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange((_event, session) => {
            Effect.runFork(
              loadSession(session).pipe(
                Effect.match({
                  onFailure: onError,
                  onSuccess: onChange,
                })
              )
            );
          });

          return () => subscription.unsubscribe();
        }),

      updateProfile: (userId: string, input: SessionProfileUpdateInput) =>
        encodeSessionProfileUpdateInput(input).pipe(
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
          Effect.flatMap(decodeSessionProfile)
        ),
    };
  }),
}) {}

const readAuthResponse = <T extends { readonly error: SupabaseAuthError | null }>(
  request: () => PromiseLike<T>
) =>
  Effect.tryPromise({
    try: request,
    catch: SessionError.fromUnknown,
  }).pipe(
    Effect.filterOrFail(
      (response) => response.error === null,
      (response) => SessionError.fromAuth(response.error!)
    )
  );

const readProfileResponse = (
  request: () => PromiseLike<PostgrestMaybeSingleResponse<ProfileRow>>
) =>
  Effect.tryPromise({ try: request, catch: SessionError.fromUnknown }).pipe(
    Effect.filterOrFail(
      (response) => response.success === true,
      ({ error }) => SessionError.fromPostgrest(error)
    ),
    Effect.filterOrFail((response) => response.data !== null, SessionError.profileNotFound),
    Effect.map(({ data }) => data!)
  );

const buildSessionUser = ({
  auth,
  profile,
}: {
  auth: SessionAuth;
  profile: SessionProfile;
}): SessionUser => ({
  ...profile,
  email: auth.email,
});
