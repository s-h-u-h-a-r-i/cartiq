import { Effect } from 'effect';
import { ProfileRepository } from './profile.repository';

export class ProfileService extends Effect.Service<ProfileService>()('ProfileService', {
  accessors: true,
  dependencies: [ProfileRepository.Default],
  effect: Effect.gen(function* () {
    const repo = yield* ProfileRepository;
    return {
      getById: (userId: string) => repo.getById(userId),
    };
  }),
}) {}
