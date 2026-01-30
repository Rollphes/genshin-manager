import { describe, expect, it, vi } from 'vitest'

import { EnkaManager } from '@/EnkaManager'
import { EnkaManagerEvents } from '@/types/events'

describe('EnkaManager', () => {
  it('should construct with default cache size', () => {
    const manager = new EnkaManager()
    expect(manager).toBeInstanceOf(EnkaManager)
  })

  it('should construct with custom cache size', () => {
    const manager = new EnkaManager(50)
    expect(manager).toBeInstanceOf(EnkaManager)
  })

  it('should support event listener registration', () => {
    const manager = new EnkaManager()
    const listener = vi.fn()
    manager.on(EnkaManagerEvents.GetNewEnkaData, listener)
    manager.off(EnkaManagerEvents.GetNewEnkaData, listener)
  })

  it('should clear expired cache entries', () => {
    const manager = new EnkaManager()
    // Should not throw when cache is empty
    manager.clearCacheOverNextShowCaseDate()
  })
})
