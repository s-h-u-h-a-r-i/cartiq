import { Effect } from 'effect';
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
import { Profile, ProfileUpdateInput } from './model';
import { ProfileRepository } from './repository';

interface ProfileContext {
  readonly profile: Accessor<Profile>;
  reloadProfile(): Promise<void>;
  updateProfile(input: ProfileUpdateInput): Promise<void>;
}

const ProfileContext = createContext<ProfileContext>();

export const ProfileProvider: ParentComponent = (props) => {
  const auth = useAuth();
  const userId = auth.user().id;
  const [profile, setProfile] = createSignal<Profile | null>(null);
  const [, setError] = createSignal<string | null>(null);

  const loadProfile = () =>
    run(
      ProfileRepository.getProfile(userId).pipe(
        Effect.tap((nextProfile) =>
          Effect.sync(() => {
            setProfile(nextProfile);
            setError(null);
          })
        ),
        Effect.catchAll((e) =>
          Effect.sync(() => {
            setProfile(null);
            setError(e.message);
          })
        ),
        Effect.asVoid
      )
    );

  const reloadProfile = () => loadProfile();

  const updateProfile = (input: ProfileUpdateInput) =>
    run(
      ProfileRepository.updateProfile(userId, input).pipe(
        Effect.tap((nextProfile) =>
          Effect.sync(() => {
            setProfile(nextProfile);
            setError(null);
          })
        ),
        Effect.asVoid
      )
    );

  onMount(() => {
    void loadProfile();
  });

  return (
    <Switch>
      <Match when={profile() === null}>
        <LoadingScreen />
      </Match>

      <Match when={profile()}>
        {(p) => (
          <ProfileContext.Provider value={{ profile: p, reloadProfile, updateProfile }}>
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
