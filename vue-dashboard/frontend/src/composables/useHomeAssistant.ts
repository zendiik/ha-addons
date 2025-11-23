import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useWebSocket } from './useWebSocket'
import type { HassEntity, HassState, ServiceCallData } from '@/types/homeassistant'
import type { EventMessage } from '@/types/websocket'

// Home Assistant WebSocket URL
const WS_URL = window.location.protocol === 'https:'
  ? `wss://${window.location.host}/api/websocket`
  : `ws://${window.location.host}/api/websocket`

export function useHomeAssistant() {
  const { ws, connectionState, connect, disconnect, send, sendWithoutResponse, authenticate } = useWebSocket(WS_URL)

  const entities = reactive<HassState>({})
  const isConnected = computed(() => connectionState.value === 'authenticated')
  const isConnecting = computed(() =>
    connectionState.value === 'connecting' || connectionState.value === 'authenticating'
  )

  let eventSubscriptionId: number | null = null

  async function init() {
    try {
      // Connect to WebSocket
      await connect()

      // Get access token from Home Assistant (Ingress automatically handles this)
      // In production, this would come from long-lived access token
      const token = await getAccessToken()

      // Authenticate
      await authenticate(token)

      // Subscribe to state changes
      await subscribeToEvents()

      // Get initial states
      await fetchStates()

      console.log('Home Assistant initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Home Assistant:', error)
      throw error
    }
  }

  async function getAccessToken(): Promise<string> {
    // In HA Addon with Ingress, we can use the Ingress session
    // For development, you'll need to set a long-lived access token
    const token = localStorage.getItem('ha_access_token')

    if (token) {
      return token
    }

    // Fallback: prompt user for token in development
    if (import.meta.env.DEV) {
      const userToken = prompt('Enter Home Assistant Long-Lived Access Token:')
      if (userToken) {
        localStorage.setItem('ha_access_token', userToken)
        return userToken
      }
    }

    throw new Error('No access token available')
  }

  async function subscribeToEvents() {
    try {
      const result = await send({
        type: 'subscribe_events',
        event_type: 'state_changed'
      })

      eventSubscriptionId = result.id

      // Listen for state change events
      if (ws.value) {
        const originalOnMessage = ws.value.onmessage

        ws.value.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)

            if (message.type === 'event' && message.event?.event_type === 'state_changed') {
              handleStateChange(message as EventMessage)
            }

            // Call original handler
            if (originalOnMessage) {
              originalOnMessage.call(ws.value, event)
            }
          } catch (error) {
            console.error('Error processing event:', error)
          }
        }
      }

      console.log('Subscribed to state changes')
    } catch (error) {
      console.error('Failed to subscribe to events:', error)
    }
  }

  function handleStateChange(message: EventMessage) {
    const { entity_id, new_state } = message.event.data

    if (new_state) {
      entities[entity_id] = new_state
    } else {
      // Entity was removed
      delete entities[entity_id]
    }
  }

  async function fetchStates() {
    try {
      const states = await send({ type: 'get_states' })

      // Populate entities
      states.forEach((entity: HassEntity) => {
        entities[entity.entity_id] = entity
      })

      console.log(`Loaded ${states.length} entities`)
    } catch (error) {
      console.error('Failed to fetch states:', error)
    }
  }

  async function callService(data: ServiceCallData) {
    try {
      await send({
        type: 'call_service',
        domain: data.domain,
        service: data.service,
        service_data: data.service_data,
        target: data.target
      })

      console.log(`Service called: ${data.domain}.${data.service}`)
    } catch (error) {
      console.error('Service call failed:', error)
      throw error
    }
  }

  // Helper methods for common services
  async function turnOn(entityId: string, data?: Record<string, any>) {
    const [domain] = entityId.split('.')
    await callService({
      domain,
      service: 'turn_on',
      target: { entity_id: entityId },
      service_data: data
    })
  }

  async function turnOff(entityId: string) {
    const [domain] = entityId.split('.')
    await callService({
      domain,
      service: 'turn_off',
      target: { entity_id: entityId }
    })
  }

  async function toggle(entityId: string) {
    const [domain] = entityId.split('.')
    await callService({
      domain,
      service: 'toggle',
      target: { entity_id: entityId }
    })
  }

  async function setTemperature(entityId: string, temperature: number) {
    await callService({
      domain: 'climate',
      service: 'set_temperature',
      target: { entity_id: entityId },
      service_data: { temperature }
    })
  }

  // Get entities by domain
  function getEntitiesByDomain(domain: string): HassEntity[] {
    return Object.values(entities).filter(entity =>
      entity.entity_id.startsWith(`${domain}.`)
    )
  }

  // Get single entity
  function getEntity(entityId: string): HassEntity | undefined {
    return entities[entityId]
  }

  onMounted(() => {
    init().catch(console.error)
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    entities,
    isConnected,
    isConnecting,
    connectionState,
    callService,
    turnOn,
    turnOff,
    toggle,
    setTemperature,
    getEntitiesByDomain,
    getEntity,
    init
  }
}
