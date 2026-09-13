<template>
  <section id="pets" class="pet-list-section pim-fade-up" aria-labelledby="pets-title">
    <div class="list-heading">
      <div>
        <p class="eyebrow">Your collection</p>
        <h2 id="pets-title">Saved pets</h2>
      </div>
      <span class="pet-count">
        <template v-if="loading">Syncing…</template>
        <template v-else>{{ pets.length }} {{ pets.length === 1 ? 'pet' : 'pets' }}</template>
      </span>
    </div>

    <p v-if="error" class="sync-error" role="alert">{{ error }}</p>

    <div v-if="pets.length" class="pet-grid">
      <article v-for="pet in pets" :key="pet.id" class="pet-card">
        <div class="media">
          <span class="avatar" aria-hidden="true">{{ avatarFor(pet.animalType) }}</span>
          <button
            type="button"
            class="fav"
            :class="{ on: favorites.has(pet.id) }"
            :aria-label="favorites.has(pet.id) ? 'Remove favorite' : 'Favorite pet'"
            @click="toggleFavorite(pet.id)"
          >
            <ion-icon :icon="favorites.has(pet.id) ? heart : heartOutline" />
          </button>
          <span v-if="pet.age" class="badge">{{ pet.age }}</span>
        </div>

        <div class="body">
          <p class="category">ID {{ pet.id }} · {{ pet.animalType }}{{ pet.breed ? ` · ${pet.breed}` : '' }}</p>
          <h3>{{ pet.name }}</h3>
          <p class="owner">Owner: {{ pet.ownerName }}</p>
          <p v-if="pet.notes" class="notes">{{ pet.notes }}</p>
          <div class="rating" aria-label="Profile completeness">
            <ion-icon v-for="n in 5" :key="n" :icon="n <= ratingFor(pet) ? star : starOutline" />
          </div>
        </div>

        <div class="actions">
          <button type="button" class="btn primary" @click="editPet(pet.id)">Edit profile</button>
          <button type="button" class="btn danger" aria-label="Delete pet" @click="removePet(pet.id)">
            <ion-icon :icon="trashOutline" />
          </button>
        </div>
      </article>
    </div>

    <div v-else-if="!loading" class="empty-list">
      <ion-icon :icon="pawOutline" />
      <p>No pets saved yet. Add one from the Add Pet tab.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { IonIcon } from '@ionic/vue';
import { heart, heartOutline, pawOutline, star, starOutline, trashOutline } from 'ionicons/icons';
import type { Pet } from '../types/pet';
import { deletePet, subscribeToPets } from '../services/petStorage';

const EDIT_EVENT = 'pet-edit-requested';
const FAVORITES_KEY = 'pet-information-manager-favorites';

const pets = ref<Pet[]>([]);
const favorites = ref(new Set<string>());
const loading = ref(true);
const error = ref('');
let unsubscribe: (() => void) | undefined;

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const ids = raw ? (JSON.parse(raw) as string[]) : [];
    favorites.value = new Set(Array.isArray(ids) ? ids : []);
  } catch {
    favorites.value = new Set();
  }
}

function persistFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites.value]));
}

function toggleFavorite(id: string) {
  const next = new Set(favorites.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  favorites.value = next;
  persistFavorites();
}

function editPet(id: string) {
  window.dispatchEvent(new CustomEvent('pet-tab-change', { detail: 'form' }));
  window.dispatchEvent(new CustomEvent(EDIT_EVENT, { detail: id }));
}

async function removePet(id: string) {
  if (!confirm('Delete this pet record?')) return;
  try {
    await deletePet(id);
    if (favorites.value.has(id)) {
      favorites.value.delete(id);
      favorites.value = new Set(favorites.value);
      persistFavorites();
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Could not delete pet.';
  }
}

function avatarFor(type: string) {
  const t = type.toLowerCase();
  if (t.includes('dog')) return '🐶';
  if (t.includes('cat')) return '🐱';
  if (t.includes('bird')) return '🐦';
  if (t.includes('fish')) return '🐠';
  if (t.includes('groom')) return '✂️';
  if (t.includes('food')) return '🍖';
  if (t.includes('access')) return '🎀';
  return '🐾';
}

function ratingFor(pet: Pet) {
  let score = 2;
  if (pet.breed) score += 1;
  if (pet.age) score += 1;
  if (pet.notes) score += 1;
  return score;
}

onMounted(() => {
  loadFavorites();
  unsubscribe = subscribeToPets(
    (next) => {
      pets.value = next;
      loading.value = false;
      error.value = '';
    },
    (err) => {
      loading.value = false;
      error.value = err.message;
    },
  );
});

onUnmounted(() => unsubscribe?.());
</script>

<style scoped>
.pet-list-section {
  margin: 0;
  padding: 8px 16px 20px;
}

.list-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
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
}

.pet-count {
  color: var(--pim-muted);
  font-size: 13px;
  font-weight: 700;
}

.sync-error {
  margin: 0 0 12px;
  padding: 10px 12px;
  border-radius: 12px;
  color: #9f1239;
  background: #ffe4e6;
  font-size: 13px;
  font-weight: 700;
}

.pet-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.pet-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--pim-radius-sm);
  background: white;
  box-shadow: var(--pim-shadow);
  border: 1px solid transparent;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.pet-card:hover {
  transform: translateY(-4px);
  border-color: var(--pim-pink);
  box-shadow: var(--pim-shadow-hover);
}

.media {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 120px;
  background: linear-gradient(160deg, #fce7f3, #fff7fb 60%, #fbcfe8);
  overflow: hidden;
}

.avatar {
  font-size: 52px;
  transition: transform 0.35s ease;
}

.pet-card:hover .avatar {
  transform: scale(1.08);
}

.fav {
  position: absolute;
  top: 10px;
  right: 10px;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  color: var(--pim-pink-dark);
  background: white;
  font-size: 18px;
  cursor: pointer;
  box-shadow: var(--pim-shadow);
}

.fav.on {
  color: #e11d48;
}

.badge {
  position: absolute;
  left: 10px;
  bottom: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  color: white;
  background: var(--pim-pink);
  font-size: 11px;
  font-weight: 800;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 12px 0;
}

.category {
  margin: 0;
  color: var(--pim-pink-dark);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: var(--pim-ink);
}

.owner,
.notes {
  margin: 0;
  color: var(--pim-muted);
  font-size: 12px;
  line-height: 1.4;
}

.notes {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rating {
  display: flex;
  gap: 2px;
  margin-top: 4px;
  color: #f59e0b;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 8px;
  padding: 12px;
  margin-top: auto;
}

.btn {
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font: inherit;
  transition: transform 0.2s ease, background 0.2s ease;
}

.btn.primary {
  flex: 1;
  padding: 10px 12px;
  color: white;
  background: linear-gradient(135deg, var(--pim-pink), var(--pim-pink-dark));
  font-size: 12px;
  font-weight: 800;
}

.btn.primary:hover {
  transform: translateY(-1px);
}

.btn.danger {
  display: grid;
  place-items: center;
  width: 40px;
  color: #be123c;
  background: #ffe4e6;
  font-size: 18px;
}

.empty-list {
  display: grid;
  min-height: 160px;
  place-items: center;
  align-content: center;
  gap: 10px;
  padding: 28px;
  border: 1.5px dashed var(--pim-border);
  border-radius: var(--pim-radius);
  color: var(--pim-muted);
  background: white;
  text-align: center;
}

.empty-list ion-icon {
  color: var(--pim-pink);
  font-size: 34px;
}

.empty-list p {
  margin: 0;
  font-size: 14px;
}

@media (min-width: 700px) {
  .pet-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1000px) {
  .pet-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
