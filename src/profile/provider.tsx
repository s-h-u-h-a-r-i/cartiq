import {
  type Accessor,
  createContext,
  createSignal,
  Match,
  onMount,
  type ParentComponent,
  Switch,
  useContext,
} from 'solid-js';

import { useAuth } from '@/auth';
import { LoadingScreen } from '@/layout/loading-screen';
import { type Profile } from './model';
import { type ProfileRepository } from './repository';

interface ProfileContext {
  readonly profile: Accessor<Profile>;
  reloadProfile(): Promise<void>;
}

const ProfileContext = createContext<ProfileContext>();

interface ProfileProviderProps {
  readonly repository: ProfileRepository;
}

export const ProfileProvider: ParentComponent<ProfileProviderProps> = (props) => {
  const auth = useAuth();
  const userId = auth.user().id;
  const [profile, setProfile] = createSignal<Profile | null>(null);
  const [error, setError] = createSignal<Error | null>(null);

  const loadProfile = async (): Promise<void> => {
    setError(null);

    try {
      setProfile(await props.repository.getProfile(userId));
    } catch (error) {
      setProfile(null);
      setError(
        error instanceof Error ? error : new Error('Unable to load profile')
      );
    }
  };

  const reloadProfile = () => loadProfile();

  onMount(() => {
    void loadProfile();
  });

  return (
    <Switch>
      <Match when={error()}>
        {(profileError) => <p role='alert'>{profileError().message}</p>}
      </Match>

      <Match when={profile() === null}>
        <LoadingScreen />
      </Match>

      <Match when={profile()}>
        {(p) => (
          <ProfileContext.Provider value={{ profile: p, reloadProfile }}>
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
