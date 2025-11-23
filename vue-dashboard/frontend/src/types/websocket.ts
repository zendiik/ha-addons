// WebSocket Message Types for Home Assistant

export type MessageType =
  | 'auth_required'
  | 'auth'
  | 'auth_ok'
  | 'auth_invalid'
  | 'subscribe_events'
  | 'unsubscribe_events'
  | 'call_service'
  | 'get_states'
  | 'get_config'
  | 'ping'
  | 'pong'
  | 'event'
  | 'result'

export interface BaseMessage {
  id?: number
  type: MessageType
}

// Auth Messages
export interface AuthRequiredMessage extends BaseMessage {
  type: 'auth_required'
  ha_version: string
}

export interface AuthMessage extends BaseMessage {
  type: 'auth'
  access_token: string
}

export interface AuthOkMessage extends BaseMessage {
  type: 'auth_ok'
  ha_version: string
}

export interface AuthInvalidMessage extends BaseMessage {
  type: 'auth_invalid'
  message: string
}

// Subscribe Messages
export interface SubscribeEventsMessage extends BaseMessage {
  type: 'subscribe_events'
  event_type?: string
}

export interface UnsubscribeEventsMessage extends BaseMessage {
  type: 'unsubscribe_events'
  subscription: number
}

// Service Call Message
export interface CallServiceMessage extends BaseMessage {
  type: 'call_service'
  domain: string
  service: string
  service_data?: Record<string, any>
  target?: {
    entity_id?: string | string[]
  }
}

// Get States Message
export interface GetStatesMessage extends BaseMessage {
  type: 'get_states'
}

// Event Message (from server)
export interface EventMessage extends BaseMessage {
  type: 'event'
  event: {
    event_type: string
    data: any
    origin: string
    time_fired: string
  }
}

// Result Message (from server)
export interface ResultMessage extends BaseMessage {
  type: 'result'
  success: boolean
  result?: any
  error?: {
    code: string
    message: string
  }
}

export type HassMessage =
  | AuthRequiredMessage
  | AuthMessage
  | AuthOkMessage
  | AuthInvalidMessage
  | SubscribeEventsMessage
  | UnsubscribeEventsMessage
  | CallServiceMessage
  | GetStatesMessage
  | EventMessage
  | ResultMessage

// WebSocket Connection State
export enum ConnectionState {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  AUTHENTICATING = 'authenticating',
  AUTHENTICATED = 'authenticated',
  DISCONNECTED = 'disconnected',
  ERROR = 'error'
}
