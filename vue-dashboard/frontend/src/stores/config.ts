import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface AppConfig {
  theme: string
  refreshInterval: number
  ingressPath: string
}

export const useConfigStore = defineStore('config', () => {
  const config = ref<AppConfig>({
    theme: 'auto',
    refreshInterval: 30,
    ingressPath: '/'
  })

  const isLoaded = ref(false)

  async function loadConfig() {
    try {
      const response = await fetch('/config.json')
      const data = await response.json()
      config.value = data
      isLoaded.value = true
      console.log('Configuration loaded')
    } catch (error) {
      console.error('Failed to load configuration:', error)
    }
  }

  function updateConfig(updates: Partial<AppConfig>) {
    config.value = { ...config.value, ...updates }
  }

  return {
    config,
    isLoaded,
    loadConfig,
    updateConfig
  }
})
