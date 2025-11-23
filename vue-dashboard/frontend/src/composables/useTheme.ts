import { ref, watch, onMounted } from 'vue'

export type Theme = 'light' | 'dark' | 'auto'

export function useTheme() {
  const currentTheme = ref<Theme>('auto')
  const isDark = ref(false)

  function applyTheme(theme: Theme) {
    currentTheme.value = theme

    if (theme === 'auto') {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    } else {
      isDark.value = theme === 'dark'
    }

    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    localStorage.setItem('theme', theme)
  }

  function toggleTheme() {
    const newTheme: Theme = currentTheme.value === 'dark' ? 'light' : 'dark'
    applyTheme(newTheme)
  }

  onMounted(() => {
    // Load saved theme or use auto
    const savedTheme = localStorage.getItem('theme') as Theme || 'auto'
    applyTheme(savedTheme)

    // Watch for system theme changes when in auto mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      if (currentTheme.value === 'auto') {
        isDark.value = e.matches
        if (isDark.value) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    })
  })

  return {
    currentTheme,
    isDark,
    applyTheme,
    toggleTheme
  }
}
