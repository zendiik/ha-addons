import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { HassEntity } from '@/types/homeassistant'
import type { ConnectionState } from '@/types/websocket'

export const useHomeAssistantStore = defineStore('homeAssistant', () => {
  const entities = ref<Record<string, HassEntity>>({})
  const connectionState = ref<ConnectionState>('disconnected' as ConnectionState)
  const lastUpdate = ref<number>(0)

  const isConnected = computed(() => connectionState.value === 'authenticated')
  const isConnecting = computed(() =>
    connectionState.value === 'connecting' || connectionState.value === 'authenticating'
  )

  const entityCount = computed(() => Object.keys(entities.value).length)

  function setEntities(newEntities: Record<string, HassEntity>) {
    entities.value = newEntities
    lastUpdate.value = Date.now()
  }

  function updateEntity(entityId: string, entity: HassEntity) {
    entities.value[entityId] = entity
    lastUpdate.value = Date.now()
  }

  function removeEntity(entityId: string) {
    delete entities.value[entityId]
    lastUpdate.value = Date.now()
  }

  function setConnectionState(state: ConnectionState) {
    connectionState.value = state
  }

  function getEntity(entityId: string): HassEntity | undefined {
    return entities.value[entityId]
  }

  function getEntitiesByDomain(domain: string): HassEntity[] {
    return Object.values(entities.value).filter(entity =>
      entity.entity_id.startsWith(`${domain}.`)
    )
  }

  function getEntitiesByArea(area: string): HassEntity[] {
    return Object.values(entities.value).filter(entity =>
      entity.attributes?.area_id === area
    )
  }

  return {
    entities,
    connectionState,
    lastUpdate,
    isConnected,
    isConnecting,
    entityCount,
    setEntities,
    updateEntity,
    removeEntity,
    setConnectionState,
    getEntity,
    getEntitiesByDomain,
    getEntitiesByArea
  }
})
