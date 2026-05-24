import { Layer, ManagedRuntime } from 'effect';

import { AuthService } from '@/features/auth/auth.service';
import { ProfileService } from '@/features/profile/profile.service';

export const AppLayer = Layer.mergeAll(AuthService.Default, ProfileService.Default);

export const AppRuntime = ManagedRuntime.make(AppLayer);

export const run = AppRuntime.runPromise.bind(AppRuntime);
