<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-segment class="page-tabs" :value="activeTab" @ionChange="changeTab" aria-label="Pet Information Manager section">
        <ion-segment-button value="form">
          <ion-label>Add Pet</ion-label>
        </ion-segment-button>
        <ion-segment-button value="list">
          <ion-label>Pets</ion-label>
        </ion-segment-button>
      </ion-segment>

      <PetFormComponent v-show="activeTab === 'form'" />
      <PetListComponent v-show="activeTab === 'list'" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { IonContent, IonLabel, IonPage, IonSegment, IonSegmentButton } from '@ionic/vue';
import PetFormComponent from '../components/PetFormComponent.vue';
import PetListComponent from '../components/PetListComponent.vue';

const activeTab = ref('form');

function changeTab(event: CustomEvent<{ value?: string | number }>) {
  activeTab.value = String(event.detail.value ?? 'form');
}

function onTabChangeRequest(event: Event) {
  activeTab.value = String((event as CustomEvent<string>).detail ?? 'form');
}

onMounted(() => window.addEventListener('pet-tab-change', onTabChangeRequest));
onUnmounted(() => window.removeEventListener('pet-tab-change', onTabChangeRequest));
</script>

<style scoped>
.page-tabs {
  position: sticky;
  z-index: 10;
  top: 0;
  max-width: 280px;
  margin: 0 auto;
  padding: 10px 20px 2px;
  --background: #101313;
  --indicator-color: #d9f26c;
  --color: #a7aaa2;
  --color-checked: #f5f1e8;
}

.page-tabs ion-segment-button {
  min-height: 34px;
  font-size: 12px;
  text-transform: none;
}
</style>
