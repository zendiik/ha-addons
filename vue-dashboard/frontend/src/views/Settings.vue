<template>
  <MainLayout>
    <div class="max-w-4xl space-y-8">
      <!-- Connection Status -->
      <section class="glass-card p-6 rounded-2xl">
        <h2 class="text-xl font-bold mb-6">Stav připojení</h2>

        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-white/10 dark:bg-black/20 rounded-xl">
            <div class="flex items-center gap-3">
              <StatusIndicator
                :status="haStore.isConnected ? 'online' : 'offline'"
                :pulse="true"
              />
              <span class="font-medium">Home Assistant</span>
            </div>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ haStore.isConnected ? 'Připojeno' : 'Odpojeno' }}
            </span>
          </div>

          <div class="flex items-center justify-between p-4 bg-white/10 dark:bg-black/20 rounded-xl">
            <div class="flex items-center gap-3">
              <StatusIndicator
                :status="uptimeConnected ? 'online' : 'offline'"
                :pulse="true"
              />
              <span class="font-medium">Uptime Monitoring</span>
            </div>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ uptimeMonitorCount }} monitorů
            </span>
          </div>

          <div class="flex items-center justify-between p-4 bg-white/10 dark:bg-black/20 rounded-xl">
            <div class="flex items-center gap-3">
              <StatusIndicator
                :status="minecraftOnline ? 'online' : 'offline'"
                :pulse="true"
              />
              <span class="font-medium">Minecraft Servery</span>
            </div>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ minecraftServers.length }} serverů
            </span>
          </div>

          <div class="flex items-center justify-between p-4 bg-white/10 dark:bg-black/20 rounded-xl">
            <div class="flex items-center gap-3">
              <StatusIndicator
                :status="k8sConnected ? 'online' : 'offline'"
                :pulse="true"
              />
              <span class="font-medium">Kubernetes</span>
            </div>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ k8sStats.clusters }} clusterů
            </span>
          </div>
        </div>
      </section>

      <!-- Statistics -->
      <section class="glass-card p-6 rounded-2xl">
        <h2 class="text-xl font-bold mb-6">Statistiky</h2>

        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-white/10 dark:bg-black/20 rounded-xl">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Celkem entit</p>
            <p class="text-2xl font-bold">{{ haStore.entityCount }}</p>
          </div>

          <div class="p-4 bg-white/10 dark:bg-black/20 rounded-xl">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Uptime monitory</p>
            <p class="text-2xl font-bold">{{ uptimeMonitorCount }}</p>
          </div>

          <div class="p-4 bg-white/10 dark:bg-black/20 rounded-xl">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">K8s pody (running)</p>
            <p class="text-2xl font-bold">{{ k8sStats.runningPods }}</p>
          </div>

          <div class="p-4 bg-white/10 dark:bg-black/20 rounded-xl">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">MC hráči</p>
            <p class="text-2xl font-bold">{{ totalPlayers }}</p>
          </div>
        </div>
      </section>

      <!-- About -->
      <section class="glass-card p-6 rounded-2xl">
        <h2 class="text-xl font-bold mb-6">O aplikaci</h2>

        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Verze</span>
            <span class="font-medium">{{ appVersion }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Build</span>
            <span class="font-medium">Production</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Framework</span>
            <span class="font-medium">Vue 3 + TypeScript</span>
          </div>
        </div>
      </section>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHomeAssistantStore } from '@/stores/homeAssistant'
import { useHaUptime } from '@/composables/useHaUptime'
import { useHaMinecraft } from '@/composables/useHaMinecraft'
import { useHaKubernetes } from '@/composables/useHaKubernetes'
import MainLayout from '@/components/layout/MainLayout.vue'
import StatusIndicator from '@/components/ui/StatusIndicator.vue'

const haStore = useHomeAssistantStore()
const { monitors: uptimeMonitors, isConnected: uptimeConnected } = useHaUptime()
const { servers: minecraftServers, totalPlayers } = useHaMinecraft()
const { totalStats: k8sStats } = useHaKubernetes()

const appVersion = computed(() => __APP_VERSION__)

const uptimeMonitorCount = computed(() => uptimeMonitors.value.length)
const minecraftOnline = computed(() => minecraftServers.value.some(s => s.online))
const k8sConnected = computed(() => k8sStats.value.clusters > 0)
</script>
