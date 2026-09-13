<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="page">
        <AppNavbar :active="activeTab" @navigate="setTab" />

        <div class="workspace">
          <div class="panel">
            <div class="panel-head">
              <div>
                <p class="eyebrow">PawPink workspace</p>
                <h1>{{ panelTitle }}</h1>
              </div>
            </div>

            <ion-segment
              class="panel-tabs"
              :value="activeTab"
              scrollable
              aria-label="Workspace tabs"
              @ionChange="onSegmentChange"
            >
              <ion-segment-button value="home">
                <ion-label>Home</ion-label>
              </ion-segment-button>
              <ion-segment-button value="form">
                <ion-label>Add Pet</ion-label>
              </ion-segment-button>
              <ion-segment-button value="list">
                <ion-label>Pets</ion-label>
              </ion-segment-button>
              <ion-segment-button value="categories">
                <ion-label>Categories</ion-label>
              </ion-segment-button>
              <ion-segment-button value="services">
                <ion-label>Care Tips</ion-label>
              </ion-segment-button>
            </ion-segment>

            <div class="panel-body">
              <HeroSection v-show="activeTab === 'home'" @cta="setTab" />
              <PetFormComponent v-show="activeTab === 'form'" />
              <PetListComponent v-show="activeTab === 'list'" />
              <CategoryGrid v-show="activeTab === 'categories'" @select="onCategorySelect" />
              <ServicesSection v-show="activeTab === 'services'" @cta="setTab" />
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { IonContent, IonLabel, IonPage, IonSegment, IonSegmentButton } from '@ionic/vue';
import AppNavbar from '../components/AppNavbar.vue';
import HeroSection from '../components/HeroSection.vue';
import CategoryGrid from '../components/CategoryGrid.vue';
import PetFormComponent from '../components/PetFormComponent.vue';
import PetListComponent from '../components/PetListComponent.vue';
import ServicesSection from '../components/ServicesSection.vue';

const activeTab = ref('home');

const panelTitle = computed(() => {
  switch (activeTab.value) {
    case 'form':
      return 'Add or edit pet';
    case 'list':
      return 'Saved pets';
    case 'categories':
      return 'Pet categories';
    case 'services':
      return 'Care tips';
    default:
      return 'Welcome to PawPink';
  }
});

function setTab(section: string) {
  const allowed = new Set(['home', 'form', 'list', 'categories', 'services']);
  activeTab.value = allowed.has(section) ? section : 'home';
}

function onSegmentChange(event: CustomEvent<{ value?: string | number }>) {
  setTab(String(event.detail.value ?? 'home'));
}

function onCategorySelect(animalType: string) {
  window.dispatchEvent(new CustomEvent('pet-prefill-type', { detail: animalType }));
  setTab('form');
}

function onTabChangeRequest(event: Event) {
  const section = String((event as CustomEvent<string>).detail ?? 'form');
  setTab(section === 'list' ? 'list' : 'form');
}

onMounted(() => window.addEventListener('pet-tab-change', onTabChangeRequest));
onUnmounted(() => window.removeEventListener('pet-tab-change', onTabChangeRequest));
</script>

<style scoped>
.page {
  min-height: 100%;
  background:
    radial-gradient(circle at 12% 18%, rgba(252, 231, 243, 0.9), transparent 28%),
    radial-gradient(circle at 88% 8%, rgba(251, 207, 232, 0.55), transparent 24%),
    var(--pim-bg);
}

.workspace {
  max-width: 1120px;
  margin: 0 auto;
  padding: 18px 16px 36px;
}

.panel {
  overflow: hidden;
  border-radius: 28px;
  background: white;
  border: 1px solid rgba(249, 197, 220, 0.75);
  box-shadow: var(--pim-shadow);
}

.panel-head {
  padding: 20px 20px 8px;
}

.eyebrow {
  margin: 0 0 6px;
  color: var(--pim-pink-dark);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.panel-head h1 {
  margin: 0;
  color: var(--pim-ink);
  font-family: var(--pim-display);
  font-size: clamp(1.45rem, 3vw, 1.9rem);
  font-weight: 700;
}

.panel-tabs {
  margin: 0 16px 8px;
  padding: 4px;
  border-radius: 16px;
  --background: var(--pim-pink-soft);
  --indicator-color: #f472b6;
  --color: #6b7280;
  --color-checked: #ffffff;
}

.panel-tabs ion-segment-button {
  min-height: 38px;
  font-size: 12px;
  font-weight: 800;
  text-transform: none;
  letter-spacing: 0;
}

.panel-body {
  min-height: 420px;
  padding-bottom: 12px;
}

@media (min-width: 720px) {
  .workspace {
    padding: 24px 20px 48px;
  }

  .panel-head {
    padding: 24px 24px 10px;
  }

  .panel-tabs {
    margin: 0 24px 12px;
  }
}
</style>
