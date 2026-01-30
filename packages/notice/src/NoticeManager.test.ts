import { describe, expect, it, vi } from 'vitest'

import { NoticeManager } from '@/NoticeManager'
import { NoticeManagerEvents } from '@/types/events'

describe('NoticeManager', () => {
  it('should construct with language', () => {
    const manager = new NoticeManager('en' as never)
    expect(manager.language).toBe('en')
    expect(manager.updateInterval).toBeUndefined()
    expect(manager.notices.size).toBe(0)
  })

  it('should support event listener registration', () => {
    const manager = new NoticeManager('ja' as never)
    const listener = vi.fn()
    manager.on(NoticeManagerEvents.AddNotice, listener)
    manager.off(NoticeManagerEvents.AddNotice, listener)
  })

  it('should construct with update interval', () => {
    const manager = new NoticeManager('en' as never, 120000)
    expect(manager.updateInterval).toBe(120000)
  })
})
