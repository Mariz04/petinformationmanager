export interface Pet {
  id: string;
  name: string;
  animalType: string;
  breed: string;
  age: string;
  ownerName: string;
  notes: string;
  updatedAt: string;
}

export type PetInput = Omit<Pet, 'id' | 'updatedAt'>;

export const emptyPetInput = (): PetInput => ({
  name: '',
  animalType: '',
  breed: '',
  age: '',
  ownerName: '',
  notes: '',
});
