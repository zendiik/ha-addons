<template>
  <div class="glass-card glass-card-hover p-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold">{{ roomName }}</h3>
        <p class="text-xs text-gray-600 dark:text-gray-400">{{ deviceCount }} zařízení</p>
      </div>

      <StatusIndicator
        :status="windowOpen ? 'warning' : 'online'"
        :label="windowOpen ? 'Okno otevřeno' : 'Zavřeno'"
      />
    </div>

    <!-- Temperature Display -->
    <div class="mb-6">
      <div class="flex items-baseline gap-2">
        <span class="text-4xl font-bold">{{ temperature }}</span>
        <span class="text-xl text-gray-600 dark:text-gray-400">°C</span>
      </div>
      <div class="flex items-center gap-4 mt-2 text-sm">
        <div class="flex items-center gap-1">
          <div class="w-2 h-2 rounded-full bg-blue-500"></div>
          <span class="text-gray-600 dark:text-gray-400">Vlhkost: {{ humidity }}%</span>
        </div>
      </div>
    </div>

    <!-- Quick Controls -->
    <div class="space-y-2">
      <!-- Thermostat -->
      <div v-if="thermostatEntity" class="flex items-center justify-between p-3 bg-white/10 dark:bg-black/20 rounded-lg">
        <div class="flex items-center gap-2">
          <FireIcon class="w-5 h-5 text-orange-500" />
          <span class="text-sm">Topení</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium">{{ thermostatTemp }}°C</span>
          <router-link
            :to="{ name: 'dashboard', hash: `#${roomName.toLowerCase()}` }"
            class="p-1 rounded hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
          >
            <ChevronRightIcon class="w-4 h-4" />
          </router-link>
        </div>
      </div>

      <!-- Lights -->
      <div v-if="lights.length > 0" class="flex items-center justify-between p-3 bg-white/10 dark:bg-black/20 rounded-lg">
        <div class="flex items-center gap-2">
          <LightBulbIcon class="w-5 h-5 text-yellow-500" />
          <span class="text-sm">Světla</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium">{{ lightsOnCount }}/{{ lights.length }}</span>
          <button
            @click="toggleAllLights"
            class="p-1 rounded hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
          >
            <BoltIcon class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Window/Door Sensor -->
      <div v-if="windowEntity || doorEntity" class="flex items-center justify-between p-3 bg-white/10 dark:bg-black/20 rounded-lg">
        <div class="flex items-center gap-2">
          <component :is="windowEntity ? WindowIcon : DoorOpenIcon" class="w-5 h-5" :class="windowOpen || doorOpen ? 'text-orange-500' : 'text-green-500'" />
          <span class="text-sm">{{ windowEntity ? 'Okno' : 'Dveře' }}</span>
        </div>
        <span :class="[
          'text-sm font-medium',
          windowOpen || doorOpen ? 'text-orange-500' : 'text-green-500'
        ]">
          {{ windowOpen || doorOpen ? 'Otevřeno' : 'Zavřeno' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHomeAssistant } from '@/composables/useHomeAssistant'
import StatusIndicator from '@/components/ui/StatusIndicator.vue'
import {
  FireIcon,
  LightBulbIcon,
  BoltIcon,
  ChevronRightIcon,
  WindowIcon
} from '@heroicons/vue/24/outline'
import { ArrowRightOnRectangleIcon as DoorOpenIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  roomName: string
  temperatureEntity: string
  humidityEntity: string
  thermostatEntity?: string
  windowEntity?: string
  doorEntity?: string
  lightEntities?: string[]
}>()

const ha = useHomeAssistant()

const temperature = computed(() => {
  const temp = ha.getEntity(props.temperatureEntity)?.state
  return temp ? parseFloat(temp).toFixed(1) : '--'
})

const humidity = computed(() => {
  const hum = ha.getEntity(props.humidityEntity)?.state
  return hum ? parseFloat(hum).toFixed(0) : '--'
})

const thermostatTemp = computed(() => {
  if (!props.thermostatEntity) return '--'
  const target = ha.getEntity(props.thermostatEntity)?.attributes?.temperature
  return target ? parseFloat(target).toFixed(1) : '--'
})

const windowOpen = computed(() =>
  props.windowEntity ? ha.getEntity(props.windowEntity)?.state === 'on' : false
)

const doorOpen = computed(() =>
  props.doorEntity ? ha.getEntity(props.doorEntity)?.state === 'on' : false
)

const lights = computed(() => {
  if (!props.lightEntities) return []
  return props.lightEntities.map(id => ha.getEntity(id)).filter(Boolean)
})

const lightsOnCount = computed(() =>
  lights.value.filter(light => light.state === 'on').length
)

const deviceCount = computed(() => {
  let count = 1 // Temperature sensor
  if (props.thermostatEntity) count++
  if (props.windowEntity) count++
  if (props.doorEntity) count++
  count += lights.value.length
  return count
})

async function toggleAllLights() {
  if (!props.lightEntities) return

  const allOn = lightsOnCount.value === lights.value.length
  const action = allOn ? 'turnOff' : 'turnOn'

  await Promise.all(
    props.lightEntities.map(id => ha[action](id))
  )
}
</script>
