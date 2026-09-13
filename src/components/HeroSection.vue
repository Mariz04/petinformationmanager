<template>
  <section id="home" class="hero pim-fade-up" aria-labelledby="hero-title">
    <div class="hero-copy">
      <p class="eyebrow">Pet Information Manager</p>
      <h1 id="hero-title">Everything Your Pet Needs, All in One Place</h1>
      <p class="lede">
        Keep every detail close—name, type, breed, age, owner, and notes—in a soft, modern space made for pet parents.
      </p>
      <div class="hero-actions">
        <button type="button" class="btn primary" @click="$emit('cta', 'form')">Add Pet Now</button>
        <button type="button" class="btn secondary" @click="$emit('cta', 'categories')">Explore Categories</button>
      </div>
    </div>

    <div class="hero-visual" aria-hidden="true">
      <div class="blob" />
      <div class="illustration">
        <ion-icon class="main-paw" :icon="pawOutline" />
        <span class="badge">Soft care · Smart records</span>
      </div>
      <span class="float paw one"><ion-icon :icon="pawOutline" /></span>
      <span class="float heart two"><ion-icon :icon="heartOutline" /></span>
      <span class="float bone three">♡</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { heartOutline, pawOutline } from 'ionicons/icons';

defineEmits<{
  cta: [section: string];
}>();
</script>

<style scoped>
.hero {
  position: relative;
  display: grid;
  gap: 28px;
  margin: 0;
  padding: 8px 16px 20px;
  overflow: hidden;
}

.hero-copy {
  position: relative;
  z-index: 1;
}

.eyebrow {
  margin: 0 0 10px;
  color: var(--pim-pink-dark);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  max-width: 14ch;
  color: var(--pim-ink);
  font-family: var(--pim-display);
  font-size: clamp(2rem, 6vw, 3.4rem);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.03em;
}

.lede {
  margin: 14px 0 0;
  max-width: 36rem;
  color: var(--pim-muted);
  font-size: 1.05rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;
}

.btn {
  border: none;
  border-radius: 999px;
  padding: 13px 22px;
  font: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.btn.primary {
  color: white;
  background: linear-gradient(135deg, var(--pim-pink), var(--pim-pink-dark));
  box-shadow: var(--pim-shadow);
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--pim-shadow-hover);
}

.btn.secondary {
  color: var(--pim-pink-dark);
  background: white;
  border: 1.5px solid var(--pim-border);
}

.btn.secondary:hover {
  transform: translateY(-2px);
  background: var(--pim-pink-soft);
}

.hero-visual {
  position: relative;
  min-height: 240px;
  display: grid;
  place-items: center;
}

.blob {
  position: absolute;
  inset: 10% 8%;
  border-radius: 40% 60% 55% 45% / 45% 40% 60% 55%;
  background: linear-gradient(160deg, #fce7f3, #f9a8d4 55%, #fda4af);
  opacity: 0.85;
  filter: blur(0.2px);
}

.illustration {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  gap: 14px;
  width: min(100%, 320px);
  aspect-ratio: 1;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: var(--pim-shadow);
  backdrop-filter: blur(8px);
}

.main-paw {
  color: var(--pim-pink);
  font-size: 96px;
}

.badge {
  padding: 8px 14px;
  border-radius: 999px;
  color: var(--pim-pink-dark);
  background: var(--pim-pink-soft);
  font-size: 12px;
  font-weight: 800;
}

.float {
  position: absolute;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: white;
  color: var(--pim-pink);
  box-shadow: var(--pim-shadow);
  animation: pim-float 4s ease-in-out infinite;
  font-size: 20px;
}

.float.one {
  top: 12%;
  left: 8%;
}

.float.two {
  top: 18%;
  right: 6%;
  animation-delay: 0.6s;
  color: #fb7185;
}

.float.three {
  bottom: 14%;
  right: 18%;
  animation-delay: 1.1s;
  color: var(--pim-pink-dark);
  font-weight: 700;
}

@media (min-width: 860px) {
  .hero {
    grid-template-columns: 1.05fr 0.95fr;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 20px;
  }

  .hero-visual {
    min-height: 360px;
  }
}
</style>
