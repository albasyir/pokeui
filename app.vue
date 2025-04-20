<script setup lang="ts">
import { NuxtPage } from '#components';

useHead({
  titleTemplate: (title) => {
    return title ? `${title} - Pokémon` : 'Pokémon';
  }
})
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="compact">
      <template v-slot:prepend>
        <v-btn icon="mdi-arrow-left" @click="$router.back">
        </v-btn>
      </template>

      <template v-slot:append>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>
    </v-app-bar>

    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>
