import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import type { PetPayload, PetStatus } from '../types/pet.types';
import { PET_ENDPOINTS } from '../constants/pet.constants';
import { deleteWithRetry, readJsonIfPresent } from './http';

export async function createPet(
  request: APIRequestContext,
  pet: PetPayload,
): Promise<APIResponse> {
  const response = await request.post(PET_ENDPOINTS.base, { data: pet });
  expect(response.ok(), `Create failed: ${response.status()}`).toBeTruthy();
  return response;
}

export async function updatePetByBody(
  request: APIRequestContext,
  pet: PetPayload,
): Promise<APIResponse> {
  const response = await request.put(PET_ENDPOINTS.base, { data: pet });
  expect(response.ok(), `Update failed: ${response.status()}`).toBeTruthy();
  return response;
}

export async function updatePetByQuery(
  request: APIRequestContext,
  petId: number,
  updates: { name?: string; status?: PetStatus },
): Promise<APIResponse> {
  const response = await request.post(PET_ENDPOINTS.byId(petId), { params: updates });
  expect(response.ok(), `Update failed: ${response.status()}`).toBeTruthy();
  return response;
}

export async function getPet(
  request: APIRequestContext,
  petId: number,
): Promise<APIResponse> {
  return request.get(PET_ENDPOINTS.byId(petId));
}

export async function getPetJson(
  request: APIRequestContext,
  petId: number,
): Promise<PetPayload | undefined> {
  const response = await getPet(request, petId);
  if (!response.ok()) return undefined;
  return readJsonIfPresent<PetPayload>(response);
}

export async function deletePet(
  request: APIRequestContext,
  petId: number,
): Promise<APIResponse> {
  return deleteWithRetry(request, PET_ENDPOINTS.byId(petId));
}

export async function findPetsByStatus(
  request: APIRequestContext,
  status: PetStatus,
): Promise<PetPayload[] | undefined> {
  const response = await request.get(PET_ENDPOINTS.findByStatus, {
    params: { status },
  });
  expect(response.ok(), `Find by status failed for: ${status}`).toBeTruthy();
  return readJsonIfPresent<PetPayload[]>(response);
}
