<template>
  <section id="add-pet" class="pet-form-shell pim-fade-up" aria-label="Add or edit pet">
    <div class="form-panel">
      <div class="form-topbar">
        <p class="eyebrow">{{ editingId ? 'Update profile' : 'New profile' }}</p>
        <h2>{{ editingId ? 'Edit pet' : 'Add a pet' }}</h2>
        <p class="subtitle">Store pet name, animal type, breed, age, owner name, and notes.</p>
      </div>

      <form class="pet-form" @submit.prevent="submit">
        <label>
          <span>Pet name</span>
          <input v-model.trim="form.name" type="text" name="name" required autocomplete="off" placeholder="e.g. Luna" />
        </label>

        <label>
          <span>Animal type</span>
          <input
            v-model.trim="form.animalType"
            type="text"
            name="animalType"
            required
            autocomplete="off"
            placeholder="e.g. Dog, Cat, Bird"
          />
        </label>

        <label>
          <span>Breed</span>
          <input v-model.trim="form.breed" type="text" name="breed" autocomplete="off" placeholder="e.g. Labrador" />
        </label>

        <label>
          <span>Age</span>
          <input
            v-model.trim="form.age"
            type="text"
            name="age"
            inputmode="numeric"
            autocomplete="off"
            placeholder="e.g. 3 years"
          />
        </label>

        <label>
          <span>Owner name</span>
          <input
            v-model.trim="form.ownerName"
            type="text"
            name="ownerName"
            required
            autocomplete="name"
            placeholder="e.g. Alex Rivera"
          />
        </label>

        <label class="full">
          <span>Notes</span>
          <textarea v-model.trim="form.notes" name="notes" rows="4" placeholder="Diet, vet visits, temperament…" />
        </label>

        <div class="form-actions">
          <button v-if="editingId" type="button" class="btn ghost" :disabled="saving" @click="resetForm">Cancel edit</button>
          <button type="submit" class="btn primary" :disabled="saving">
            {{ saving ? 'Saving…' : editingId ? 'Update pet' : 'Save pet' }}
          </button>
        </div>

        <p v-if="message" class="status-message" role="status">{{ message }}</p>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { emptyPetInput, type PetInput } from '../types/pet';
import { getPet, savePet } from '../services/petStorage';

const EDIT_EVENT = 'pet-edit-requested';
const PREFILL_TYPE_EVENT = 'pet-prefill-type';

const form = reactive<PetInput>(emptyPetInput());
const editingId = ref<string | undefined>();
const message = ref('');
const saving = ref(false);

function resetForm() {
  Object.assign(form, emptyPetInput());
  editingId.value = undefined;
  message.value = '';
}

async function submit() {
  if (!form.name || !form.animalType || !form.ownerName) {
    message.value = 'Pet name, animal type, and owner name are required.';
    return;
  }

  const name = form.name;
  const wasEditing = Boolean(editingId.value);
  saving.value = true;
  message.value = 'Saving to Firebase…';

  try {
    await savePet({ ...form }, editingId.value);
    resetForm();
    message.value = wasEditing ? `${name} updated.` : `${name} saved.`;
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'Could not save pet.';
  } finally {
    saving.value = false;
  }
}

async function onEditRequested(event: Event) {
  const id = (event as CustomEvent<string>).detail;
  message.value = 'Loading pet…';
  try {
    const pet = await getPet(id);
    if (!pet) {
      message.value = 'Pet not found.';
      return;
    }

    editingId.value = pet.id;
    form.name = pet.name;
    form.animalType = pet.animalType;
    form.breed = pet.breed;
    form.age = pet.age;
    form.ownerName = pet.ownerName;
    form.notes = pet.notes;
    message.value = `Editing ${pet.name}`;
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'Could not load pet.';
  }
}

function onPrefillType(event: Event) {
  const animalType = String((event as CustomEvent<string>).detail ?? '');
  if (!animalType) return;
  if (!editingId.value) {
    form.animalType = animalType;
    message.value = `${animalType} selected — finish the profile below.`;
  }
}

onMounted(() => {
  window.addEventListener(EDIT_EVENT, onEditRequested);
  window.addEventListener(PREFILL_TYPE_EVENT, onPrefillType);
});

onUnmounted(() => {
  window.removeEventListener(EDIT_EVENT, onEditRequested);
  window.removeEventListener(PREFILL_TYPE_EVENT, onPrefillType);
});

defineExpose({ resetForm });
</script>

<style scoped>
.pet-form-shell {
  margin: 0;
  padding: 8px 16px 20px;
}

.form-panel {
  padding: 18px clamp(12px, 2vw, 22px);
  border-radius: var(--pim-radius-sm);
  background: var(--pim-bg);
  border: 1px solid var(--pim-border);
}

.form-topbar {
  margin-bottom: 20px;
}

.eyebrow {
  margin: 0 0 6px;
  color: var(--pim-pink-dark);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  font-family: var(--pim-display);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: var(--pim-ink);
}

.subtitle {
  margin: 8px 0 0;
  color: var(--pim-muted);
  font-size: 14px;
  line-height: 1.5;
}

.pet-form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label.full {
  grid-column: 1 / -1;
}

label span {
  color: var(--pim-muted);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

input,
textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid var(--pim-border);
  border-radius: 14px;
  color: var(--pim-ink);
  background: var(--pim-bg);
  font: inherit;
  font-size: 15px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--pim-pink);
  box-shadow: 0 0 0 4px rgba(244, 114, 182, 0.15);
  background: white;
}

textarea {
  resize: vertical;
  min-height: 110px;
}

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 4px;
}

.btn {
  border: none;
  border-radius: 999px;
  padding: 12px 20px;
  font: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn.primary {
  color: white;
  background: linear-gradient(135deg, var(--pim-pink), var(--pim-pink-dark));
  box-shadow: var(--pim-shadow);
}

.btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--pim-shadow-hover);
}

.btn.ghost {
  color: var(--pim-pink-dark);
  background: var(--pim-pink-soft);
}

.status-message {
  grid-column: 1 / -1;
  margin: 2px 0 0;
  color: var(--pim-pink-dark);
  font-size: 13px;
  font-weight: 700;
}

@media (min-width: 640px) {
  .pet-form {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
