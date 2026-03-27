import { faker } from '@faker-js/faker';
import type { PetPayload, PetStatus } from '../types/pet.types';

export function createPetPayload(overrides: Partial<PetPayload> = {}): PetPayload {
  const id = overrides.id ?? faker.number.int({ min: 100_000, max: 2_000_000_000 });
  const status: PetStatus =
    overrides.status ?? faker.helpers.arrayElement(['available', 'pending', 'sold'] as const);

  return {
    id,
    name: overrides.name ?? `pet-${faker.word.noun()}-${faker.string.alphanumeric(8)}`,
    category: overrides.category ?? {
      id: faker.number.int({ min: 1, max: 10_000 }),
      name: `cat-${faker.word.noun()}`,
    },
    photoUrls: overrides.photoUrls ?? [`https://example.test/${faker.string.alphanumeric(10)}.jpg`],
    tags: overrides.tags ?? [
      {
        id: faker.number.int({ min: 1, max: 10_000 }),
        name: `tag-${faker.word.adjective()}`,
      },
    ],
    status,
  };
}
