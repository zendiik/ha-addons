import { computed, ref } from 'vue'
import { useHomeAssistant } from './useHomeAssistant'

export interface UptimeMonitor {
  id: string
  name: string
  status: 'up' | 'down' | 'unknown'
  ping: number | null
  uptime: number | null
  lastCheck: string | null
}

const isDev = import.meta.env.DEV

const mockMonitors: UptimeMonitor[] = [
  {
    id: 'web_server',
    name: 'Web Server',
    status: 'up',
    ping: 45,
    uptime: 99.9,
    lastCheck: new Date().toISOString()
  },
  {
    id: 'api_server',
    name: 'API Server',
    status: 'up',
    ping: 23,
    uptime: 99.5,
    lastCheck: new Date().toISOString()
  },
  {
    id: 'database',
    name: 'Database',
    status: 'down',
    ping: null,
    uptime: 95.2,
    lastCheck: new Date().toISOString()
  }
]

export function useHaUptime() {
  if (isDev) {
    return {
      monitors: ref(mockMonitors),
      uptimeStats: computed(() => ({
        total: 3,
        up: 2,
        down: 1,
        upPercentage: 67
      })),
      isConnected: ref(true)
    }
  }

  const { entities, isConnected } = useHomeAssistant()

  const monitors = computed<UptimeMonitor[]>(() => {
    if (!entities || typeof entities !== 'object') return []

    const uptimeEntities = Object.values(entities).filter(entity =>
      entity?.entity_id?.startsWith('binary_sensor.uptime_')
    )

    return uptimeEntities.map(entity => {
      const id = entity.entity_id.replace('binary_sensor.uptime_', '')
      const isUp = entity.state === 'on'

      return {
        id,
        name: entity.attributes?.friendly_name || id,
        status: isUp ? 'up' : (entity.state === 'off' ? 'down' : 'unknown'),
        ping: entity.attributes?.ping || null,
        uptime: entity.attributes?.uptime || null,
        lastCheck: entity.attributes?.last_check || entity.last_updated || null
      }
    })
  })

  const uptimeStats = computed(() => {
    const total = monitors.value.length
    const up = monitors.value.filter(m => m.status === 'up').length
    const down = monitors.value.filter(m => m.status === 'down').length

    return {
      total,
      up,
      down,
      upPercentage: total > 0 ? Math.round((up / total) * 100) : 0
    }
  })

  return {
    monitors,
    uptimeStats,
    isConnected
  }
}
