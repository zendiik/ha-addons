<template>
  <MainLayout>
    <div class="space-y-8">
      <!-- Energy Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Aktuální spotřeba"
          :value="currentPower"
          :icon="BoltIcon"
          iconColor="text-yellow-500"
        />
        <StatCard
          label="Dnes"
          :value="todayEnergy"
          :icon="CalendarIcon"
          iconColor="text-blue-500"
        />
        <StatCard
          label="Tento měsíc"
          :value="monthEnergy"
          :icon="ChartBarIcon"
          iconColor="text-green-500"
        />
        <StatCard
          label="Náklady"
          :value="monthlyCost"
          :icon="CurrencyDollarIcon"
          iconColor="text-red-500"
        />
      </div>

      <!-- Energy Chart Placeholder -->
      <div class="glass-card p-8 rounded-2xl">
        <h3 class="text-xl font-bold mb-6">Spotřeba energie</h3>
        <div class="h-64 flex items-center justify-center text-gray-600 dark:text-gray-400">
          <p>Graf spotřeby (implementace s Chart.js)</p>
        </div>
      </div>

      <!-- Energy Sensors -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EntityCard
          v-for="sensor in energySensors"
          :key="sensor.entity_id"
          :title="sensor.attributes.friendly_name"
          :display-value="`${sensor.state} ${sensor.attributes.unit_of_measurement || ''}`"
          subtitle="Energie"
          status="online"
          value-class="text-value-normal"
        />
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHomeAssistant } from '@/composables/useHomeAssistant'
import MainLayout from '@/components/layout/MainLayout.vue'
import StatCard from '@/components/cards/StatCard.vue'
import EntityCard from '@/components/cards/EntityCard.vue'
import {
  BoltIcon,
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon
} from '@heroicons/vue/24/outline'

const ha = useHomeAssistant()

const energySensors = computed(() => {
  const sensors = ha.getEntitiesByDomain('sensor')
  return sensors.filter(s =>
    s.attributes.device_class === 'energy' ||
    s.attributes.device_class === 'power'
  )
})

const currentPower = computed(() => {
  const powerSensor = energySensors.value.find(s =>
    s.attributes.device_class === 'power'
  )
  return powerSensor ? `${powerSensor.state} W` : '-- W'
})

const todayEnergy = computed(() => {
  // Placeholder - implementuj podle tvých senzorů
  return '12.5 kWh'
})

const monthEnergy = computed(() => {
  // Placeholder
  return '375 kWh'
})

const monthlyCost = computed(() => {
  // Placeholder
  return '1,875 Kč'
})
</script>
