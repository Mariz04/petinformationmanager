<template>
  <section id="services" class="services pim-fade-up" aria-labelledby="services-title">
    <div class="section-head">
      <p class="eyebrow">Gentle care</p>
      <h2 id="services-title">Pet Care Essentials</h2>
      <p class="sub">A premium feel for everyday pet parenting—organized, soft, and easy.</p>
    </div>

    <div class="grid">
      <article v-for="item in items" :key="item.title" class="card">
        <span class="icon" aria-hidden="true">{{ item.icon }}</span>
        <h3>{{ item.title }}</h3>
        <p>{{ item.text }}</p>
      </article>
    </div>

    <div class="offers">
      <div class="offers-copy">
        <p class="eyebrow">Paw-some reminder</p>
        <h3>Keep profiles fresh</h3>
        <p>Update age, notes, and owner info anytime so every visit and delivery stays accurate.</p>
      </div>
      <button type="button" class="shop-deal" @click="$emit('cta', 'list')">View My Pets</button>
      <span class="deco" aria-hidden="true">🐾</span>
    </div>
  </section>
</template>

<script setup lang="ts">
const items = [
  {
    icon: '✨',
    title: 'Grooming Notes',
    text: 'Track coat care, baths, and salon visits in each pet’s notes.',
  },
  {
    icon: '💗',
    title: 'Pet Care',
    text: 'Store temperament, diet, and daily routines in one calm place.',
  },
  {
    icon: '🩺',
    title: 'Veterinary Records',
    text: 'Keep appointment reminders and health notes ready when you need them.',
  },
  {
    icon: '🚚',
    title: 'Supplies Ready',
    text: 'Know each pet’s type and age when ordering food and accessories.',
  },
];

defineEmits<{
  cta: [section: string];
}>();
</script>

<style scoped>
.services {
  margin: 0;
  padding: 8px 16px 24px;
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
}

.sub {
  margin: 8px 0 0;
  color: var(--pim-muted);
  font-size: 14px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.card {
  padding: 18px;
  border-radius: var(--pim-radius-sm);
  background: white;
  box-shadow: var(--pim-shadow);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: var(--pim-shadow-hover);
}

.icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  margin-bottom: 10px;
  border-radius: 12px;
  background: var(--pim-pink-soft);
  font-size: 20px;
}

h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
}

.card p {
  margin: 6px 0 0;
  color: var(--pim-muted);
  font-size: 13px;
  line-height: 1.5;
}

.offers {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 22px;
  padding: 22px;
  overflow: hidden;
  border-radius: var(--pim-radius);
  color: white;
  background: linear-gradient(135deg, #f472b6, #db2777 55%, #fb7185);
  box-shadow: var(--pim-shadow-hover);
}

.offers-copy h3 {
  margin: 0;
  font-family: var(--pim-display);
  font-size: 1.4rem;
}

.offers-copy p:last-child {
  margin: 6px 0 0;
  max-width: 36rem;
  opacity: 0.95;
  font-size: 14px;
}

.offers .eyebrow {
  color: #ffe4f1;
}

.shop-deal {
  position: relative;
  z-index: 1;
  border: none;
  border-radius: 999px;
  padding: 12px 20px;
  color: var(--pim-pink-dark);
  background: white;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.shop-deal:hover {
  transform: translateY(-2px);
}

.deco {
  position: absolute;
  right: 18px;
  bottom: -8px;
  font-size: 72px;
  opacity: 0.22;
  pointer-events: none;
}

@media (min-width: 720px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1000px) {
  .grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
