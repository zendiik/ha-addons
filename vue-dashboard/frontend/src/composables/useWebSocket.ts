import { ref, onUnmounted } from 'vue'
import type { HassMessage, ConnectionState } from '@/types/websocket'
import { ReconnectionManager } from '@/utils/reconnection'

export function useWebSocket(url: string) {
  const ws = ref<WebSocket | null>(null)
  const connectionState = ref<ConnectionState>('disconnected' as ConnectionState)
  const messageId = ref(1)
  const pendingRequests = new Map<number, {
    resolve: (value: any) => void
    reject: (reason: any) => void
  }>()

  const reconnectionManager = new ReconnectionManager({
    maxAttempts: 10,
    baseDelay: 1000,
    maxDelay: 30000
  })

  let heartbeatInterval: number | null = null

  function connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        connectionState.value = 'connecting' as ConnectionState

        ws.value = new WebSocket(url)

        ws.value.onopen = () => {
          console.log('WebSocket connected')
          connectionState.value = 'connected' as ConnectionState
          reconnectionManager.reset()
          startHeartbeat()
        }

        ws.value.onmessage = (event) => {
          try {
            const message: HassMessage = JSON.parse(event.data)
            handleMessage(message, resolve, reject)
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }

        ws.value.onerror = (error) => {
          console.error('WebSocket error:', error)
          connectionState.value = 'error' as ConnectionState
          reject(error)
        }

        ws.value.onclose = () => {
          console.log('WebSocket disconnected')
          connectionState.value = 'disconnected' as ConnectionState
          stopHeartbeat()

          // Auto-reconnect
          if (reconnectionManager.canRetry()) {
            reconnectionManager.scheduleReconnect(() => connect())
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  function handleMessage(
    message: HassMessage,
    resolve: (value: any) => void,
    reject: (reason: any) => void
  ) {
    switch (message.type) {
      case 'auth_required':
        console.log('Auth required, HA version:', message.ha_version)
        break

      case 'auth_ok':
        console.log('Authenticated successfully')
        connectionState.value = 'authenticated' as ConnectionState
        resolve(message)
        break

      case 'auth_invalid':
        console.error('Authentication failed:', message.message)
        connectionState.value = 'error' as ConnectionState
        reject(new Error(message.message))
        break

      case 'result':
        if (message.id) {
          const pending = pendingRequests.get(message.id)
          if (pending) {
            if (message.success) {
              pending.resolve(message.result)
            } else {
              pending.reject(message.error)
            }
            pendingRequests.delete(message.id)
          }
        }
        break

      case 'event':
        // Events are handled by subscribers
        break

      case 'pong':
        // Heartbeat response
        break
    }
  }

  function send(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'))
        return
      }

      const id = messageId.value++
      const fullMessage = { ...message, id }

      pendingRequests.set(id, { resolve, reject })

      ws.value.send(JSON.stringify(fullMessage))

      // Timeout after 30s
      setTimeout(() => {
        if (pendingRequests.has(id)) {
          pendingRequests.delete(id)
          reject(new Error('Request timeout'))
        }
      }, 30000)
    })
  }

  function sendWithoutResponse(message: any) {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, cannot send message')
      return
    }

    ws.value.send(JSON.stringify(message))
  }

  function authenticate(accessToken: string): Promise<void> {
    connectionState.value = 'authenticating' as ConnectionState
    sendWithoutResponse({
      type: 'auth',
      access_token: accessToken
    })

    return new Promise((resolve, reject) => {
      const checkAuth = (message: HassMessage) => {
        if (message.type === 'auth_ok') {
          resolve()
        } else if (message.type === 'auth_invalid') {
          reject(new Error('Authentication failed'))
        }
      }

      // This is handled in handleMessage, but we need to wait for it
      setTimeout(() => {
        if (connectionState.value === 'authenticated' as ConnectionState) {
          resolve()
        } else {
          reject(new Error('Authentication timeout'))
        }
      }, 5000)
    })
  }

  function startHeartbeat() {
    heartbeatInterval = window.setInterval(() => {
      if (ws.value && ws.value.readyState === WebSocket.OPEN) {
        sendWithoutResponse({ type: 'ping' })
      }
    }, 30000) // Ping every 30s
  }

  function stopHeartbeat() {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval)
      heartbeatInterval = null
    }
  }

  function disconnect() {
    stopHeartbeat()
    reconnectionManager.cancel()

    if (ws.value) {
      ws.value.close()
      ws.value = null
    }

    connectionState.value = 'disconnected' as ConnectionState
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    ws,
    connectionState,
    connect,
    disconnect,
    send,
    sendWithoutResponse,
    authenticate
  }
}
