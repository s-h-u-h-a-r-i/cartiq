import { Effect, Layer, ManagedRuntime } from 'effect';

import { type AuthService, AuthLive } from '@/features/auth/auth.service';

export const AppLayer = Layer.mergeAll(AuthLive);

export const AppRuntime = ManagedRuntime.make(AppLayer);

export const run = <A, E>(effect: Effect.Effect<A, E, AuthService>) =>
  AppRuntime.runPromise(effect);

export const runEither = <A, E>(effect: Effect.Effect<A, E, AuthService>) =>
  AppRuntime.runPromise(effect.pipe(Effect.either));
