import type { PetStatus } from '../types/pet.types';

export const PET_ENDPOINTS = {
  base: 'pet',
  byId: (petId: number) => `pet/${petId}`,
  findByStatus: 'pet/findByStatus',
  uploadImage: (petId: number) => `pet/${petId}/uploadImage`,
} as const;

export const PET_STATUSES: PetStatus[] = ['available', 'pending', 'sold'];
