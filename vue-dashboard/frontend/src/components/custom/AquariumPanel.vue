<template>
  <div class="glass-card p-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
          <BeakerIcon class="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 class="font-semibold text-xl">Akvárium</h3>
          <p class="text-xs text-gray-600 dark:text-gray-400">Kompletní ovládání</p>
        </div>
      </div>

      <!-- Overall Status -->
      <StatusIndicator
        :status="maintenanceMode ? 'warning' : 'online'"
        :label="maintenanceMode ? 'Výměna' : 'Běží'"
        :pulse="true"
      />
    </div>

    <!-- Controls Grid -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <!-- Světlo -->
      <button
        @click="toggle('switch.akvarium_svetlo')"
        :class="[
          'p-4 rounded-xl transition-all duration-300',
          isOn('switch.akvarium_svetlo')
            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg'
            : 'glass-card hover:bg-white/20 dark:hover:bg-black/30'
        ]"
      >
        <SunIcon class="w-6 h-6 mx-auto mb-2" />
        <p class="text-sm font-medium">Světlo</p>
        <p class="text-xs opacity-75">{{ isOn('switch.akvarium_svetlo') ? 'Zapnuto' : 'Vypnuto' }}</p>
      </button>

      <!-- Filtr -->
      <button
        @click="toggle('switch.akvarium_filtr')"
        :class="[
          'p-4 rounded-xl transition-all duration-300',
          isOn('switch.akvarium_filtr')
            ? 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-lg'
            : 'glass-card hover:bg-white/20 dark:hover:bg-black/30'
        ]"
      >
        <ArrowPathIcon class="w-6 h-6 mx-auto mb-2" />
        <p class="text-sm font-medium">Filtr</p>
        <p class="text-xs opacity-75">{{ isOn('switch.akvarium_filtr') ? 'Běží' : 'Vypnuto' }}</p>
      </button>

      <!-- Vzduch -->
      <button
        @click="toggle('switch.akvarium_vzduch')"
        :class="[
          'p-4 rounded-xl transition-all duration-300',
          isOn('switch.akvarium_vzduch')
            ? 'bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-lg'
            : 'glass-card hover:bg-white/20 dark:hover:bg-black/30'
        ]"
      >
        <CloudIcon class="w-6 h-6 mx-auto mb-2" />
        <p class="text-sm font-medium">Vzduch</p>
        <p class="text-xs opacity-75">{{ isOn('switch.akvarium_vzduch') ? 'Zapnuto' : 'Vypnuto' }}</p>
      </button>

      <!-- Topení -->
      <button
        @click="toggle('switch.akvarium_topeni')"
        :class="[
          'p-4 rounded-xl transition-all duration-300',
          isOn('switch.akvarium_topeni')
            ? 'bg-gradient-to-br from-red-400 to-orange-500 text-white shadow-lg'
            : 'glass-card hover:bg-white/20 dark:hover:bg-black/30'
        ]"
      >
        <FireIcon class="w-6 h-6 mx-auto mb-2" />
        <p class="text-sm font-medium">Topení</p>
        <p class="text-xs opacity-75">{{ isOn('switch.akvarium_topeni') ? 'Topí' : 'Vypnuto' }}</p>
      </button>
    </div>

    <!-- USB Power -->
    <div class="mb-4">
      <button
        @click="toggle('switch.akvarium_usb')"
        :class="[
          'w-full p-4 rounded-xl transition-all duration-300 flex items-center justify-between',
          isOn('switch.akvarium_usb')
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
            : 'glass-card hover:bg-white/20 dark:hover:bg-black/30'
        ]"
      >
        <div class="flex items-center gap-3">
          <BoltIcon class="w-6 h-6" />
          <div class="text-left">
            <p class="font-medium">USB Napájení</p>
            <p class="text-xs opacity-75">{{ isOn('switch.akvarium_usb') ? 'Zapnuto' : 'Vypnuto' }}</p>
          </div>
        </div>
        <ChevronRightIcon class="w-5 h-5" />
      </button>
    </div>

    <!-- Maintenance Mode -->
    <div class="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <WrenchIcon class="w-5 h-5 text-orange-500" />
          <div>
            <p class="font-medium text-sm">Režim výměny</p>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              {{ maintenanceMode ? 'Aktivní' : 'Neaktivní' }}
            </p>
          </div>
        </div>
        <button
          @click="toggle('input_boolean.akvarium_vymena')"
          :class="[
            'px-4 py-2 rounded-lg font-medium text-sm transition-all',
            maintenanceMode
              ? 'bg-orange-500 text-white'
              : 'bg-white/20 dark:bg-black/20'
          ]"
        >
          {{ maintenanceMode ? 'Vypnout' : 'Zapnout' }}
        </button>
      </div>

      <!-- Timer when active -->
      <div v-if="maintenanceMode && timerState" class="mt-3 pt-3 border-t border-orange-500/30">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">Zbývající čas:</span>
          <span class="font-semibold">{{ timerState }}</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-4 grid grid-cols-2 gap-2">
      <button
        @click="allOn"
        class="neuro-button text-green-600 dark:text-green-400 text-sm"
      >
        Vše zapnout
      </button>
      <button
        @click="allOff"
        class="neuro-button text-red-600 dark:text-red-400 text-sm"
      >
        Vše vypnout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHomeAssistant } from '@/composables/useHomeAssistant'
import StatusIndicator from '@/components/ui/StatusIndicator.vue'
import {
  BeakerIcon,
  SunIcon,
  ArrowPathIcon,
  CloudIcon,
  FireIcon,
  BoltIcon,
  WrenchIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

const ha = useHomeAssistant()

const maintenanceMode = computed(() =>
  ha.getEntity('input_boolean.akvarium_vymena')?.state === 'on'
)

const timerState = computed(() => {
  const timer = ha.getEntity('timer.akvarium_vymena')
  return timer?.state !== 'idle' ? timer?.state : null
})

function isOn(entityId: string): boolean {
  return ha.getEntity(entityId)?.state === 'on'
}

async function toggle(entityId: string) {
  try {
    await ha.toggle(entityId)
  } catch (error) {
    console.error(`Failed to toggle ${entityId}:`, error)
  }
}

async function allOn() {
  await Promise.all([
    ha.turnOn('switch.akvarium_svetlo'),
    ha.turnOn('switch.akvarium_filtr'),
    ha.turnOn('switch.akvarium_vzduch'),
    ha.turnOn('switch.akvarium_topeni')
  ])
}

async function allOff() {
  await Promise.all([
    ha.turnOff('switch.akvarium_svetlo'),
    ha.turnOff('switch.akvarium_filtr'),
    ha.turnOff('switch.akvarium_vzduch'),
    ha.turnOff('switch.akvarium_topeni')
  ])
}
</script>
