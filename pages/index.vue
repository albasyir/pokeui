<template>
  <v-container>
    <v-infinite-scroll height="100%" side="end" @load="loadMore" :loading="poke.loading">
      <v-row>
        <v-col v-for="pokemon in poke.pokemons.value" :key="pokemon.name" cols="12" sm="6" md="4" lg="3">
          <v-card 
            :to="`/${pokemon.name}`" 
            :color="getTypeColor(pokemon.detail?.types[0]?.type.name)" 
            theme="dark"
            class="rounded-lg pa-4 text-white"
          >
            <div class="d-flex">
              <div class="flex-grow-1">
                <v-card-title class="text-h5 pa-0 mb-2 text-capitalize">{{ pokemon.name }}</v-card-title>
                <div class="d-flex flex-wrap gap-1">
                  <template v-if="pokemon.isLoadingDetail">
                    <v-skeleton-loader type="chip" width="60" class="mr-1" />
                    <v-skeleton-loader type="chip" width="60" class="mr-1" />
                  </template>
                  <template v-else>
                    <v-chip v-for="(type, index) in pokemon.detail?.types" :key="index" size="small" class="mr-1 text-capitalize">
                      {{ type.type.name }}
                    </v-chip>
                  </template>
                </div>
              </div>
              <div class="ml-4" style="width: 100px; height: 100px;">
                <v-skeleton-loader
                  v-if="pokemon.isLoadingDetail"
                  type="image"
                  width="100"
                  height="100"
                />
                <v-img
                  v-else
                  :src="pokemon.detail?.sprites.other['official-artwork'].front_default"
                  height="100"
                  width="100"
                  contain
                />
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-infinite-scroll>
  </v-container>
</template>

<script setup>
import { usePoke } from '~/stores/poke.store';
import { getTypeColor } from '~/utils/poke/get-type-color';

const poke = usePoke();
useHead({ title: 'Dex' })

useAsyncData(() => {
  poke.fetchList(1);
})

const loadMore = async ({ done, side }) => {
  if (side == 'start') {
    await poke.previousPage();
  } else {
    await poke.nextPage();
  }
  
  done('ok');
};
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-5px);
}
</style> 