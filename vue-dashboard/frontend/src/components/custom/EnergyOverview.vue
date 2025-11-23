<template>
  <div class="glass-card p-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
          <BoltIcon class="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 class="font-semibold text-xl">Energie</h3>
          <p class="text-xs text-gray-600 dark:text-gray-400">Spotřeba a monitoring</p>
        </div>
      </div>
    </div>

    <!-- Standby Power Overview -->
    <div class="mb-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium">Standby spotřeba</span>
        <StatusIndicator status="warning" :pulse="true" />
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-3xl font-bold">{{ standbyPower }}</span>
        <span class="text-lg text-gray-600 dark:text-gray-400">W</span>
      </div>
      <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
        Celkem: {{ standbyEnergy }} kWh
      </div>
    </div>

    <!-- Individual Devices -->
    <div class="space-y-3">
      <h4 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Aktivní zařízení</h4>

      <!-- Washing Machine -->
      <div class="p-3 bg-white/10 dark:bg-black/20 rounded-lg">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full" :class="washingPower > 10 ? 'bg-green-500 animate-pulse' : 'bg-gray-500'"></div>
            <span class="text-sm font-medium">Pračka</span>
          </div>
          <span class="text-sm font-semibold">{{ washingPower }} W</span>
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400">
          {{ washingEnergy }} kWh celkem
        </div>
      </div>

      <!-- Dishwasher -->
      <div class="p-3 bg-white/10 dark:bg-black/20 rounded-lg">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full" :class="dishwasherPower > 10 ? 'bg-green-500 animate-pulse' : 'bg-gray-500'"></div>
            <span class="text-sm font-medium">Myčka</span>
          </div>
          <span class="text-sm font-semibold">{{ dishwasherPower }} W</span>
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400">
          {{ dishwasherEnergy }} kWh celkem
        </div>
      </div>

      <!-- Home Mini -->
      <div class="p-3 bg-white/10 dark:bg-black/20 rounded-lg">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-blue-500"></div>
            <span class="text-sm font-medium">Home Mini</span>
          </div>
          <span class="text-sm font-semibold">{{ homeMiniPower }} W</span>
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400">
          {{ homeMiniEnergy }} kWh celkem
        </div>
      </div>

      <!-- Kitchen Table Socket -->
      <div class="p-3 bg-white/10 dark:bg-black/20 rounded-lg">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full" :class="kitchenTablePower > 5 ? 'bg-green-500' : 'bg-gray-500'"></div>
            <span class="text-sm font-medium">Kuchyně - stůl</span>
          </div>
          <span class="text-sm font-semibold">{{ kitchenTablePower }} W</span>
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400">
          {{ kitchenTableEnergy }} kWh celkem
        </div>
      </div>
    </div>

    <!-- Total Summary -->
    <div class="mt-6 pt-4 border-t border-white/20 dark:border-white/10">
      <div class="flex items-center justify-between">
        <span class="font-medium">Aktuální celková spotřeba</span>
        <span class="text-2xl font-bold text-yellow-500">{{ totalPower }} W</span>
      </div>
    </div>

    <!-- CO2 Impact -->
    <div v-if="co2Intensity" class="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-400">CO₂ intenzita</span>
        <span class="font-semibold">{{ co2Intensity }} gCO₂eq/kWh</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHomeAssistant } from '@/composables/useHomeAssistant'
import StatusIndicator from '@/components/ui/StatusIndicator.vue'
import { BoltIcon } from '@heroicons/vue/24/outline'

const ha = useHomeAssistant()

// Standby
const standbyPower = computed(() =>
  parseFloat(ha.getEntity('sensor.all_standby_power')?.state || '0').toFixed(2)
)
const standbyEnergy = computed(() =>
  parseFloat(ha.getEntity('sensor.all_standby_energy')?.state || '0').toFixed(2)
)

// Washing Machine
const washingPower = computed(() =>
  parseFloat(ha.getEntity('sensor.pracka_power')?.state || '0').toFixed(0)
)
const washingEnergy = computed(() =>
  parseFloat(ha.getEntity('sensor.pracka_energy')?.state || '0').toFixed(2)
)

// Dishwasher
const dishwasherPower = computed(() =>
  parseFloat(ha.getEntity('sensor.kuchyne_zasuvka_mycka_power')?.state || '0').toFixed(0)
)
const dishwasherEnergy = computed(() =>
  parseFloat(ha.getEntity('sensor.kuchyne_zasuvka_mycka_energy')?.state || '0').toFixed(2)
)

// Home Mini
const homeMiniPower = computed(() =>
  parseFloat(ha.getEntity('sensor.home_mini_power_2')?.state || '0').toFixed(2)
)
const homeMiniEnergy = computed(() =>
  parseFloat(ha.getEntity('sensor.home_mini_energy_2')?.state || '0').toFixed(2)
)

// Kitchen Table
const kitchenTablePower = computed(() =>
  parseFloat(ha.getEntity('sensor.kuchyne_zasuvka_stul_power')?.state || '0').toFixed(0)
)
const kitchenTableEnergy = computed(() =>
  parseFloat(ha.getEntity('sensor.kuchyne_zasuvka_stul_energy')?.state || '0').toFixed(2)
)

// Total
const totalPower = computed(() => {
  const total = parseFloat(washingPower.value) +
                parseFloat(dishwasherPower.value) +
                parseFloat(homeMiniPower.value) +
                parseFloat(kitchenTablePower.value) +
                parseFloat(standbyPower.value)
  return total.toFixed(0)
})

// CO2
const co2Intensity = computed(() => {
  const co2 = ha.getEntity('sensor.electricity_maps_co2_intensity')?.state
  return co2 ? parseFloat(co2).toFixed(0) : null
})
</script>
