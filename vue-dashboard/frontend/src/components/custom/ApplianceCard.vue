<template>
  <div class="glass-card p-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div :class="[
          'p-3 rounded-xl',
          statusColor
        ]">
          <component :is="icon" class="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 class="font-semibold">{{ name }}</h3>
          <p class="text-xs text-gray-600 dark:text-gray-400">{{ type }}</p>
        </div>
      </div>

      <!-- Power Switch -->
      <button
        @click="togglePower"
        :class="[
          'p-2 rounded-lg transition-all',
          isPowered
            ? 'bg-green-500 text-white'
            : 'bg-white/20 dark:bg-black/20 text-gray-600 dark:text-gray-400'
        ]"
      >
        <BoltIcon class="w-5 h-5" />
      </button>
    </div>

    <!-- Status Badge -->
    <div :class="[
      'inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium mb-4',
      statusBadgeClass
    ]">
      <span :class="['w-2 h-2 rounded-full', statusDotClass, { 'animate-pulse': isRunning }]"></span>
      <span>{{ currentStatus }}</span>
    </div>

    <!-- Progress Bar (when running) -->
    <div v-if="isRunning && progress > 0" class="mb-4">
      <div class="flex justify-between text-sm mb-2">
        <span class="text-gray-600 dark:text-gray-400">Postup</span>
        <span class="font-medium">{{ progress }}%</span>
      </div>
      <div class="w-full h-2 bg-white/20 dark:bg-black/20 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>

    <!-- Time Info -->
    <div v-if="timeInfo" class="grid grid-cols-2 gap-3 mb-4">
      <div v-if="timeInfo.started" class="p-3 bg-white/10 dark:bg-black/20 rounded-lg">
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Začátek</p>
        <p class="text-sm font-medium">{{ formatTime(timeInfo.started) }}</p>
      </div>
      <div v-if="timeInfo.estimatedEnd" class="p-3 bg-white/10 dark:bg-black/20 rounded-lg">
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Konec (odhad)</p>
        <p class="text-sm font-medium">{{ formatTime(timeInfo.estimatedEnd) }}</p>
      </div>
      <div v-if="timeInfo.finished" class="p-3 bg-white/10 dark:bg-black/20 rounded-lg col-span-2">
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Dokončeno</p>
        <p class="text-sm font-medium">{{ formatTime(timeInfo.finished) }}</p>
      </div>
    </div>

    <!-- Energy Stats -->
    <div class="grid grid-cols-3 gap-3 pt-4 border-t border-white/20 dark:border-white/10">
      <div>
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Příkon</p>
        <p class="font-semibold">{{ currentPower }} W</p>
      </div>
      <div>
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Celkem</p>
        <p class="font-semibold">{{ totalEnergy }} kWh</p>
      </div>
      <div>
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Napětí</p>
        <p class="font-semibold">{{ voltage }} V</p>
      </div>
    </div>

    <!-- Notifications Toggle -->
    <div v-if="notificationEntity" class="mt-4 p-3 bg-white/10 dark:bg-black/20 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <BellIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span class="text-sm">Notifikace</span>
        </div>
        <button
          @click="toggleNotifications"
          :class="[
            'px-3 py-1 rounded-lg text-xs font-medium transition-all',
            notificationsEnabled
              ? 'bg-blue-500 text-white'
              : 'bg-white/20 dark:bg-black/20'
          ]"
        >
          {{ notificationsEnabled ? 'Zapnuto' : 'Vypnuto' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import { useHomeAssistant } from '@/composables/useHomeAssistant'
import { BoltIcon, BellIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  name: string
  type: string
  icon: Component
  switchEntity: string
  stateEntity: string
  powerEntity: string
  energyEntity: string
  voltageEntity: string
  notificationEntity?: string
  startTimeEntity?: string
  endTimeEntity?: string
  finishedTimeEntity?: string
}>()

const ha = useHomeAssistant()

const isPowered = computed(() => ha.getEntity(props.switchEntity)?.state === 'on')
const currentStatus = computed(() => ha.getEntity(props.stateEntity)?.state || 'Off')
const currentPower = computed(() => parseFloat(ha.getEntity(props.powerEntity)?.state || '0').toFixed(0))
const totalEnergy = computed(() => parseFloat(ha.getEntity(props.energyEntity)?.state || '0').toFixed(2))
const voltage = computed(() => parseFloat(ha.getEntity(props.voltageEntity)?.state || '0').toFixed(0))

const notificationsEnabled = computed(() =>
  props.notificationEntity ? ha.getEntity(props.notificationEntity)?.state === 'on' : false
)

const isRunning = computed(() => {
  const status = currentStatus.value.toLowerCase()
  return status !== 'off' && status !== 'standby' && status !== 'idle'
})

const progress = computed(() => {
  // Estimate progress based on power consumption
  const power = parseFloat(currentPower.value)
  if (!isRunning.value || power === 0) return 0

  // Simple estimation - můžeš vylepšit podle skutečných dat
  return Math.min(Math.round((power / 2000) * 100), 100)
})

const statusColor = computed(() => {
  if (!isPowered.value) return 'bg-gray-500'
  if (isRunning.value) return 'bg-gradient-to-br from-blue-500 to-cyan-500'
  return 'bg-gradient-to-br from-green-500 to-emerald-500'
})

const statusBadgeClass = computed(() => {
  if (!isPowered.value) return 'bg-gray-500/20 text-gray-700 dark:text-gray-300'
  if (isRunning.value) return 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
  return 'bg-green-500/20 text-green-700 dark:text-green-300'
})

const statusDotClass = computed(() => {
  if (!isPowered.value) return 'bg-gray-500'
  if (isRunning.value) return 'bg-blue-500'
  return 'bg-green-500'
})

const timeInfo = computed(() => {
  const info: {
    started?: string
    estimatedEnd?: string
    finished?: string
  } = {}

  if (props.startTimeEntity) {
    const start = ha.getEntity(props.startTimeEntity)?.state
    if (start && start !== '2025-08-06 00:00:00') {
      info.started = start
    }
  }

  if (props.endTimeEntity) {
    const end = ha.getEntity(props.endTimeEntity)?.state
    if (end && end !== '2025-08-06 00:00:00') {
      info.estimatedEnd = end
    }
  }

  if (props.finishedTimeEntity) {
    const finished = ha.getEntity(props.finishedTimeEntity)?.state
    if (finished && finished !== '2025-08-06 00:00:00') {
      info.finished = finished
    }
  }

  return Object.keys(info).length > 0 ? info : null
})

function formatTime(datetime: string): string {
  try {
    const date = new Date(datetime)
    return date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return datetime
  }
}

async function togglePower() {
  await ha.toggle(props.switchEntity)
}

async function toggleNotifications() {
  if (props.notificationEntity) {
    await ha.toggle(props.notificationEntity)
  }
}
</script>
