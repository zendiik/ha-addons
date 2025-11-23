import { computed, ref } from 'vue'
import { useHomeAssistant } from './useHomeAssistant'

export interface KubernetesCluster {
  id: string
  name: string
  totalPods: number
  runningPods: number
  pendingPods: number
  failedPods: number
  namespaces: string[]
}

const isDev = import.meta.env.DEV

const mockClusters: KubernetesCluster[] = [
  {
    id: 'homelab',
    name: 'Homelab K8s',
    totalPods: 42,
    runningPods: 38,
    pendingPods: 2,
    failedPods: 2,
    namespaces: ['default', 'kube-system', 'monitoring', 'ingress-nginx']
  },
  {
    id: 'prod',
    name: 'Production Cluster',
    totalPods: 128,
    runningPods: 125,
    pendingPods: 1,
    failedPods: 2,
    namespaces: ['default', 'kube-system', 'prod-apps']
  }
]

export function useHaKubernetes() {
  if (isDev) {
    return {
      clusters: ref(mockClusters),
      totalStats: computed(() => ({
        totalPods: 170,
        runningPods: 163,
        pendingPods: 3,
        failedPods: 4,
        clusters: 2
      })),
      isConnected: ref(true)
    }
  }

  const { entities, isConnected } = useHomeAssistant()

  const clusters = computed<KubernetesCluster[]>(() => {
    if (!entities || typeof entities !== 'object') return []

    const k8sEntities = Object.values(entities).filter(entity =>
      entity?.entity_id?.startsWith('sensor.k8s_') &&
      entity?.entity_id?.endsWith('_total_pods')
    )

    return k8sEntities.map(entity => {
      const id = entity.entity_id
        .replace('sensor.k8s_', '')
        .replace('_total_pods', '')

      const totalPods = parseInt(entity.state) || 0

      return {
        id,
        name: entity.attributes?.friendly_name || entity.attributes?.cluster_name || id,
        totalPods,
        runningPods: entity.attributes?.running_pods || 0,
        pendingPods: entity.attributes?.pending_pods || 0,
        failedPods: entity.attributes?.failed_pods || 0,
        namespaces: entity.attributes?.namespaces || []
      }
    })
  })

  const totalStats = computed(() => {
    const stats = {
      totalPods: 0,
      runningPods: 0,
      pendingPods: 0,
      failedPods: 0,
      clusters: clusters.value.length
    }

    clusters.value.forEach(cluster => {
      stats.totalPods += cluster.totalPods
      stats.runningPods += cluster.runningPods
      stats.pendingPods += cluster.pendingPods
      stats.failedPods += cluster.failedPods
    })

    return stats
  })

  return {
    clusters,
    totalStats,
    isConnected
  }
}
