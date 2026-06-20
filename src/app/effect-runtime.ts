import { ManagedRuntime } from 'effect';

import { AppLayer } from './app-layer';

export const AppRuntime = ManagedRuntime.make(AppLayer);

export const run = AppRuntime.runPromise.bind(AppRuntime);
