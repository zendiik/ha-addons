<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div
      :class="[
        'animate-spin rounded-full border-t-2 border-b-2',
        sizeClass,
        colorClass
      ]"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    color?: string
    fullscreen?: boolean
  }>(),
  {
    size: 'md',
    color: 'border-blue-500',
    fullscreen: false
  }
)

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-4 h-4'
    case 'lg':
      return 'w-12 h-12'
    default:
      return 'w-8 h-8'
  }
})

const colorClass = computed(() => props.color)

const containerClass = computed(() =>
  props.fullscreen ? 'min-h-screen' : 'p-8'
)
</script>
