<template>
	<section class="pet-form-shell" aria-label="Add or edit pet">
		<div class="form-topbar">
			<div>
				<p class="eyebrow">Pet Information Manager</p>
				<h1>{{ editingId ? 'Edit pet' : 'Add a pet' }}</h1>
				<p class="subtitle">Store pet name, animal type, breed, age, owner name, and notes.</p>
			</div>
		</div>

		<form class="pet-form" @submit.prevent="submit">
			<label>
				<span>Pet name</span>
				<input v-model.trim="form.name" type="text" name="name" required autocomplete="off" placeholder="e.g. Luna" />
			</label>

			<label>
				<span>Animal type</span>
				<input v-model.trim="form.animalType" type="text" name="animalType" required autocomplete="off" placeholder="e.g. Dog, Cat, Bird" />
			</label>

			<label>
				<span>Breed</span>
				<input v-model.trim="form.breed" type="text" name="breed" autocomplete="off" placeholder="e.g. Labrador" />
			</label>

			<label>
				<span>Age</span>
				<input v-model.trim="form.age" type="text" name="age" inputmode="numeric" autocomplete="off" placeholder="e.g. 3 years" />
			</label>

			<label>
				<span>Owner name</span>
				<input v-model.trim="form.ownerName" type="text" name="ownerName" required autocomplete="name" placeholder="e.g. Alex Rivera" />
			</label>

			<label class="full">
				<span>Notes</span>
				<textarea v-model.trim="form.notes" name="notes" rows="4" placeholder="Diet, vet visits, temperament…" />
			</label>

			<div class="form-actions">
				<ion-button v-if="editingId" type="button" fill="outline" class="secondary" @click="resetForm">Cancel edit</ion-button>
				<ion-button type="submit" class="primary">{{ editingId ? 'Update pet' : 'Save pet' }}</ion-button>
			</div>

			<p v-if="message" class="status-message" role="status">{{ message }}</p>
		</form>
	</section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { IonButton } from '@ionic/vue';
import { emptyPetInput, type PetInput } from '../types/pet';
import { getPet, savePet } from '../services/petStorage';

const EDIT_EVENT = 'pet-edit-requested';

const form = reactive<PetInput>(emptyPetInput());
const editingId = ref<string | undefined>();
const message = ref('');

function resetForm() {
	Object.assign(form, emptyPetInput());
	editingId.value = undefined;
	message.value = '';
}

function submit() {
	if (!form.name || !form.animalType || !form.ownerName) {
		message.value = 'Pet name, animal type, and owner name are required.';
		return;
	}

	const name = form.name;
	const wasEditing = Boolean(editingId.value);
	savePet({ ...form }, editingId.value);
	resetForm();
	message.value = wasEditing ? `${name} updated.` : `${name} saved.`;
}

function onEditRequested(event: Event) {
	const id = (event as CustomEvent<string>).detail;
	const pet = getPet(id);
	if (!pet) return;

	editingId.value = pet.id;
	form.name = pet.name;
	form.animalType = pet.animalType;
	form.breed = pet.breed;
	form.age = pet.age;
	form.ownerName = pet.ownerName;
	form.notes = pet.notes;
	message.value = `Editing ${pet.name}`;
}

onMounted(() => window.addEventListener(EDIT_EVENT, onEditRequested));
onUnmounted(() => window.removeEventListener(EDIT_EVENT, onEditRequested));

defineExpose({ resetForm });
</script>

<style scoped>
:global(body) {
	background: #101313;
}

.pet-form-shell {
	--ink: #f5f1e8;
	--muted: #a7aaa2;
	--lime: #d9f26c;
	min-height: 100%;
	padding: 28px clamp(20px, 5vw, 72px) 24px;
	color: var(--ink);
	background: radial-gradient(circle at 85% 0%, #304140 0, transparent 31%), #101313;
}

.form-topbar {
	max-width: 720px;
	margin: 0 auto 28px;
}

.eyebrow {
	margin: 0 0 5px;
	color: var(--lime);
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 2px;
	text-transform: uppercase;
}

h1 {
	margin: 0;
	font-family: Georgia, 'Times New Roman', serif;
	font-size: clamp(30px, 5vw, 48px);
	font-weight: 400;
	letter-spacing: -1px;
}

.subtitle {
	margin: 10px 0 0;
	max-width: 36rem;
	color: var(--muted);
	font-size: 14px;
	line-height: 1.5;
}

.pet-form {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
	max-width: 720px;
	margin: 0 auto;
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
	color: var(--muted);
	font-size: 11px;
	font-weight: 600;
	letter-spacing: 1px;
	text-transform: uppercase;
}

input,
textarea {
	width: 100%;
	padding: 12px 14px;
	border: 1px solid #3d4944;
	border-radius: 4px;
	color: var(--ink);
	background: #1b2221;
	font: inherit;
	font-size: 15px;
}

input:focus,
textarea:focus {
	outline: 1px solid var(--lime);
	border-color: var(--lime);
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
	margin-top: 8px;
}

.primary {
	--background: var(--lime);
	--color: #131717;
	--border-radius: 4px;
	--box-shadow: none;
	margin: 0;
	font-weight: 600;
	text-transform: none;
}

.secondary {
	--border-color: #48514d;
	--color: var(--ink);
	--border-radius: 4px;
	margin: 0;
	text-transform: none;
}

.status-message {
	grid-column: 1 / -1;
	min-height: 18px;
	margin: 4px 0 0;
	color: var(--lime);
	font-size: 13px;
}

@media (max-width: 560px) {
	.pet-form {
		grid-template-columns: 1fr;
	}
}
</style>
