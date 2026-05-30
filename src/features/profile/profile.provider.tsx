import {
  createContext,
  createResource,
  Show,
  useContext,
  type Accessor,
  type ParentComponent,
} from 'solid-js';

import { run } from '@/lib/runtime';
import { useAuth } from '../auth';
import { BlockingLoadGate } from '../loading';
import type { Profile } from './profile.schema';
import { ProfileService } from './profile.service';

interface ProfileStore {
  profile: Accessor<Profile>;
}

const ProfileContext = createContext<ProfileStore>();

export const ProfileProvider: ParentComponent = (props) => {
  const authStore = useAuth();

  const [profile] = createResource(
    () => authStore.user().id,
    (userId) => run(ProfileService.getById(userId))
  );

  return (
    <BlockingLoadGate isLoading={profile.loading} loadingMessage='Loading profile...'>
      <Show
        when={profile()}
        fallback={
          <h1>
            This should not happen, but we need something like BlockingLoadingGate, but to show
            error
          </h1>
        }>
        {(p) => (
          <ProfileContext.Provider value={{ profile: p }}>{props.children}</ProfileContext.Provider>
        )}
      </Show>
    </BlockingLoadGate>
  );
};

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error(`${useProfile.name} must be used within a ${ProfileProvider.name}`);
  }
  return ctx;
}
