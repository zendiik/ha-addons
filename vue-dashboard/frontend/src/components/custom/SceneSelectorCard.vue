<template>
  <div class="glass-card p-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
          <SparklesIcon class="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 class="font-semibold text-xl">Scény</h3>
          <p class="text-xs text-gray-600 dark:text-gray-400">Rychlé přepínání nálad</p>
        </div>
      </div>
    </div>

    <!-- Bedroom Lighting Scenes -->
    <div class="space-y-3 mb-6">
      <h4 class="text-sm font-medium text-gray-600 dark:text-gray-400">Ložnice</h4>

      <div class="grid grid-cols-3 gap-3">
        <button
          v-for="scene in bedroomScenes"
          :key="scene.entity_id"
          @click="activateScene(scene.entity_id)"
          :class="[
            'p-4 rounded-xl transition-all duration-300',
            'hover:scale-105 active:scale-95',
            scene.gradient
          ]"
        >
          <component :is="scene.icon" class="w-6 h-6 mx-auto mb-2 text-white" />
          <p class="text-sm font-medium text-white">{{ scene.name }}</p>
        </button>
      </div>
    </div>

    <!-- Custom Scenes -->
    <div v-if="customScenes.length > 0" class="space-y-3">
      <h4 class="text-sm font-medium text-gray-600 dark:text-gray-400">Vlastní scény</h4>

      <div class="space-y-2">
        <button
          v-for="scene in customScenes"
          :key="scene.entity_id"
          @click="activateScene(scene.entity_id)"
          class="w-full p-3 glass-card hover:bg-white/20 dark:hover:bg-black/30 rounded-lg
                 transition-all duration-300 flex items-center justify-between group"
        >
          <div class="flex items-center gap-3">
            <SparklesIcon class="w-5 h-5 text-purple-500" />
            <span class="font-medium">{{ scene.name }}</span>
          </div>
          <ChevronRightIcon class="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>

    <!-- Last Activated -->
    <div v-if="lastActivated" class="mt-6 pt-4 border-t border-white/20 dark:border-white/10">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-400">Naposledy aktivováno:</span>
        <span class="font-medium">{{ lastActivated }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHomeAssistant } from '@/composables/useHomeAssistant'
import {
  SparklesIcon,
  SunIcon,
  MoonIcon,
  BeakerIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

const ha = useHomeAssistant()
const lastActivated = ref<string | null>(null)

// Ložnice scény s custom ikonami a gradienty
const bedroomScenes = [
  {
    entity_id: 'scene.svetlo_loznice_den',
    name: 'Den',
    icon: SunIcon,
    gradient: 'bg-gradient-to-br from-yellow-400 to-orange-500'
  },
  {
    entity_id: 'scene.svetlo_loznice_noc',
    name: 'Noc',
    icon: MoonIcon,
    gradient: 'bg-gradient-to-br from-indigo-500 to-purple-600'
  },
  {
    entity_id: 'scene.svetlo_loznice_tma',
    name: 'Tma',
    icon: BeakerIcon,
    gradient: 'bg-gradient-to-br from-gray-700 to-gray-900'
  }
]

// Další scény (pokud existují)
const customScenes = computed(() => {
  const scenes = ha.getEntitiesByDomain('scene')

  // Vyfiltruj ložnicové scény, které už máme
  const bedroomIds = bedroomScenes.map(s => s.entity_id)

  return scenes
    .filter(scene => !bedroomIds.includes(scene.entity_id))
    .map(scene => ({
      entity_id: scene.entity_id,
      name: scene.attributes.friendly_name || scene.entity_id
    }))
})

async function activateScene(sceneId: string) {
  try {
    const [domain, service] = sceneId.split('.')

    await ha.callService({
      domain: 'scene',
      service: 'turn_on',
      target: { entity_id: sceneId }
    })

    // Update last activated
    const sceneName = bedroomScenes.find(s => s.entity_id === sceneId)?.name ||
                      customScenes.value.find(s => s.entity_id === sceneId)?.name ||
                      sceneId

    lastActivated.value = sceneName

    // Auto clear after 5s
    setTimeout(() => {
      lastActivated.value = null
    }, 5000)

    console.log(`Scene activated: ${sceneId}`)
  } catch (error) {
    console.error('Failed to activate scene:', error)
  }
}
</script>
