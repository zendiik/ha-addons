<template>
  <div class="glass-card glass-card-hover p-6 animate-fade-in">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold">{{ title }}</h3>
      <StatusIndicator :status="status" :pulse="true" />
    </div>

    <div class="space-y-2">
      <div class="text-4xl font-bold" :class="valueClass">
        {{ displayValue }}
      </div>

      <div class="text-sm text-gray-600 dark:text-gray-400">
        {{ subtitle }}
      </div>
    </div>

    <!-- Action Button (optional) -->
    <div v-if="showAction" class="mt-4">
      <button
        @click="$emit('action')"
        class="w-full neuro-button text-sm"
      >
        {{ actionLabel }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import StatusIndicator from '@/components/ui/StatusIndicator.vue'

withDefaults(
  defineProps<{
    title: string
    displayValue: string | number
    subtitle?: string
    status?: 'online' | 'offline' | 'warning' | 'idle' | 'unknown'
    valueClass?: string
    showAction?: boolean
    actionLabel?: string
  }>(),
  {
    subtitle: '',
    status: 'online',
    valueClass: 'text-value-normal',
    showAction: false,
    actionLabel: 'Action'
  }
)

defineEmits<{
  action: []
}>()
</script>
