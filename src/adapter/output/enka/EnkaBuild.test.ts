import { beforeAll, describe, expect, it } from 'vitest'

import { createEnkaBuildResponse } from '@/__test__/__mocks__/api/enka-manager/createEnkaBuildResponse'
import { CharacterDetail } from '@/adapter/output/enka/CharacterDetail'
import { EnkaBuild } from '@/adapter/output/enka/EnkaBuild'
import { Client } from '@/application/client/Client'
import { Language } from '@/domain/types/types'

describe('EnkaBuild', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: Language.En,
      downloadLanguages: [Language.En],
    })
    await client.deploy()
  }, 30000)

  describe('Constructor', () => {
    it('should create EnkaBuild from mock data', () => {
      const mockData = createEnkaBuildResponse(1, 10000002)
      const enkaBuild = new EnkaBuild(
        mockData,
        'https://enka.network/u/testuser/hash123',
      )
      expect(enkaBuild).toBeDefined()
    })
  })

  describe('Instance Properties', () => {
    let enkaBuild: EnkaBuild

    beforeAll(() => {
      const mockData = createEnkaBuildResponse(1, 10000002)
      enkaBuild = new EnkaBuild(
        mockData,
        'https://enka.network/u/testuser/hash123',
      )
    })

    it('should have correct id', () => {
      expect(enkaBuild.id).toBe(1)
    })

    it('should have correct name', () => {
      expect(enkaBuild.name).toBe('Build 1')
    })

    it('should have correct description', () => {
      expect(enkaBuild.description).toBe('Description for build 1')
    })

    it('should have customArtURL as string or undefined', () => {
      expect(
        enkaBuild.customArtURL === undefined ||
          typeof enkaBuild.customArtURL === 'string',
      ).toBe(true)
    })

    it('should have characterDetail as CharacterDetail', () => {
      expect(enkaBuild.characterDetail).toBeInstanceOf(CharacterDetail)
    })

    it('should have correct isPublic', () => {
      expect(enkaBuild.isPublic).toBe(true)
    })

    it('should have correct isLive', () => {
      expect(enkaBuild.isLive).toBe(true)
    })

    it('should have correct isAdaptiveColor', () => {
      expect(enkaBuild.isAdaptiveColor).toBe(true)
    })

    it('should have correct honkardWidth', () => {
      expect(enkaBuild.honkardWidth).toBe(100)
    })

    it('should have correct url', () => {
      expect(enkaBuild.url).toBe(
        'https://enka.network/u/testuser/hash123/10000002/1',
      )
    })

    it('should have data as original API data', () => {
      expect(enkaBuild.data).toBeDefined()
      expect(enkaBuild.data.id).toBe(1)
      expect(enkaBuild.data.name).toBe('Build 1')
    })
  })

  describe('CharacterDetail Properties', () => {
    let enkaBuild: EnkaBuild

    beforeAll(() => {
      const mockData = createEnkaBuildResponse(1, 10000002)
      enkaBuild = new EnkaBuild(
        mockData,
        'https://enka.network/u/testuser/hash123',
      )
    })

    it('should have characterDetail with correct id', () => {
      expect(enkaBuild.characterDetail.id).toBe(10000002)
    })

    it('should have characterDetail with correct level', () => {
      expect(enkaBuild.characterDetail.level).toBe(90)
    })
  })

  describe('Different Build IDs', () => {
    it('should handle different build IDs', () => {
      const mockData = createEnkaBuildResponse(42, 10000002)
      const enkaBuild = new EnkaBuild(
        mockData,
        'https://enka.network/u/testuser/hash123',
      )
      expect(enkaBuild.id).toBe(42)
      expect(enkaBuild.name).toBe('Build 42')
      expect(enkaBuild.url).toBe(
        'https://enka.network/u/testuser/hash123/10000002/42',
      )
    })
  })

  describe('Different Character IDs', () => {
    it('should handle different character IDs', () => {
      const mockData = createEnkaBuildResponse(1, 10000003)
      const enkaBuild = new EnkaBuild(
        mockData,
        'https://enka.network/u/testuser/hash123',
      )
      expect(enkaBuild.characterDetail.id).toBe(10000003)
      expect(enkaBuild.url).toBe(
        'https://enka.network/u/testuser/hash123/10000003/1',
      )
    })
  })

  describe('Settings Variations', () => {
    it('should handle build without caption', () => {
      const baseData = createEnkaBuildResponse(1, 10000002)
      const mockData = {
        ...baseData,
        settings: { ...baseData.settings, caption: undefined },
      }
      const enkaBuild = new EnkaBuild(
        mockData,
        'https://enka.network/u/testuser/hash123',
      )
      expect(enkaBuild.description).toBe('')
    })

    it('should handle build with image', () => {
      const baseData = createEnkaBuildResponse(1, 10000002)
      const mockData = {
        ...baseData,
        image: 'https://example.com/custom-image.png',
      }
      const enkaBuild = new EnkaBuild(
        mockData,
        'https://enka.network/u/testuser/hash123',
      )
      expect(enkaBuild.customArtURL).toBe(
        'https://example.com/custom-image.png',
      )
    })

    it('should handle build without artSource', () => {
      const baseData = createEnkaBuildResponse(1, 10000002)
      const mockData = {
        ...baseData,
        settings: { ...baseData.settings, artSource: undefined },
        image: null,
      }
      const enkaBuild = new EnkaBuild(
        mockData,
        'https://enka.network/u/testuser/hash123',
      )
      expect(enkaBuild.customArtURL).toBeUndefined()
    })

    it('should handle build without adaptiveColor', () => {
      const baseData = createEnkaBuildResponse(1, 10000002)
      const mockData = {
        ...baseData,
        settings: { ...baseData.settings, adaptiveColor: undefined },
      }
      const enkaBuild = new EnkaBuild(
        mockData,
        'https://enka.network/u/testuser/hash123',
      )
      expect(enkaBuild.isAdaptiveColor).toBe(false)
    })

    it('should handle build without honkardWidth', () => {
      const baseData = createEnkaBuildResponse(1, 10000002)
      const mockData = {
        ...baseData,
        settings: { ...baseData.settings, honkardWidth: undefined },
      }
      const enkaBuild = new EnkaBuild(
        mockData,
        'https://enka.network/u/testuser/hash123',
      )
      expect(enkaBuild.honkardWidth).toBe(0)
    })
  })
})
