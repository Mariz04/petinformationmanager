<template>
	<section class="pet-list-section" aria-labelledby="pets-title">
		<div class="list-heading">
			<div>
				<p class="eyebrow">Pet Information Manager</p>
				<h2 id="pets-title">Saved pets</h2>
			</div>
			<span class="pet-count">{{ pets.length }} {{ pets.length === 1 ? 'PET' : 'PETS' }}</span>
		</div>

		<ul v-if="pets.length" class="pet-list">
			<li v-for="pet in pets" :key="pet.id" class="pet-card">
				<div class="pet-card-main">
					<strong>{{ pet.name }}</strong>
					<span class="meta">{{ pet.animalType }}{{ pet.breed ? ` · ${pet.breed}` : '' }}</span>
					<span class="meta">Age: {{ pet.age || '—' }} · Owner: {{ pet.ownerName }}</span>
					<p v-if="pet.notes" class="notes">{{ pet.notes }}</p>
				</div>
				<div class="pet-card-actions">
					<ion-button fill="clear" size="small" aria-label="Edit pet" @click="editPet(pet.id)">
						<ion-icon slot="icon-only" :icon="createOutline" />
					</ion-button>
					<ion-button fill="clear" size="small" color="danger" aria-label="Delete pet" @click="removePet(pet.id)">
						<ion-icon slot="icon-only" :icon="trashOutline" />
					</ion-button>
				</div>
			</li>
		</ul>

		<div v-else class="empty-list">
			<ion-icon :icon="pawOutline" />
			<p>No pets saved yet. Add one from the Add Pet tab.</p>
		</div>
	</section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { IonButton, IonIcon } from '@ionic/vue';
import { createOutline, pawOutline, trashOutline } from 'ionicons/icons';
import type { Pet } from '../types/pet';
import { deletePet, getPets, PETS_CHANGED_EVENT } from '../services/petStorage';

const EDIT_EVENT = 'pet-edit-requested';
const pets = ref<Pet[]>([]);

function refresh() {
	pets.value = getPets();
}

function editPet(id: string) {
	window.dispatchEvent(new CustomEvent('pet-tab-change', { detail: 'form' }));
	window.dispatchEvent(new CustomEvent(EDIT_EVENT, { detail: id }));
}

function removePet(id: string) {
	if (!confirm('Delete this pet record?')) return;
	deletePet(id);
}

onMounted(() => {
	refresh();
	window.addEventListener(PETS_CHANGED_EVENT, refresh);
});

onUnmounted(() => window.removeEventListener(PETS_CHANGED_EVENT, refresh));
</script>

<style scoped>
.pet-list-section {
	--ink: #f5f1e8;
	--muted: #a7aaa2;
	--lime: #d9f26c;
	max-width: 720px;
	margin: 0 auto;
	padding: 18px clamp(20px, 5vw, 72px) 42px;
	color: var(--ink);
}

.list-heading {
	display: flex;
	align-items: end;
	justify-content: space-between;
	gap: 12px;
	margin-bottom: 18px;
}

.eyebrow {
	margin: 0 0 4px;
	color: var(--lime);
	font-size: 10px;
	font-weight: 700;
	letter-spacing: 1.8px;
	text-transform: uppercase;
}

h2 {
	margin: 0;
	font-family: Georgia, 'Times New Roman', serif;
	font-size: 26px;
	font-weight: 400;
}

.pet-count {
	color: var(--muted);
	font-size: 10px;
	letter-spacing: 1px;
}

.pet-list {
	list-style: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.pet-card {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 12px;
	padding: 14px 16px;
	border: 1px solid #303b37;
	border-radius: 4px;
	background: #1b2221;
}

.pet-card-main {
	display: flex;
	flex-direction: column;
	gap: 4px;
	min-width: 0;
}

.pet-card-main strong {
	font-size: 16px;
	font-weight: 600;
}

.meta {
	color: var(--muted);
	font-size: 12px;
}

.notes {
	margin: 6px 0 0;
	color: #d5d8cf;
	font-size: 13px;
	line-height: 1.45;
	white-space: pre-wrap;
}

.pet-card-actions {
	display: flex;
	flex-shrink: 0;
}

.pet-card-actions ion-button {
	--color: var(--lime);
	margin: 0;
}

.empty-list {
	display: grid;
	min-height: 140px;
	place-items: center;
	align-content: center;
	gap: 8px;
	border: 1px dashed #3d4944;
	color: var(--muted);
	text-align: center;
	padding: 24px;
}

.empty-list ion-icon {
	color: var(--lime);
	font-size: 28px;
}

.empty-list p {
	margin: 0;
	font-size: 13px;
}
</style>
