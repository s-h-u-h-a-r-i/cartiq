import {
  Accessor,
  createContext,
  createSignal,
  Match,
  onMount,
  ParentComponent,
  Switch,
  useContext,
} from 'solid-js';

import { run } from '@/app';
import { useAuth } from '@/auth';
import { LoadingScreen } from '@/layout/loading-screen';
import { Effect } from 'effect';
import { Profile, UpdateProfileInput } from './model';
import { ProfileRepository } from './repository';

interface ProfileContext {
  readonly profile: Accessor<Profile>;
  updateProfile(input: UpdateProfileInput): Promise<void>;
  reloadProfile(): Promise<void>;
}

const ProfileContext = createContext<ProfileContext>();

export const ProfileProvider: ParentComponent = (props) => {
  const auth = useAuth();
  const [profile, setProfile] = createSignal<Profile | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  const loadProfile = () =>
    run(
      ProfileRepository.getProfile(auth.user().id).pipe(
        Effect.tap((nextProfile) => Effect.sync(() => setProfile(nextProfile))),
        Effect.tap(() => Effect.sync(() => setError(null))),
        Effect.catchAll((e) => Effect.sync(() => setError(e.message))),
        Effect.ensuring(Effect.sync(() => setIsLoading(false))),
        Effect.asVoid
      )
    );

  const updateProfile = (input: UpdateProfileInput) =>
    run(
      ProfileRepository.updateProfile(auth.user().id, input).pipe(
        Effect.tap((nextProfile) => Effect.sync(() => setProfile(nextProfile))),
        Effect.tap(() => Effect.sync(() => setError(null))),
        Effect.asVoid
      )
    );

  onMount(() => {
    void loadProfile();
  });

  return (
    <Switch>
      <Match when={isLoading()}>
        <LoadingScreen />
      </Match>

      <Match when={error()}>{(message) => <main>{message()}</main>}</Match>

      <Match when={profile()}>
        {(p) => (
          <ProfileContext.Provider
            value={{ profile: p, updateProfile, reloadProfile: loadProfile }}>
            {props.children}
          </ProfileContext.Provider>
        )}
      </Match>
    </Switch>
  );
};

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error(`${useProfile.name} must be used within ${ProfileProvider.name}`);
  }
  return ctx;
}
