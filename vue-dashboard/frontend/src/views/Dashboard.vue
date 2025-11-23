<template>
  <MainLayout>
    <div v-if="!ha.isConnected" class="flex items-center justify-center min-h-[50vh]">
      <div class="text-center">
        <LoadingSpinner v-if="ha.isConnecting" size="lg" />
        <div v-else>
          <p class="text-lg font-semibold mb-2">Nelze se připojit k Home Assistant</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Zkontroluj připojení a zkus to znovu
          </p>
        </div>
      </div>
    </div>

    <div v-else class="space-y-8">
      <!-- Welcome Section -->
      <div class="glass-card p-6 rounded-2xl">
        <h2 class="text-2xl font-bold mb-2">Vítej doma! 👋</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div class="p-3 bg-white/10 dark:bg-black/20 rounded-lg">
            <p class="text-xs text-gray-600 dark:text-gray-400">Teplota venku</p>
            <p class="text-2xl font-bold">{{ outdoorTemp }}°C</p>
          </div>
          <div class="p-3 bg-white/10 dark:bg-black/20 rounded-lg">
            <p class="text-xs text-gray-600 dark:text-gray-400">Počasí</p>
            <p class="text-sm font-medium">{{ weather }}</p>
          </div>
          <div class="p-3 bg-white/10 dark:bg-black/20 rounded-lg">
            <p class="text-xs text-gray-600 dark:text-gray-400">Doma</p>
            <p class="text-2xl font-bold">{{ peopleHome }}</p>
          </div>
          <div class="p-3 bg-white/10 dark:bg-black/20 rounded-lg">
            <p class="text-xs text-gray-600 dark:text-gray-400">Spotřeba</p>
            <p class="text-2xl font-bold text-yellow-500">{{ totalPower }}W</p>
          </div>
        </div>
      </div>

      <!-- Místnosti Section -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Místnosti</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <RoomCard
            room-name="Kuchyně"
            temperature-entity="sensor.teplomer_kuchyne_temperature"
            humidity-entity="sensor.teplomer_kuchyne_humidity"
            thermostat-entity="climate.termostat_kuchyne"
            window-entity="binary_sensor.okno_kuchyne_door"
          />

          <RoomCard
            room-name="Ložnice"
            temperature-entity="sensor.teplomer_loznice_temperature"
            humidity-entity="sensor.teplomer_loznice_humidity"
            thermostat-entity="climate.termostat_loznice"
            window-entity="binary_sensor.okno_loznice_door"
            :light-entities="['light.svetlo_loznice', 'light.ikea_zarovka_2']"
          />

          <RoomCard
            room-name="Obývák"
            temperature-entity="sensor.teplomer_obyvak_temperature"
            humidity-entity="sensor.teplomer_obyvak_humidity"
            thermostat-entity="climate.termostat_obyvak"
            door-entity="binary_sensor.dvere_obyvak_door"
          />

          <RoomCard
            room-name="Pokoj"
            temperature-entity="sensor.teplomer_pokoj_temperature"
            humidity-entity="sensor.teplomer_pokoj_humidity"
            thermostat-entity="climate.termostat_pokoj"
            window-entity="binary_sensor.okno_pokoj_door"
          />
        </div>
      </section>

      <!-- Akvárium + Spotřebiče -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Akvárium -->
        <AquariumPanel />

        <!-- Energy Overview -->
        <EnergyOverview />
      </div>

      <!-- Spotřebiče Section -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Spotřebiče</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ApplianceCard
            name="Pračka"
            type="Automatická pračka"
            :icon="Cog6ToothIcon"
            switch-entity="switch.pracka"
            state-entity="input_select.pracka_stav"
            power-entity="sensor.pracka_power"
            energy-entity="sensor.pracka_energy"
            voltage-entity="sensor.pracka_voltage"
            notification-entity="automation.pracka_notifikace"
            start-time-entity="input_datetime.pracka_start"
            end-time-entity="input_datetime.pracka_predpokladany_cas_konce"
            finished-time-entity="input_datetime.pracka_skoncila"
          />

          <ApplianceCard
            name="Myčka"
            type="Automatická myčka nádobí"
            :icon="SparklesIcon"
            switch-entity="switch.kuchyne_zasuvka_mycka"
            state-entity="input_select.mycka"
            power-entity="sensor.kuchyne_zasuvka_mycka_power"
            energy-entity="sensor.kuchyne_zasuvka_mycka_energy"
            voltage-entity="sensor.kuchyne_zasuvka_mycka_voltage"
            notification-entity="automation.mycka_notifikace"
          />
        </div>
      </section>

      <!-- Scény & Automatizace Section -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Scény & Automatizace</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SceneSelectorCard />
          <AutomationCard />
        </div>
      </section>

      <!-- Quick Actions -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Rychlé akce</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            @click="toggleAllThermostats"
            class="glass-card glass-card-hover p-4 text-center"
          >
            <FireIcon class="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p class="font-medium text-sm">Všechna topení</p>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {{ allThermostatsOn ? 'Vypnout' : 'Zapnout' }}
            </p>
          </button>

          <button
            @click="toggleAllLights"
            class="glass-card glass-card-hover p-4 text-center"
          >
            <LightBulbIcon class="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <p class="font-medium text-sm">Všechna světla</p>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {{ lightsOnCount }}/{{ allLights.length }}
            </p>
          </button>

          <router-link
            to="/energy"
            class="glass-card glass-card-hover p-4 text-center"
          >
            <BoltIcon class="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <p class="font-medium text-sm">Energie</p>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Detail →</p>
          </router-link>

          <router-link
            to="/infrastructure"
            class="glass-card glass-card-hover p-4 text-center"
          >
            <ServerIcon class="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p class="font-medium text-sm">Infrastruktura</p>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Detail →</p>
          </router-link>
        </div>
      </section>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHomeAssistant } from '@/composables/useHomeAssistant'
import MainLayout from '@/components/layout/MainLayout.vue'
import RoomCard from '@/components/custom/RoomCard.vue'
import AquariumPanel from '@/components/custom/AquariumPanel.vue'
import EnergyOverview from '@/components/custom/EnergyOverview.vue'
import ApplianceCard from '@/components/custom/ApplianceCard.vue'
import SceneSelectorCard from '@/components/custom/SceneSelectorCard.vue'
import AutomationCard from '@/components/custom/AutomationCard.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import {
  FireIcon,
  LightBulbIcon,
  BoltIcon,
  ServerIcon,
  Cog6ToothIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'

const ha = useHomeAssistant()

// Weather
const outdoorTemp = computed(() => {
  const temp = ha.getEntity('sensor.teplomer_balkon_temperature')?.state
  return temp ? parseFloat(temp).toFixed(1) : '--'
})

const weather = computed(() => {
  return ha.getEntity('weather.openweathermap')?.state || '--'
})

// People
const peopleHome = computed(() => {
  const netleak = ha.getEntity('person.netleak')?.state === 'home' ? 1 : 0
  const wenolly = ha.getEntity('person.wenolly')?.state === 'home' ? 1 : 0
  return netleak + wenolly
})

// Power
const totalPower = computed(() => {
  const standby = parseFloat(ha.getEntity('sensor.all_standby_power')?.state || '0')
  const washing = parseFloat(ha.getEntity('sensor.pracka_power')?.state || '0')
  const dishwasher = parseFloat(ha.getEntity('sensor.kuchyne_zasuvka_mycka_power')?.state || '0')
  return Math.round(standby + washing + dishwasher)
})

// Lights
const allLights = computed(() => ha.getEntitiesByDomain('light'))
const lightsOnCount = computed(() => allLights.value.filter(l => l.state === 'on').length)

// Thermostats
const allThermostats = computed(() => [
  'climate.termostat_kuchyne',
  'climate.termostat_loznice',
  'climate.termostat_obyvak',
  'climate.termostat_pokoj'
])

const allThermostatsOn = computed(() =>
  allThermostats.value.every(id => ha.getEntity(id)?.state !== 'off')
)

async function toggleAllLights() {
  const allOn = lightsOnCount.value === allLights.value.length
  const action = allOn ? 'turnOff' : 'turnOn'

  await Promise.all(
    allLights.value.map(light => ha[action](light.entity_id))
  )
}

async function toggleAllThermostats() {
  const action = allThermostatsOn.value ? 'turnOff' : 'turnOn'

  await Promise.all(
    allThermostats.value.map(id => ha[action](id))
  )
}
</script>
