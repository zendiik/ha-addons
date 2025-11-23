// Exponential backoff reconnection utility

export class ReconnectionManager {
  private attemptCount = 0
  private reconnectTimeout: number | null = null
  private maxAttempts: number
  private baseDelay: number
  private maxDelay: number

  constructor(options: {
    maxAttempts?: number
    baseDelay?: number
    maxDelay?: number
  } = {}) {
    this.maxAttempts = options.maxAttempts || Infinity
    this.baseDelay = options.baseDelay || 1000
    this.maxDelay = options.maxDelay || 30000
  }

  reset() {
    this.attemptCount = 0
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
  }

  getDelay(): number {
    const delay = Math.min(
      this.baseDelay * Math.pow(2, this.attemptCount),
      this.maxDelay
    )
    return delay + Math.random() * 1000 // Add jitter
  }

  canRetry(): boolean {
    return this.attemptCount < this.maxAttempts
  }

  async scheduleReconnect(callback: () => void): Promise<void> {
    if (!this.canRetry()) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.attemptCount++
    const delay = this.getDelay()

    console.log(`Reconnecting in ${Math.round(delay / 1000)}s (attempt ${this.attemptCount})`)

    return new Promise((resolve) => {
      this.reconnectTimeout = window.setTimeout(() => {
        callback()
        resolve()
      }, delay)
    })
  }

  cancel() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
  }
}
