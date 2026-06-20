import { Effect, Layer } from 'effect';

import { createSubscriptionStore } from '@/shared/subscription-store';
import { Auth } from './auth';
import type { AuthUser } from './model';

const mockUsers = [
  {
    id: 'mock-user-001',
    email: 'developer@cartiq.local',
    displayName: 'Mock Developer',
    avatarUrl: null,
  },
  {
    id: 'mock-user-002',
    email: 'planner@cartiq.local',
    displayName: 'Mock Planner',
    avatarUrl: null,
  },
  {
    id: 'mock-user-003',
    email: 'buyer@cartiq.local',
    displayName: 'Mock Buyer',
    avatarUrl: null,
  },
] satisfies readonly AuthUser[];

const defaultMockUser = mockUsers[0];

const sessionStore = createSubscriptionStore<AuthUser | null>(defaultMockUser);

export const AuthMock = Layer.succeed(
  Auth,
  new Auth({
    signInWithGoogle: Effect.sync(() => sessionStore.set(defaultMockUser)).pipe(Effect.delay(1000)),
    signOut: Effect.sync(() => sessionStore.set(null)),
    observeUser: (onChange) => Effect.sync(() => sessionStore.subscribe(onChange)),
  })
);
