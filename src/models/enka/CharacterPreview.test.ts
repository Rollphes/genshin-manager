import { beforeAll, describe, expect, it } from 'vitest'

import { createEnkaDataResponse } from '@/__test__/__mocks__/api/enka-manager/createEnkaDataResponse'
import { Client } from '@/client/Client'
import { CharacterCostume } from '@/models/character/CharacterCostume'
import { CharacterPreview } from '@/models/enka/CharacterPreview'

describe('CharacterPreview', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'en',
      downloadLanguages: ['en'],
    })
    await client.deploy()
  }, 30000)

  describe('Constructor', () => {
    it('should create CharacterPreview from mock data', () => {
      const mockData = createEnkaDataResponse(800000001, true)
      const showAvatarInfo = mockData.playerInfo.showAvatarInfoList?.[0]
      if (!showAvatarInfo) return
      const characterPreview = new CharacterPreview(showAvatarInfo)
      expect(characterPreview).toBeDefined()
    })
  })

  describe('Instance Properties', () => {
    let characterPreview: CharacterPreview

    beforeAll(() => {
      const mockData = createEnkaDataResponse(800000001, true)
      const showAvatarInfo = mockData.playerInfo.showAvatarInfoList?.[0]
      if (!showAvatarInfo) return
      characterPreview = new CharacterPreview(showAvatarInfo)
    })

    it('should extend CharacterCostume', () => {
      expect(characterPreview).toBeInstanceOf(CharacterCostume)
    })

    it('should have correct level', () => {
      expect(characterPreview.level).toBe(90)
    })

    it('should have element defined or undefined', () => {
      expect(
        characterPreview.element === undefined ||
          typeof characterPreview.element === 'string',
      ).toBe(true)
    })

    it('should have collectionLevel as number or undefined', () => {
      expect(
        characterPreview.collectionLevel === undefined ||
          typeof characterPreview.collectionLevel === 'number',
      ).toBe(true)
    })

    it('should have data as original API data', () => {
      expect(characterPreview.data).toBeDefined()
      expect(characterPreview.data.avatarId).toBe(10000002)
    })
  })

  describe('Inherited CharacterCostume Properties', () => {
    let characterPreview: CharacterPreview

    beforeAll(() => {
      const mockData = createEnkaDataResponse(800000001, true)
      const showAvatarInfo = mockData.playerInfo.showAvatarInfoList?.[0]
      if (!showAvatarInfo) return
      characterPreview = new CharacterPreview(showAvatarInfo)
    })

    it('should have characterId from CharacterCostume', () => {
      expect(characterPreview.characterId).toBeDefined()
      expect(typeof characterPreview.characterId).toBe('number')
    })

    it('should have name from CharacterCostume', () => {
      expect(characterPreview.name).toBeDefined()
      expect(typeof characterPreview.name).toBe('string')
    })
  })
})
