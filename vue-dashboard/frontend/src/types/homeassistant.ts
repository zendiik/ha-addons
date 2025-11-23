// Home Assistant Entity Types
export interface HassEntity {
  entity_id: string
  state: string
  attributes: Record<string, any>
  last_changed: string
  last_updated: string
  context: {
    id: string
    parent_id: string | null
    user_id: string | null
  }
}

export interface HassState {
  [entity_id: string]: HassEntity
}

// Service Call
export interface ServiceCallData {
  domain: string
  service: string
  service_data?: Record<string, any>
  target?: {
    entity_id?: string | string[]
    device_id?: string | string[]
    area_id?: string | string[]
  }
}

// Common Entity Types
export type EntityDomain =
  | 'light'
  | 'switch'
  | 'sensor'
  | 'binary_sensor'
  | 'climate'
  | 'cover'
  | 'fan'
  | 'media_player'
  | 'lock'
  | 'alarm_control_panel'
  | 'camera'
  | 'weather'
  | 'scene'
  | 'script'
  | 'automation'

export interface LightEntity extends HassEntity {
  attributes: {
    brightness?: number
    color_temp?: number
    rgb_color?: [number, number, number]
    supported_features?: number
    friendly_name: string
  }
}

export interface ClimateEntity extends HassEntity {
  attributes: {
    temperature?: number
    current_temperature?: number
    target_temp_high?: number
    target_temp_low?: number
    hvac_action?: string
    hvac_modes?: string[]
    preset_mode?: string
    friendly_name: string
  }
}

export interface SensorEntity extends HassEntity {
  attributes: {
    unit_of_measurement?: string
    device_class?: string
    friendly_name: string
  }
}

// Events
export interface StateChangedEvent {
  event_type: 'state_changed'
  data: {
    entity_id: string
    old_state: HassEntity | null
    new_state: HassEntity | null
  }
  origin: string
  time_fired: string
}
