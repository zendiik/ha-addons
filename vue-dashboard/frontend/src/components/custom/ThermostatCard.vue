<template>
  <div class="glass-card p-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
          <FireIcon class="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 class="font-semibold text-lg">{{ roomName }}</h3>
          <p class="text-xs text-gray-600 dark:text-gray-400">Termostat</p>
        </div>
      </div>

      <!-- Status -->
      <div class="flex items-center gap-2">
        <StatusIndicator
          :status="isHeating ? 'warning' : 'online'"
          :pulse="isHeating"
          :label="isHeating ? 'Topí' : 'Standby'"
        />
      </div>
    </div>

    <!-- Current Temperature -->
    <div class="mb-6">
      <div class="flex items-baseline gap-2">
        <span class="text-5xl font-bold">{{ currentTemp }}</span>
        <span class="text-2xl text-gray-600 dark:text-gray-400">°C</span>
      </div>
      <div class="flex items-center gap-2 mt-1">
        <ArrowTrendingUpIcon v-if="targetTemp > currentTemp" class="w-4 h-4 text-orange-500" />
        <ArrowTrendingDownIcon v-else-if="targetTemp < currentTemp" class="w-4 h-4 text-blue-500" />
        <span class="text-sm text-gray-600 dark:text-gray-400">
          Cíl: {{ targetTemp }}°C
        </span>
      </div>
    </div>

    <!-- Temperature Control -->
    <div class="space-y-4">
      <!-- Slider -->
      <div class="px-2">
        <input
          type="range"
          :min="minTemp"
          :max="maxTemp"
          :step="0.5"
          :value="targetTemp"
          @input="updateTarget($event.target.value)"
          class="w-full h-2 bg-white/20 dark:bg-black/20 rounded-lg appearance-none cursor-pointer
                 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6
                 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full
                 [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-orange-500
                 [&::-webkit-slider-thumb]:to-red-500 [&::-webkit-slider-thumb]:cursor-pointer
                 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform
                 [&::-webkit-slider-thumb]:hover:scale-110"
        />
        <div class="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
          <span>{{ minTemp }}°C</span>
          <span>{{ maxTemp }}°C</span>
        </div>
      </div>

      <!-- Quick Controls -->
      <div class="flex gap-2">
        <button
          @click="decreaseTemp"
          class="flex-1 neuro-button text-blue-500 flex items-center justify-center gap-2"
        >
          <MinusIcon class="w-5 h-5" />
          <span>−0.5°C</span>
        </button>
        <button
          @click="increaseTemp"
          class="flex-1 neuro-button text-orange-500 flex items-center justify-center gap-2"
        >
          <PlusIcon class="w-5 h-5" />
          <span>+0.5°C</span>
        </button>
      </div>

      <!-- Additional Info -->
      <div class="grid grid-cols-2 gap-3 pt-4 border-t border-white/20 dark:border-white/10">
        <div>
          <p class="text-xs text-gray-600 dark:text-gray-400">Baterie</p>
          <p class="font-semibold">{{ battery }}%</p>
        </div>
        <div>
          <p class="text-xs text-gray-600 dark:text-gray-400">Vlhkost</p>
          <p class="font-semibold">{{ humidity }}%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHomeAssistant } from '@/composables/useHomeAssistant'
import StatusIndicator from '@/components/ui/StatusIndicator.vue'
import {
  FireIcon,
  MinusIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  roomName: string
  thermostatEntityId: string
  temperatureSensorId: string
  humiditySensorId?: string
}>()

const ha = useHomeAssistant()

const minTemp = 15
const maxTemp = 28

const thermostat = computed(() => ha.getEntity(props.thermostatEntityId))
const tempSensor = computed(() => ha.getEntity(props.temperatureSensorId))
const humiditySensor = computed(() =>
  props.humiditySensorId ? ha.getEntity(props.humiditySensorId) : null
)

const currentTemp = computed(() => {
  const temp = tempSensor.value?.state
  return temp ? parseFloat(temp).toFixed(1) : '--'
})

const targetTemp = computed(() => {
  const target = thermostat.value?.attributes?.temperature
  return target ? parseFloat(target).toFixed(1) : 20
})

const battery = computed(() => {
  return thermostat.value?.attributes?.battery || '--'
})

const humidity = computed(() => {
  if (!humiditySensor.value) return '--'
  const hum = humiditySensor.value.state
  return hum ? parseFloat(hum).toFixed(0) : '--'
})

const isHeating = computed(() => {
  return thermostat.value?.attributes?.hvac_action === 'heating'
})

async function updateTarget(value: string) {
  await ha.setTemperature(props.thermostatEntityId, parseFloat(value))
}

async function increaseTemp() {
  const newTemp = parseFloat(targetTemp.value) + 0.5
  if (newTemp <= maxTemp) {
    await updateTarget(newTemp.toString())
  }
}

async function decreaseTemp() {
  const newTemp = parseFloat(targetTemp.value) - 0.5
  if (newTemp >= minTemp) {
    await updateTarget(newTemp.toString())
  }
}
</script>
