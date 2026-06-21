import { Layer } from 'effect';

import { Auth } from '@/auth/service';
import { ProfileRepository } from '@/profile/repository';

export const AppLayer = Layer.mergeAll(Auth.Default, ProfileRepository.Default);
