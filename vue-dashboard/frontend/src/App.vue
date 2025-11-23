<template>
  <div id="app" class="min-h-screen">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('App mounted - Vue Dashboard v' + __APP_VERSION__)
})
</script>
