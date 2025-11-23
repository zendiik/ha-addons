<template>
  <MainLayout>
    <div class="space-y-8">
      <!-- Uptime Monitoring -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Uptime Monitoring</h2>

        <div v-if="uptimeMonitors.length === 0" class="text-center py-8 glass-card rounded-2xl">
          <p class="text-gray-600 dark:text-gray-400">Žádné monitory nenalezeny</p>
          <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Vytvořte entity začínající na <code>binary_sensor.uptime_</code>
          </p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServerStatusCard
            v-for="monitor in uptimeMonitors"
            :key="monitor.id"
            :name="monitor.name"
            :type="'monitor'"
            :status="monitor.status"
            :icon="ServerIcon"
            :stats="getUptimeStats(monitor.id)"
          />
        </div>
      </section>

      <!-- Minecraft Servers -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Minecraft Servery</h2>

        <div v-if="minecraftServers.length === 0" class="text-center py-8 glass-card rounded-2xl">
          <p class="text-gray-600 dark:text-gray-400">Žádné servery nenalezeny</p>
          <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Vytvořte entity <code>sensor.minecraft_*_online</code>
          </p>
        </div>

        <div v-else class="space-y-6">
          <div v-for="server in minecraftServers" :key="server.id">
            <h3 class="text-lg font-semibold mb-4">{{ server.name }}</h3>

            <div v-if="!server.online" class="glass-card p-8 rounded-2xl text-center">
              <p class="text-lg font-semibold mb-2">Server offline</p>
            </div>

            <div v-else>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  label="Online hráči"
                  :value="`${server.playersOnline}/${server.playersMax}`"
                  :icon="UserGroupIcon"
                  iconColor="text-green-500"
                />
                <StatCard
                  v-if="server.version"
                  label="Verze"
                  :value="server.version"
                  :icon="CubeIcon"
                  iconColor="text-blue-500"
                />
                <StatCard
                  v-if="server.software"
                  label="Software"
                  :value="server.software"
                  :icon="ServerIcon"
                  iconColor="text-purple-500"
                />
                <StatCard
                  v-if="server.ping"
                  label="Ping"
                  :value="`${server.ping}ms`"
                  :icon="SignalIcon"
                  iconColor="text-yellow-500"
                />
              </div>

              <div v-if="server.playersList.length > 0" class="mt-6 glass-card p-6 rounded-2xl">
                <h4 class="font-semibold mb-4">Online hráči:</h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="player in server.playersList"
                    :key="player"
                    class="px-3 py-1 bg-white/20 dark:bg-black/20 rounded-full text-sm"
                  >
                    {{ player }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Kubernetes -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Kubernetes</h2>

        <div v-if="k8sClusters.length === 0" class="text-center py-8 glass-card rounded-2xl">
          <p class="text-gray-600 dark:text-gray-400">Žádné clustery nenalezeny</p>
          <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Vytvořte entity <code>sensor.k8s_*_total_pods</code>
          </p>
        </div>

        <div v-else class="space-y-6">
          <div v-for="cluster in k8sClusters" :key="cluster.id">
            <h3 class="text-lg font-semibold mb-4">{{ cluster.name }}</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                label="Celkem podů"
                :value="cluster.totalPods"
                :icon="ServerIcon"
                iconColor="text-blue-500"
              />
              <StatCard
                label="Running"
                :value="cluster.runningPods"
                :icon="CheckCircleIcon"
                iconColor="text-green-500"
              />
              <StatCard
                label="Pending"
                :value="cluster.pendingPods"
                :icon="ClockIcon"
                iconColor="text-yellow-500"
              />
              <StatCard
                label="Failed"
                :value="cluster.failedPods"
                :icon="XCircleIcon"
                iconColor="text-red-500"
              />
            </div>
          </div>

          <div v-if="k8sClusters.length > 1" class="mt-8">
            <h3 class="text-lg font-semibold mb-4">Celkové statistiky</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <StatCard
                label="Clustery"
                :value="k8sStats.clusters"
                :icon="ServerIcon"
                iconColor="text-purple-500"
              />
              <StatCard
                label="Celkem podů"
                :value="k8sStats.totalPods"
                :icon="ServerIcon"
                iconColor="text-blue-500"
              />
              <StatCard
                label="Running"
                :value="k8sStats.runningPods"
                :icon="CheckCircleIcon"
                iconColor="text-green-500"
              />
              <StatCard
                label="Pending"
                :value="k8sStats.pendingPods"
                :icon="ClockIcon"
                iconColor="text-yellow-500"
              />
              <StatCard
                label="Failed"
                :value="k8sStats.failedPods"
                :icon="XCircleIcon"
                iconColor="text-red-500"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { useHaUptime } from '@/composables/useHaUptime'
import { useHaMinecraft } from '@/composables/useHaMinecraft'
import { useHaKubernetes } from '@/composables/useHaKubernetes'
import MainLayout from '@/components/layout/MainLayout.vue'
import ServerStatusCard from '@/components/cards/ServerStatusCard.vue'
import StatCard from '@/components/cards/StatCard.vue'
import {
  ServerIcon,
  UserGroupIcon,
  CubeIcon,
  SignalIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

const { monitors: uptimeMonitors, uptimeStats, isConnected: uptimeConnected } = useHaUptime()
const { servers: minecraftServers, totalPlayers, onlineServers } = useHaMinecraft()
const { clusters: k8sClusters, totalStats: k8sStats } = useHaKubernetes()

function getUptimeStats(monitorId: string) {
  const monitor = uptimeMonitors.value.find(m => m.id === monitorId)
  if (!monitor) return []

  return [
    { label: 'Status', value: monitor.status === 'up' ? 'Online' : 'Offline' },
    { label: 'Ping', value: monitor.ping ? `${monitor.ping}ms` : 'N/A' },
    { label: 'Uptime', value: monitor.uptime ? `${monitor.uptime}%` : 'N/A' }
  ]
}
</script>
