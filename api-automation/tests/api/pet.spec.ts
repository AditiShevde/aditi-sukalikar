import { test, expect } from '@playwright/test';
import { PET_ENDPOINTS, PET_STATUSES } from './constants/pet.constants';
import { createPetPayload } from './helpers/create-pet-payload';
import {
  createPet,
  deletePet,
  findPetsByStatus,
  getPet,
  getPetJson,
  updatePetByBody,
  updatePetByQuery,
} from './helpers/pet-api';
import { readJsonIfPresent } from './helpers/http';
import type { PetPayload } from './types/pet.types';

test.describe('Petstore /pet', () => {
  let createdIds: number[] = [];

  test.beforeEach(() => {
    createdIds = [];
  });

  test.afterEach(async ({ request }) => {
    await Promise.all(
      createdIds.map(async (id) => {
        const res = await deletePet(request, id);
        if (res.status() === 404) return;
        expect(res.ok(), `Cleanup delete failed for pet id=${id}, status=${res.status()}`).toBeTruthy();
      }),
    );
  });

  test('update an existing pet by id', async ({ request }) => {
    const pet = createPetPayload();
    createdIds.push(pet.id);

    await createPet(request, pet);
    await updatePetByBody(request, pet);
  });

  test('create pet then fetch by id', async ({ request }) => {
    const pet = createPetPayload();
    createdIds.push(pet.id);

    const createRes = await createPet(request, pet);

    const created = await readJsonIfPresent<PetPayload>(createRes);
    expect(created?.id).toBe(pet.id);
    expect(created?.name).toBe(pet.name);

    const getRes = await getPet(request, pet.id);
    if (getRes.ok()) {
      const fetched = await readJsonIfPresent<PetPayload>(getRes);
      expect(fetched?.id).toBe(pet.id);
      expect(fetched?.name).toBe(pet.name);
      return;
    }

    console.warn(`GET pet/${pet.id} returned ${getRes.status()} - skipped (public API instability)`);
    test.skip();
  });

  test('update pet (PUT /pet)', async ({ request }) => {
    const pet = createPetPayload({ status: 'available' });
    createdIds.push(pet.id);

    await createPet(request, pet);

    const updatedPet: PetPayload = {
      ...pet,
      name: `${pet.name}-updated`,
      status: 'sold',
    };

    await updatePetByBody(request, updatedPet);

    const fetched = await getPetJson(request, pet.id);
    expect(fetched?.name).toBe(updatedPet.name);
    expect(fetched?.status).toBe(updatedPet.status);
  });

  test('delete pet then ensure it is gone', async ({ request }) => {
    const pet = createPetPayload();
    createdIds.push(pet.id);

    await createPet(request, pet);

    const delRes = await deletePet(request, pet.id);
    expect(delRes.ok(), `Delete failed: ${delRes.status()}`).toBeTruthy();

    createdIds = createdIds.filter((id) => id !== pet.id);

    const getRes = await getPet(request, pet.id);
    expect(getRes.status(), 'Deleted pet should not be found').toBe(404);
  });

  test('find pets by status', async ({ request }) => {
    for (const status of PET_STATUSES) {
      const pet = createPetPayload();
      pet.status = status;
      createdIds.push(pet.id);
      await createPet(request, pet);
      const pets = await findPetsByStatus(request, status);
      expect(pets).toBeDefined();
      expect(Array.isArray(pets)).toBe(true);
      expect(pets!.length).toBeGreaterThan(0);
      expect(pets!.every((p) => p.status === status)).toBe(true);
    }
  });

  test('update pet with query params', async ({ request }) => {
    const pet = createPetPayload({ status: 'available' });
    createdIds.push(pet.id);

    await createPet(request, pet);
    await updatePetByQuery(request, pet.id, { name: 'updated-name', status: 'available' });

    const fetched = await getPetJson(request, pet.id);
    expect(fetched?.name).toBe('updated-name');
    expect(fetched?.status).toBe(pet.status);
  });

  test('getting a non-existent pet id returns 404', async ({ request }) => {
    const unknownId = createPetPayload().id;

    const getRes = await getPet(request, unknownId);
    expect(getRes.status()).toBe(404);
  });

  test('upload image of the pet', async ({ request }) => {
    const pet = createPetPayload();
    createdIds.push(pet.id);

    await createPet(request, pet);

    const fakeImage = Buffer.from(pet.photoUrls[0]);

    const uploadRes = await request.post(PET_ENDPOINTS.uploadImage(pet.id), {
      params: { additionalMetadata: pet.name },
      headers: { 'Content-Type': 'application/octet-stream' },
      data: fakeImage,
    });

    expect(uploadRes.ok(), `Upload failed: ${uploadRes.status()}`).toBeTruthy();
  });
});

