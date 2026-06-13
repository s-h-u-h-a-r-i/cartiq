import { ManagedRuntime } from 'effect';

import { DataModeLive, DataModeMock } from '@/features/data-mode';

export const AppRuntime = ManagedRuntime.make(
  import.meta.env.MODE === 'mock' ? DataModeMock : DataModeLive
);

export const run = AppRuntime.runPromise.bind(AppRuntime);
