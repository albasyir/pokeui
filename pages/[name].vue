<template>
  <div>
    <!-- Colored top section -->
    <div 
      class="pokemon-header" 
      :style="{ backgroundColor: getTypeColor(fetchedDetail?.types?.[0]?.type?.name || 'normal', true) }"
    >
      <!-- Row 1: Name, Elements, Number -->
      <div class="px-4 pt-4 d-flex justify-space-between align-center">
        <div>
          <h1 class="text-h4 font-weight-bold text-white text-capitalize mb-2">
            {{ name }}
          </h1>
          <div class="d-flex gap-2">
            <v-chip
              v-for="type in fetchedDetail?.types"
              :key="type.type.name"
              :color="getTypeColor(type.type.name)"
              class="text-capitalize"
              variant="tonal"
              density="comfortable"
            >
              {{ type.type.name }}
            </v-chip>
          </div>
        </div>
        <div class="text-h5 text-white">
          #{{ String(fetchedDetail?.id).padStart(3, '0') }}
        </div>
      </div>

      <!-- Row 2: Pokemon Image -->
      <div class="pokemon-image-container px-8 py-0">
        <v-img
          :src="fetchedDetail?.sprites.other['official-artwork'].front_default"
          height="280"
          contain
          class="pokemon-image"
        />
      </div>
    </div>

    <!-- White background section -->
    <div>
      <!-- Row 3: Info Card -->
      <v-card class="mx-auto info-card" rounded="xl" elevation="0">
        <v-tabs
          v-model="activeTab"
          color="primary"
          align-tabs="center"
        >
          <v-tab value="about">About</v-tab>
          <v-tab value="stats">Base Stats</v-tab>
          <v-tab value="evolution" disabled>Evolution</v-tab>
          <v-tab value="moves" disabled>Moves</v-tab>
        </v-tabs>

        <v-card-text class="px-4 pt-6">
          <v-window v-model="activeTab">
            <!-- About Tab -->
            <v-window-item value="about">
              <div class="about-grid">
                <div class="about-label">Species</div>
                <div class="about-value text-capitalize">{{ name }}</div>

                <div class="about-label">Height</div>
                <div class="about-value">{{ ((fetchedDetail?.height || 0) / 10).toFixed(1) }}m ({{ ((fetchedDetail?.height || 0) * 3.937).toFixed(1) }}" )</div>

                <div class="about-label">Weight</div>
                <div class="about-value">{{ ((fetchedDetail?.weight || 0) / 10).toFixed(1) }}kg ({{ ((fetchedDetail?.weight || 0) * 0.2204).toFixed(1) }} lbs)</div>

                <div class="about-label">Abilities</div>
                <div class="about-value">Overgrow, Chlorophyl</div>

                <div class="about-section-title mt-6">Breeding</div>

                <div class="about-label">Gender</div>
                <div class="about-value">
                  <span class="text-blue-darken-2">♂ 87.5%</span>
                  <span class="text-pink-darken-2 ml-2">♀ 12.5%</span>
                </div>

                <div class="about-label">Egg Groups</div>
                <div class="about-value">Monster</div>

                <div class="about-label">Egg Cycle</div>
                <div class="about-value">Grass</div>
              </div>
            </v-window-item>

            <!-- Stats Tab -->
            <v-window-item value="stats">
              <v-list class="pa-0">
                <v-list-item
                  v-for="stat in fetchedDetail?.stats"
                  :key="stat.stat.name"
                  class="px-0"
                >
                  <template v-slot:prepend>
                    <div class="stat-name text-capitalize">
                      {{ formatStatName(stat.stat.name) }}
                    </div>
                  </template>
                  <v-list-item-subtitle class="d-flex align-center gap-4">
                    <div class="stat-value" style="min-width: 40px">{{ stat.base_stat }}</div>
                    <v-progress-linear
                      :model-value="(stat.base_stat / 255) * 100"
                      :color="getStatColor(stat.base_stat)"
                      height="8"
                      rounded
                    ></v-progress-linear>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePoke } from '~/stores/poke.store'
import { useRoute } from 'vue-router'

const route = useRoute()
const { fetchDetail, fetchedDetail } = usePoke()
const activeTab = ref('about')
const name = Array.isArray(route.params.name) ? route.params.name[0] : route.params.name

useHead({ title: name })

// Fetch pokemon details when component mounts
useAsyncData('pokemonDetail', async () => {
  await fetchDetail(name)
})

const getTypeColor = (type: string | undefined, isBackground = false): string => {
  if (!type) return isBackground ? '#A8A878' : 'grey'
  
  const colors: Record<string, string> = {
    normal: isBackground ? '#A8A878' : 'grey',
    fire: isBackground ? '#F08030' : 'red',
    water: isBackground ? '#6890F0' : 'blue',
    electric: isBackground ? '#F8D030' : 'yellow',
    grass: isBackground ? '#78C850' : 'green',
    ice: isBackground ? '#98D8D8' : 'cyan',
    fighting: isBackground ? '#C03028' : 'deep-orange',
    poison: isBackground ? '#A040A0' : 'purple',
    ground: isBackground ? '#E0C068' : 'brown',
    flying: isBackground ? '#A890F0' : 'light-blue',
    psychic: isBackground ? '#F85888' : 'pink',
    bug: isBackground ? '#A8B820' : 'light-green',
    rock: isBackground ? '#B8A038' : 'grey-darken-2',
    ghost: isBackground ? '#705898' : 'deep-purple',
    dragon: isBackground ? '#7038F8' : 'indigo',
    dark: isBackground ? '#705848' : 'grey-darken-3',
    steel: isBackground ? '#B8B8D0' : 'blue-grey',
    fairy: isBackground ? '#EE99AC' : 'pink-lighten-3'
  }
  return colors[type] || (isBackground ? '#A8A878' : 'grey')
}

const getStatColor = (value: number): string => {
  if (value >= 100) return 'green'
  if (value >= 70) return 'light-green'
  if (value >= 50) return 'yellow'
  return 'red'
}

const formatStatName = (name: string): string => {
  return name.replace('-', ' ')
}
</script>

<style scoped>

.pokemon-header {
  padding-bottom: 100px;
  position: relative;
}

.white-background {
  background: white;
  min-height: 60vh;
  margin-top: -80px;
  border-radius: 30px 30px 0 0;
  position: relative;
}

.pokemon-image-container {
  position: relative;
  z-index: 99;
  margin-bottom: -100px;
}

.info-card {
  padding-top: 80px;
  margin-top: -80px;
  position: relative;
  z-index: 2;
  background: white;
}

.about-grid {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  align-items: center;
}

.about-label {
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
}

.about-value {
  color: rgba(0, 0, 0, 0.87);
}

.about-section-title {
  grid-column: 1 / -1;
  font-weight: 600;
  font-size: 1.1rem;
  color: rgba(0, 0, 0, 0.87);
}

.stat-name {
  width: 100px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
}

.stat-value {
  color: rgba(0, 0, 0, 0.87);
  font-weight: 500;
}
</style> 