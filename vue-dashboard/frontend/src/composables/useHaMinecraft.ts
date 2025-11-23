import { computed, ref } from 'vue'
import { useHomeAssistant } from './useHomeAssistant'

export interface MinecraftServer {
  id: string
  name: string
  online: boolean
  playersOnline: number
  playersMax: number
  playersList: string[]
  version: string | null
  software: string | null
  ping: number | null
}

const isDev = import.meta.env.DEV

const mockServers: MinecraftServer[] = [
  {
    id: 'survival',
    name: 'Survival Server',
    online: true,
    playersOnline: 5,
    playersMax: 20,
    playersList: ['Steve', 'Alex', 'Notch', 'Herobrine', 'Creeper'],
    version: '1.21.3',
    software: 'Paper',
    ping: 45
  },
  {
    id: 'creative',
    name: 'Creative Server',
    online: false,
    playersOnline: 0,
    playersMax: 10,
    playersList: [],
    version: '1.20.4',
    software: 'Spigot',
    ping: null
  }
]

export function useHaMinecraft() {
  if (isDev) {
    return {
      servers: ref(mockServers),
      totalPlayers: computed(() => 5),
      onlineServers: computed(() => 1),
      isConnected: ref(true)
    }
  }

  const { entities, isConnected } = useHomeAssistant()

  const servers = computed<MinecraftServer[]>(() => {
    if (!entities || typeof entities !== 'object') return []

    const minecraftEntities = Object.values(entities).filter(entity =>
      entity?.entity_id?.startsWith('sensor.minecraft_') &&
      entity?.entity_id?.endsWith('_online')
    )

    return minecraftEntities.map(entity => {
      const id = entity.entity_id
        .replace('sensor.minecraft_', '')
        .replace('_online', '')

      const online = entity.state === 'true' || entity.state === 'on' || entity.state === true

      return {
        id,
        name: entity.attributes?.friendly_name || entity.attributes?.server_name || id,
        online,
        playersOnline: entity.attributes?.players_online || entity.attributes?.player_count || 0,
        playersMax: entity.attributes?.players_max || entity.attributes?.max_players || 0,
        playersList: entity.attributes?.players_list || entity.attributes?.players || [],
        version: entity.attributes?.version || null,
        software: entity.attributes?.software || null,
        ping: entity.attributes?.ping || entity.attributes?.latency || null
      }
    })
  })

  const totalPlayers = computed(() => {
    return servers.value.reduce((sum, server) => sum + server.playersOnline, 0)
  })

  const onlineServers = computed(() => {
    return servers.value.filter(s => s.online).length
  })

  return {
    servers,
    totalPlayers,
    onlineServers,
    isConnected
  }
}
