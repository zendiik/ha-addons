<template>
  <button
    @click="toggleTheme"
    class="glass-card p-3 rounded-full transition-all duration-300 hover:scale-110"
    aria-label="Toggle theme"
  >
    <!-- Sun icon (light mode) -->
    <SunIcon v-if="isDark" class="w-5 h-5 text-yellow-500" />
    <!-- Moon icon (dark mode) -->
    <MoonIcon v-else class="w-5 h-5 text-gray-800 dark:text-gray-200" />
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'

const { isDark, toggleTheme } = useTheme()
</script>
