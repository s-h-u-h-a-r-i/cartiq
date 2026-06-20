import { Effect, Layer } from 'effect';

import { createSubscriptionStore } from '@/shared/subscription-store';
import { Profile, UpdateProfileInput } from './model';
import { ProfileRepository } from './repository';

const defaultMockProfile = {
  id: 'mock-user-001',
  displayName: 'Mock Devloper',
  avatarUrl: null,
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
} satisfies Profile;

const profileStore = createSubscriptionStore<Profile>(defaultMockProfile);

export const ProfileRepositoryMock = Layer.succeed(
  ProfileRepository,
  new ProfileRepository({
    getProfile: () => Effect.sync(profileStore.get).pipe(Effect.delay(500)),
    updateProfile: (_userId: string, input: UpdateProfileInput) =>
      Effect.sync(() =>
        profileStore.update((currentProfile) => ({
          ...currentProfile,
          displayName: input.displayName ?? currentProfile.displayName,
          avatarUrl: input.avatarUrl ?? currentProfile.avatarUrl,
          updatedAt: new Date().toISOString(),
        }))
      ).pipe(Effect.delay(500)),
  })
);
