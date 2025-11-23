// Formatting utilities

export function formatTemperature(value: number | string, unit = '°C'): string {
  const temp = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(temp)) return '--'
  return `${temp.toFixed(1)}${unit}`
}

export function formatPercentage(value: number | string): string {
  const percent = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(percent)) return '--'
  return `${percent.toFixed(0)}%`
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`
  }
  return `${secs}s`
}

export function formatRelativeTime(timestamp: string | number): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp * 1000)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)

  if (diffSec < 60) return 'právě teď'
  if (diffSec < 3600) return `před ${Math.floor(diffSec / 60)} min`
  if (diffSec < 86400) return `před ${Math.floor(diffSec / 3600)} h`
  return `před ${Math.floor(diffSec / 86400)} dny`
}

export function formatDateTime(timestamp: string | number): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp * 1000)
  return date.toLocaleString('cs-CZ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function parseK8sResource(resource: string): number {
  // Parse Kubernetes resource strings like "100m" (millicores) or "128Mi" (mebibytes)
  const match = resource.match(/^(\d+)([a-zA-Z]*)$/)
  if (!match) return 0

  const value = parseInt(match[1])
  const unit = match[2]

  switch (unit) {
    case 'm': // millicores
      return value / 1000
    case 'Ki':
      return value * 1024
    case 'Mi':
      return value * 1024 * 1024
    case 'Gi':
      return value * 1024 * 1024 * 1024
    case 'Ti':
      return value * 1024 * 1024 * 1024 * 1024
    default:
      return value
  }
}
