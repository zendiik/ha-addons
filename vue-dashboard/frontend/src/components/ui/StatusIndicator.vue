<template>
  <div class="flex items-center gap-2">
    <span
      :class="[
        'w-3 h-3 rounded-full',
        statusClass,
        pulse ? 'animate-pulse' : ''
      ]"
    ></span>
    <span v-if="label" class="text-sm">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: 'online' | 'offline' | 'warning' | 'idle' | 'unknown'
  label?: string
  pulse?: boolean
}>()

const statusClass = computed(() => {
  switch (props.status) {
    case 'online':
      return 'bg-status-online'
    case 'offline':
      return 'bg-status-offline'
    case 'warning':
      return 'bg-status-warning'
    case 'idle':
      return 'bg-status-idle'
    default:
      return 'bg-gray-400'
  }
})
</script>
