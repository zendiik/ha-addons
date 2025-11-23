<template>
  <div id="app" class="min-h-screen">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { applyTheme } = useTheme()

onMounted(() => {
  console.log('App mounted - Vue Dashboard v' + __APP_VERSION__)

  // Inicializovat theme - auto mode bude sledovat HA nebo systém
  applyTheme('auto')
})
</script>
