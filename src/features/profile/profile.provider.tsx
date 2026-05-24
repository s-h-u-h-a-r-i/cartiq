import {
  createContext,
  createResource,
  Show,
  useContext,
  type Accessor,
  type ParentComponent,
} from 'solid-js';

import { run } from '@/lib/runtime';
import { useAuthStore } from '../auth';
import { BlockingLoadGate } from '../loading';
import { ProfileService } from './profile.service';
import type { Profile } from './profile.types';

interface ProfileStore {
  profile: Accessor<Profile>;
}

const ProfileStoreContext = createContext<ProfileStore>();

export const ProfileStoreProvider: ParentComponent = (props) => {
  const authStore = useAuthStore();

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
          <ProfileStoreContext.Provider value={{ profile: p }}>
            {props.children}
          </ProfileStoreContext.Provider>
        )}
      </Show>
    </BlockingLoadGate>
  );
};

export function useProfileStore() {
  const ctx = useContext(ProfileStoreContext);
  if (!ctx) {
    throw new Error(`${useProfileStore.name} must be used within a ${ProfileStoreProvider.name}`);
  }
  return ctx;
}
