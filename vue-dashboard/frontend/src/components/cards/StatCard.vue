<template>
  <div class="neuro-card p-6 animate-fade-in">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ label }}</p>
        <p class="text-3xl font-bold" :class="valueColor">{{ value }}</p>
        <p v-if="change" class="text-sm mt-2" :class="changeColor">
          {{ change }}
        </p>
      </div>

      <div v-if="icon" class="p-3 glass-card rounded-xl">
        <component :is="icon" class="w-6 h-6" :class="iconColor" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

withDefaults(
  defineProps<{
    label: string
    value: string | number
    change?: string
    icon?: Component
    valueColor?: string
    changeColor?: string
    iconColor?: string
  }>(),
  {
    valueColor: 'text-gray-900 dark:text-white',
    changeColor: 'text-green-500',
    iconColor: 'text-blue-500'
  }
)
</script>
