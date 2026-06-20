import { Layer } from 'effect';

import { Auth } from '@/auth';
import { ProfileRepository } from '@/profile';

export const AppLayer = Layer.mergeAll(Auth.Default, ProfileRepository.Default);
