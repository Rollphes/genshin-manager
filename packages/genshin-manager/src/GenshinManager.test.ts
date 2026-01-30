import { describe, expect, it, vi } from 'vitest'

import { GenshinManager } from '@/GenshinManager'
import { GenshinManagerEvents } from '@/types'

describe('GenshinManager', () => {
  it('should construct with default options', () => {
    const manager = new GenshinManager()
    expect(manager).toBeInstanceOf(GenshinManager)
    expect(manager.option.defaultLanguage).toBe('en')
    expect(
      typeof manager.gameVersion === 'string' ||
        typeof manager.gameVersion === 'undefined',
    ).toBe(true)
  })

  it('should construct with custom options', () => {
    const manager = new GenshinManager({
      defaultLanguage: 'ja' as never,
    })
    expect(manager.option.defaultLanguage).toBe('ja')
  })

  it('should expose enka and notices managers', () => {
    const manager = new GenshinManager()
    expect(manager.enka).toBeDefined()
    expect(manager.notices).toBeDefined()
  })

  it('should support event listener registration', () => {
    const manager = new GenshinManager()
    const listener = vi.fn()
    manager.on(GenshinManagerEvents.BeginUpdateCache, listener)
    manager.off(GenshinManagerEvents.BeginUpdateCache, listener)
  })

  it('should destroy without error', async () => {
    const manager = new GenshinManager()
    await manager.destroy()
    // double destroy is safe
    await manager.destroy()
  })

  it('should expose excelBin and textMap caches', () => {
    const manager = new GenshinManager()
    expect(manager.excelBin).toBeDefined()
    expect(manager.textMap).toBeDefined()
  })

  it('should expose all repository getters', () => {
    const manager = new GenshinManager()
    expect(manager.characters).toBeDefined()
    expect(manager.weapons).toBeDefined()
    expect(manager.artifacts).toBeDefined()
    expect(manager.materials).toBeDefined()
    expect(manager.monsters).toBeDefined()
    expect(manager.profilePictures).toBeDefined()
    expect(manager.dailyFarming).toBeDefined()
  })

  it('should return currentLanguage', () => {
    const manager = new GenshinManager()
    expect(manager.currentLanguage).toBe('en')
  })
})
