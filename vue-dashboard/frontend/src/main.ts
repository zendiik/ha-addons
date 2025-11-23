import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/main.css'

interface RuntimeConfig {
  uptimeKuma: {
    url: string
    username: string
    password: string
  }
  kubernetes: {
    url: string
    token: string
  }
  minecraft: {
    server: string
  }
  theme: string
  refreshInterval: number
  ingressPath: string
}

async function initApp() {
  try {
    // Load runtime configuration from HA addon
    const response = await fetch('/config.json')
    const config: RuntimeConfig = await response.json()

    console.log('Runtime configuration loaded:', {
      theme: config.theme,
      refreshInterval: config.refreshInterval,
      hasUptimeKuma: !!config.uptimeKuma.url,
      hasKubernetes: !!config.kubernetes.url,
      hasMinecraft: !!config.minecraft.server
    })

    const app = createApp(App)
    const pinia = createPinia()

    // Provide config globally
    app.provide('config', config)

    app.use(pinia)
    app.use(router)

    // Apply theme from config
    const isDark = config.theme === 'dark' ||
                   (config.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    if (isDark) {
      document.documentElement.classList.add('dark')
    }

    app.mount('#app')

    console.log('Vue Dashboard initialized successfully')
  } catch (error) {
    console.error('Failed to initialize app:', error)

    // Fallback: mount app with default config
    const app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.provide('config', {
      uptimeKuma: { url: '', username: '', password: '' },
      kubernetes: { url: '', token: '' },
      minecraft: { server: '' },
      theme: 'auto',
      refreshInterval: 30,
      ingressPath: '/'
    })
    app.mount('#app')
  }
}

initApp()
