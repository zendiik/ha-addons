import { ref, onMounted } from 'vue'

export type Theme = 'light' | 'dark' | 'auto'

export function useTheme() {
  const currentTheme = ref<Theme>('auto')
  const isDark = ref(false)

  function detectHATheme(): 'light' | 'dark' | null {
    try {
      // Pokud běžíme v iframe, zkus získat theme z parent HA
      if (window.parent && window.parent !== window) {
        const parentHtml = window.parent.document.documentElement
        // HA používá data-theme attribute nebo class
        if (parentHtml.classList.contains('dark-mode') ||
            parentHtml.getAttribute('data-theme') === 'dark') {
          return 'dark'
        }
        if (parentHtml.classList.contains('light-mode') ||
            parentHtml.getAttribute('data-theme') === 'light') {
          return 'light'
        }
      }
    } catch (e) {
      // Cross-origin iframe - nemůžeme přistupovat k parent
      console.log('Running in cross-origin iframe, using system preference')
    }
    return null
  }

  function applyTheme(theme: Theme) {
    currentTheme.value = theme

    if (theme === 'auto') {
      // Zkusit detekovat HA theme, jinak použít systémové nastavení
      const haTheme = detectHATheme()
      if (haTheme) {
        isDark.value = haTheme === 'dark'
      } else {
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
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
    // Vždy používat auto mode pro synchronizaci s HA
    const savedTheme = localStorage.getItem('theme') as Theme || 'auto'
    applyTheme(savedTheme)

    // Sledovat změny systémového theme (HA by mělo ovlivňovat prefers-color-scheme)
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

    // Sledovat změny HA theme (pokud běžíme v iframe)
    try {
      if (window.parent && window.parent !== window) {
        const observer = new MutationObserver(() => {
          if (currentTheme.value === 'auto') {
            applyTheme('auto')
          }
        })

        observer.observe(window.parent.document.documentElement, {
          attributes: true,
          attributeFilter: ['class', 'data-theme']
        })
      }
    } catch (e) {
      // Ignorovat cross-origin chyby
    }
  })

  return {
    currentTheme,
    isDark,
    applyTheme,
    toggleTheme
  }
}
