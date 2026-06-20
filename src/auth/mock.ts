import { Effect, Layer } from 'effect';

import { createSubscriptionStore } from '@/shared/subscription-store';
import { Auth } from './auth';
import type { AuthSession, AuthUser } from './model';

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

const defaultMockSession = {
  user: mockUsers[0],
} satisfies AuthSession;

const sessionStore = createSubscriptionStore<AuthSession | null>(defaultMockSession);

export const AuthMock = Layer.succeed(
  Auth,
  new Auth({
    getSession: Effect.sync(sessionStore.get).pipe(Effect.delay(1000)),
    signInWithGoogle: Effect.sync(() => sessionStore.set(defaultMockSession)).pipe(
      Effect.delay(1000)
    ),
    signOut: Effect.sync(() => sessionStore.set(null)),
    observeSession: (onChange) => Effect.sync(() => sessionStore.subscribe(onChange)),
  })
);
