import { get, onValue, ref, remove, runTransaction, set, update, type Unsubscribe } from 'firebase/database';
import type { Pet, PetInput } from '../types/pet';
import { getRealtimeDb, isFirebaseConfigured } from '../firebase/config';

export const PETS_CHANGED_EVENT = 'pets-changed';
const PETS_PATH = 'pets';
const COUNTER_PATH = 'counters/nextPetId';

type PetRecord = Omit<Pet, 'id'>;

function petsRef() {
  return ref(getRealtimeDb(), PETS_PATH);
}

function petRef(id: string) {
  return ref(getRealtimeDb(), `${PETS_PATH}/${id}`);
}

function formatPetId(n: number) {
  return String(n).padStart(4, '0');
}

/** Next sequential id: 0001, 0002, … */
async function allocatePetId(): Promise<string> {
  const counterRef = ref(getRealtimeDb(), COUNTER_PATH);
  const result = await runTransaction(counterRef, (current) => {
    const next = typeof current === 'number' && current > 0 ? current + 1 : 1;
    return next;
  });

  const value = result.snapshot.val();
  if (typeof value !== 'number') {
    throw new Error('Could not allocate pet id');
  }
  return formatPetId(value);
}

function mapSnapshot(value: unknown): Pet[] {
  if (!value || typeof value !== 'object') return [];

  return Object.entries(value as Record<string, PetRecord>)
    .map(([id, data]) => ({
      id,
      name: data?.name ?? '',
      animalType: data?.animalType ?? '',
      breed: data?.breed ?? '',
      age: data?.age ?? '',
      ownerName: data?.ownerName ?? '',
      notes: data?.notes ?? '',
      updatedAt: data?.updatedAt ?? '',
    }))
    .sort((a, b) => {
      const aNum = Number.parseInt(a.id, 10);
      const bNum = Number.parseInt(b.id, 10);
      if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
}

function notifyChanged() {
  window.dispatchEvent(new CustomEvent(PETS_CHANGED_EVENT));
}

export async function getPets(): Promise<Pet[]> {
  if (!isFirebaseConfigured()) return [];
  const snapshot = await get(petsRef());
  return mapSnapshot(snapshot.val());
}

export async function getPet(id: string): Promise<Pet | undefined> {
  if (!isFirebaseConfigured()) return undefined;
  const snapshot = await get(petRef(id));
  if (!snapshot.exists()) return undefined;
  const data = snapshot.val() as PetRecord;
  return {
    id,
    name: data.name ?? '',
    animalType: data.animalType ?? '',
    breed: data.breed ?? '',
    age: data.age ?? '',
    ownerName: data.ownerName ?? '',
    notes: data.notes ?? '',
    updatedAt: data.updatedAt ?? '',
  };
}

export async function savePet(input: PetInput, id?: string): Promise<Pet> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured. Add your keys to .env');
  }

  const now = new Date().toISOString();
  const payload: PetRecord = {
    ...input,
    updatedAt: now,
  };

  if (id) {
    await update(petRef(id), payload);
    notifyChanged();
    return { id, ...payload };
  }

  const newId = await allocatePetId();
  await set(petRef(newId), payload);
  notifyChanged();
  return { id: newId, ...payload };
}

export async function deletePet(id: string): Promise<void> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured. Add your keys to .env');
  }
  await remove(petRef(id));
  notifyChanged();
}

/** Live sync — call the returned function to unsubscribe. */
export function subscribeToPets(
  onData: (pets: Pet[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  if (!isFirebaseConfigured()) {
    onData([]);
    onError?.(new Error('Firebase is not configured. Add your keys to .env'));
    return () => undefined;
  }

  return onValue(
    petsRef(),
    (snapshot) => {
      onData(mapSnapshot(snapshot.val()));
    },
    (error) => {
      onError?.(error);
    },
  );
}
