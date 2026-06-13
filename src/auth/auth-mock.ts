import { Effect, Layer } from 'effect';

import { createSubscriptionStore } from '@/shared/subscription-store';
import { Auth, type AuthSession, type AuthUser } from './auth';

const mockUser = {
  id: 'mock-user-001',
  email: 'developer@cartiq.local',
  displayName: 'Mock Developer',
  avatarUrl: null,
} satisfies AuthUser;

const mockSession = {
  user: mockUser,
} satisfies AuthSession;

const sessionStore = createSubscriptionStore<AuthSession | null>(mockSession);

export const AuthMock = Layer.succeed(
  Auth,
  new Auth({
    getSession: Effect.sync(sessionStore.get),
    signInWithGoogle: Effect.sync(() => sessionStore.set(mockSession)),
    signOut: Effect.sync(() => sessionStore.set(null)),
    observeSession: (onChange) => Effect.sync(() => sessionStore.subscribe(onChange)),
  })
);
