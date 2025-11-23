<template>
  <div class="glass-card p-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
          <BoltIcon class="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 class="font-semibold text-xl">Automatizace</h3>
          <p class="text-xs text-gray-600 dark:text-gray-400">
            {{ activeCount }}/{{ automations.length }} aktivních
          </p>
        </div>
      </div>

      <!-- Toggle All -->
      <button
        @click="toggleAll"
        :class="[
          'px-4 py-2 rounded-lg font-medium text-sm transition-all',
          allActive
            ? 'bg-orange-500 text-white'
            : 'bg-green-500 text-white'
        ]"
      >
        {{ allActive ? 'Vypnout vše' : 'Zapnout vše' }}
      </button>
    </div>

    <!-- Filters -->
    <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
      <button
        v-for="filter in filters"
        :key="filter.value"
        @click="selectedFilter = filter.value"
        :class="[
          'px-3 py-1 rounded-full text-sm font-medium transition-all whitespace-nowrap',
          selectedFilter === filter.value
            ? 'bg-blue-500 text-white'
            : 'bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/30'
        ]"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- Automation List -->
    <div class="space-y-2 max-h-96 overflow-y-auto pr-2">
      <div
        v-for="automation in filteredAutomations"
        :key="automation.entity_id"
        class="p-3 bg-white/10 dark:bg-black/20 rounded-lg transition-all duration-300
               hover:bg-white/20 dark:hover:bg-black/30"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <!-- Status Indicator -->
            <div
              :class="[
                'w-2 h-2 rounded-full flex-shrink-0',
                automation.state === 'on' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
              ]"
            ></div>

            <!-- Name & Icon -->
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <component
                :is="getAutomationIcon(automation.entity_id)"
                class="w-5 h-5 flex-shrink-0"
                :class="automation.state === 'on' ? 'text-blue-500' : 'text-gray-500'"
              />
              <span class="font-medium text-sm truncate">
                {{ automation.attributes.friendly_name }}
              </span>
            </div>
          </div>

          <!-- Toggle Switch -->
          <button
            @click="toggleAutomation(automation.entity_id)"
            :class="[
              'ml-3 relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0',
              automation.state === 'on' ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            ]"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                automation.state === 'on' ? 'translate-x-6' : 'translate-x-1'
              ]"
            />
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredAutomations.length === 0"
        class="text-center py-8 text-gray-600 dark:text-gray-400"
      >
        <p class="text-sm">Žádné automatizace v této kategorii</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHomeAssistant } from '@/composables/useHomeAssistant'
import {
  BoltIcon,
  LightBulbIcon,
  HomeIcon,
  BellIcon,
  Cog6ToothIcon,
  BeakerIcon,
  FireIcon
} from '@heroicons/vue/24/outline'

const ha = useHomeAssistant()
const selectedFilter = ref<string>('all')

const filters = [
  { value: 'all', label: 'Vše' },
  { value: 'lights', label: 'Světla' },
  { value: 'heating', label: 'Topení' },
  { value: 'appliances', label: 'Spotřebiče' },
  { value: 'other', label: 'Ostatní' }
]

const automations = computed(() => {
  return ha.getEntitiesByDomain('automation')
})

const activeCount = computed(() => {
  return automations.value.filter(a => a.state === 'on').length
})

const allActive = computed(() => {
  return activeCount.value === automations.value.length && automations.value.length > 0
})

const filteredAutomations = computed(() => {
  if (selectedFilter.value === 'all') return automations.value

  return automations.value.filter(automation => {
    const name = automation.attributes.friendly_name?.toLowerCase() || ''

    switch (selectedFilter.value) {
      case 'lights':
        return name.includes('světlo') || name.includes('light')
      case 'heating':
        return name.includes('topení') || name.includes('heat')
      case 'appliances':
        return name.includes('pračka') || name.includes('myčka') ||
               name.includes('washing') || name.includes('dishwasher')
      case 'other':
        return !name.includes('světlo') && !name.includes('light') &&
               !name.includes('topení') && !name.includes('heat') &&
               !name.includes('pračka') && !name.includes('myčka')
      default:
        return true
    }
  })
})

function getAutomationIcon(entityId: string) {
  const name = entityId.toLowerCase()

  if (name.includes('light') || name.includes('svetlo')) return LightBulbIcon
  if (name.includes('heat') || name.includes('topeni')) return FireIcon
  if (name.includes('washing') || name.includes('pracka') || name.includes('mycka')) return Cog6ToothIcon
  if (name.includes('notification') || name.includes('notifikace')) return BellIcon
  if (name.includes('akvarium') || name.includes('aquarium')) return BeakerIcon
  if (name.includes('home') || name.includes('doma')) return HomeIcon

  return BoltIcon
}

async function toggleAutomation(entityId: string) {
  try {
    await ha.toggle(entityId)
  } catch (error) {
    console.error('Failed to toggle automation:', error)
  }
}

async function toggleAll() {
  try {
    const action = allActive.value ? 'turnOff' : 'turnOn'

    await Promise.all(
      automations.value.map(automation => ha[action](automation.entity_id))
    )
  } catch (error) {
    console.error('Failed to toggle all automations:', error)
  }
}
</script>
