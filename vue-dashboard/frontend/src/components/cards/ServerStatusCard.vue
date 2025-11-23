<template>
  <div class="glass-card p-6 animate-fade-in">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div v-if="icon" class="p-2 glass-card rounded-lg">
          <component :is="icon" class="w-6 h-6" />
        </div>
        <div>
          <h3 class="font-semibold">{{ name }}</h3>
          <p class="text-xs text-gray-600 dark:text-gray-400">{{ type }}</p>
        </div>
      </div>

      <StatusIndicator :status="status" :pulse="status === 'online'" />
    </div>

    <div class="space-y-3">
      <div v-for="stat in stats" :key="stat.label" class="flex justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-400">{{ stat.label }}</span>
        <span class="font-medium">{{ stat.value }}</span>
      </div>
    </div>

    <div v-if="details" class="mt-4 pt-4 border-t border-white/20 dark:border-white/10">
      <p class="text-xs text-gray-600 dark:text-gray-400">{{ details }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import StatusIndicator from '@/components/ui/StatusIndicator.vue'

defineProps<{
  name: string
  type: string
  status: 'online' | 'offline' | 'warning' | 'idle' | 'unknown'
  icon?: Component
  stats: Array<{ label: string; value: string | number }>
  details?: string
}>()
</script>
