<template>
  <header class="nav" :class="{ open: menuOpen }">
    <div class="nav-inner">
      <a class="brand" href="#" @click.prevent="go('home')">
        <span class="brand-mark" aria-hidden="true">
          <ion-icon :icon="pawOutline" />
        </span>
        <span class="brand-text">
          <strong>PawPink</strong>
          <small>Pet Information Manager</small>
        </span>
      </a>

      <nav class="nav-links" aria-label="Primary">
        <button
          v-for="item in items"
          :key="item.id"
          type="button"
          class="nav-link"
          :class="{ active: active === item.id }"
          @click="go(item.id)"
        >
          {{ item.label }}
        </button>
      </nav>

      <div class="nav-actions">
        <button type="button" class="icon-btn" aria-label="Search pets" @click="go('list')">
          <ion-icon :icon="searchOutline" />
        </button>
        <button type="button" class="icon-btn" aria-label="Favorites" @click="go('list')">
          <ion-icon :icon="heartOutline" />
        </button>
        <button type="button" class="icon-btn" aria-label="Account" @click="go('form')">
          <ion-icon :icon="personOutline" />
        </button>
        <button type="button" class="cta" @click="go('form')">Add Pet</button>
        <button
          type="button"
          class="menu-btn"
          :aria-expanded="menuOpen"
          aria-label="Toggle menu"
          @click="menuOpen = !menuOpen"
        >
          <ion-icon :icon="menuOpen ? closeOutline : menuOutline" />
        </button>
      </div>
    </div>

    <div v-show="menuOpen" class="mobile-menu" role="navigation" aria-label="Mobile">
      <button
        v-for="item in items"
        :key="`m-${item.id}`"
        type="button"
        class="mobile-link"
        :class="{ active: active === item.id }"
        @click="go(item.id)"
      >
        {{ item.label }}
      </button>
      <button type="button" class="cta full" @click="go('form')">Add Pet</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonIcon } from '@ionic/vue';
import { closeOutline, heartOutline, menuOutline, pawOutline, personOutline, searchOutline } from 'ionicons/icons';

defineProps<{
  active: string;
}>();

const items = [
  { id: 'home', label: 'Home' },
  { id: 'form', label: 'Add Pet' },
  { id: 'list', label: 'Pets' },
  { id: 'categories', label: 'Categories' },
  { id: 'services', label: 'Care Tips' },
];

const menuOpen = ref(false);

const emit = defineEmits<{
  navigate: [section: string];
}>();

function go(section: string) {
  menuOpen.value = false;
  emit('navigate', section);
}
</script>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--pim-border);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 1120px;
  margin: 0 auto;
  padding: 12px 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--pim-ink);
  min-width: 0;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  color: white;
  background: linear-gradient(145deg, var(--pim-pink), var(--pim-pink-dark));
  box-shadow: var(--pim-shadow);
  font-size: 22px;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand-text strong {
  font-family: var(--pim-display);
  font-size: 17px;
  font-weight: 700;
}

.brand-text small {
  color: var(--pim-muted);
  font-size: 11px;
}

.nav-links {
  display: none;
  align-items: center;
  gap: 4px;
}

.nav-link {
  border: none;
  border-radius: 999px;
  padding: 8px 14px;
  color: var(--pim-ink);
  background: transparent;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
}

.nav-link:hover {
  color: var(--pim-pink-dark);
  background: var(--pim-pink-soft);
}

.nav-link.active {
  color: white;
  background: linear-gradient(135deg, var(--pim-pink), var(--pim-pink-dark));
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon-btn,
.menu-btn {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 12px;
  color: var(--pim-ink);
  background: var(--pim-pink-soft);
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.icon-btn:hover,
.menu-btn:hover {
  transform: translateY(-1px);
  background: #fbcfe8;
}

.cta {
  display: none;
  border: none;
  border-radius: 999px;
  padding: 10px 18px;
  color: white;
  background: linear-gradient(135deg, var(--pim-pink), var(--pim-pink-dark));
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: var(--pim-shadow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cta:hover {
  transform: translateY(-1px);
  box-shadow: var(--pim-shadow-hover);
}

.cta.full {
  display: block;
  width: 100%;
  margin-top: 8px;
}

.mobile-menu {
  display: grid;
  gap: 4px;
  padding: 8px 20px 18px;
  border-top: 1px solid var(--pim-border);
  background: white;
}

.mobile-link {
  border: none;
  border-radius: 12px;
  padding: 12px 10px;
  color: var(--pim-ink);
  background: transparent;
  text-align: left;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.mobile-link.active,
.mobile-link:hover {
  background: var(--pim-pink-soft);
  color: var(--pim-pink-dark);
}

@media (min-width: 900px) {
  .nav-links {
    display: flex;
  }

  .cta {
    display: inline-flex;
  }

  .menu-btn,
  .mobile-menu {
    display: none !important;
  }
}

@media (max-width: 899px) {
  .nav-actions .icon-btn:nth-child(1) {
    display: none;
  }
}
</style>
