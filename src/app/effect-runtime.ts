import { ManagedRuntime } from 'effect';

import { AppLayer } from '@/environment';

export const AppRuntime = ManagedRuntime.make(AppLayer);

export const run = AppRuntime.runPromise.bind(AppRuntime);
