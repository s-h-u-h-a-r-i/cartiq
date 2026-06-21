import { Effect } from 'effect';
import {
  Accessor,
  createContext,
  createEffect,
  createSignal,
  Match,
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
  const [profile, setProfile] = createSignal<Profile | null>(null);
  const [, setError] = createSignal<string | null>(null);

  const loadProfile = (userId: string) =>
    run(
      ProfileRepository.getProfile(userId).pipe(
        Effect.tap((nextProfile) =>
          Effect.sync(() => {
            if (auth.user().id === userId) {
              setProfile(nextProfile);
              setError(null);
            }
          })
        ),
        Effect.catchAll((e) =>
          Effect.sync(() => {
            if (auth.user().id === userId) {
              setProfile(null);
              setError(e.message);
            }
          })
        ),
        Effect.asVoid
      )
    );

  const reloadProfile = () => loadProfile(auth.user().id);

  const updateProfile = (input: ProfileUpdateInput) => {
    const userId = auth.user().id;

    return run(
      ProfileRepository.updateProfile(userId, input).pipe(
        Effect.tap((nextProfile) =>
          Effect.sync(() => {
            if (auth.user().id === userId) {
              setProfile(nextProfile);
              setError(null);
            }
          })
        ),
        Effect.asVoid
      )
    );
  };

  createEffect(() => {
    const userId = auth.user().id;
    setProfile(null);
    void loadProfile(userId);
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

