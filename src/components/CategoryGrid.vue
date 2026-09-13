<template>
  <section id="categories" class="categories pim-fade-up" aria-labelledby="categories-title">
    <div class="section-head">
      <p class="eyebrow">Browse by type</p>
      <h2 id="categories-title">Pet Categories</h2>
      <p class="sub">Tap a category to start a new pet profile with that animal type filled in.</p>
    </div>

    <div class="grid">
      <button
        v-for="category in categories"
        :key="category.label"
        type="button"
        class="card"
        @click="$emit('select', category.label)"
      >
        <span class="icon" aria-hidden="true">{{ category.emoji }}</span>
        <strong>{{ category.label }}</strong>
        <span>{{ category.hint }}</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
const categories = [
  { label: 'Dog', emoji: '🐶', hint: 'Loyal companions' },
  { label: 'Cat', emoji: '🐱', hint: 'Curious friends' },
  { label: 'Birds', emoji: '🐦', hint: 'Song & color' },
  { label: 'Fish', emoji: '🐠', hint: 'Calm aquatics' },
  { label: 'Small Pets', emoji: '🐹', hint: 'Tiny treasures' },
  { label: 'Pet Accessories', emoji: '🎀', hint: 'Collars & more' },
  { label: 'Pet Food', emoji: '🍖', hint: 'Meals & treats' },
  { label: 'Grooming', emoji: '✂️', hint: 'Fresh & fluffy' },
];

defineEmits<{
  select: [animalType: string];
}>();
</script>

<style scoped>
.categories {
  margin: 0;
  padding: 8px 16px 20px;
}

.section-head {
  margin-bottom: 18px;
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
  font-size: clamp(1.6rem, 3vw, 2rem);
  font-weight: 700;
  color: var(--pim-ink);
}

.sub {
  margin: 8px 0 0;
  color: var(--pim-muted);
  font-size: 14px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 16px;
  border: 1px solid transparent;
  border-radius: var(--pim-radius-sm);
  background: white;
  box-shadow: var(--pim-shadow);
  text-align: left;
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.card:hover {
  transform: translateY(-4px);
  border-color: var(--pim-pink);
  box-shadow: var(--pim-shadow-hover);
}

.icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-bottom: 6px;
  border-radius: 14px;
  background: var(--pim-pink-soft);
  font-size: 22px;
}

.card strong {
  color: var(--pim-ink);
  font-size: 15px;
  font-weight: 800;
}

.card span:last-child {
  color: var(--pim-muted);
  font-size: 12px;
}

@media (min-width: 700px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1000px) {
  .grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
