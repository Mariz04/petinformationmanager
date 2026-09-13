import type { Pet, PetInput } from '../types/pet';

const STORAGE_KEY = 'pet-information-manager-pets';
export const PETS_CHANGED_EVENT = 'pets-changed';

function readPets(): Pet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Pet[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writePets(pets: Pet[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
  window.dispatchEvent(new CustomEvent(PETS_CHANGED_EVENT));
}

export function getPets(): Pet[] {
  return readPets().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function savePet(input: PetInput, id?: string): Pet {
  const pets = readPets();
  const now = new Date().toISOString();

  if (id) {
    const index = pets.findIndex((pet) => pet.id === id);
    if (index >= 0) {
      const updated: Pet = { ...pets[index], ...input, id, updatedAt: now };
      pets[index] = updated;
      writePets(pets);
      return updated;
    }
  }

  const created: Pet = {
    ...input,
    id: crypto.randomUUID(),
    updatedAt: now,
  };
  pets.push(created);
  writePets(pets);
  return created;
}

export function deletePet(id: string) {
  writePets(readPets().filter((pet) => pet.id !== id));
}

export function getPet(id: string): Pet | undefined {
  return readPets().find((pet) => pet.id === id);
}
