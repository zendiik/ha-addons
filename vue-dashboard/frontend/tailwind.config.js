/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Glass morphism
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          'light-border': 'rgba(255, 255, 255, 0.2)',
          dark: 'rgba(0, 0, 0, 0.3)',
          'dark-border': 'rgba(255, 255, 255, 0.1)',
        },
        // Neumorphism
        neuro: {
          light: {
            base: '#e0e5ec',
            shadow: '#a3b1c6',
            highlight: '#ffffff',
          },
          dark: {
            base: '#1a1a2e',
            shadow: '#0f0f1a',
            highlight: '#25253e',
          }
        },
        // Status colors
        status: {
          online: '#10b981',
          offline: '#ef4444',
          warning: '#f59e0b',
          idle: '#6b7280',
        },
        // Value indicators
        value: {
          high: '#dc2626',
          normal: '#3b82f6',
          low: '#0ea5e9',
        }
      },

      backdropBlur: {
        xs: '2px',
      },

      boxShadow: {
        'neuro-light': '8px 8px 16px #a3b1c6, -8px -8px 16px #ffffff',
        'neuro-light-inset': 'inset 8px 8px 16px #a3b1c6, inset -8px -8px 16px #ffffff',
        'neuro-dark': '8px 8px 16px #0f0f1a, -8px -8px 16px #25253e',
        'neuro-dark-inset': 'inset 8px 8px 16px #0f0f1a, inset -8px -8px 16px #25253e',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },

      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.8)' },
        }
      },

      borderRadius: {
        '4xl': '2rem',
      },

      transitionDuration: {
        '400': '400ms',
      }
    },
  },
  plugins: [],
}
