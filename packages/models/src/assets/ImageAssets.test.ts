import { describe, expect, it } from 'vitest'

import { ImageAssets } from '@/assets/ImageAssets'

const BASE_URL = 'https://example.com/images'

describe('ImageAssets', () => {
  describe('constructor', () => {
    it('should create with name and base URL', () => {
      const assets = new ImageAssets({
        name: 'UI_AvatarIcon_Hutao',
        imageBaseURL: BASE_URL,
      })

      expect(assets.name).toBe('UI_AvatarIcon_Hutao')
      expect(assets.imageBaseURL).toBe(BASE_URL)
      expect(assets.url).toBe(`${BASE_URL}/UI_AvatarIcon_Hutao.png`)
    })

    it('should use custom URL when provided', () => {
      const customURL = 'https://custom.com/hutao.png'
      const assets = new ImageAssets({
        name: 'UI_AvatarIcon_Hutao',
        imageBaseURL: BASE_URL,
        url: customURL,
      })

      expect(assets.url).toBe(customURL)
    })

    it('should handle empty name', () => {
      const assets = new ImageAssets({ name: '', imageBaseURL: BASE_URL })

      expect(assets.name).toBe('')
      expect(assets.url).toBe('')
      expect(assets.mihoyoURL).toBe('')
    })
  })

  describe('imageType detection', () => {
    it('should detect character icon', () => {
      const assets = new ImageAssets({
        name: 'UI_AvatarIcon_Hutao',
        imageBaseURL: BASE_URL,
      })

      expect(assets.imageType).toBe('character_icon')
    })

    it('should detect character side icon', () => {
      const assets = new ImageAssets({
        name: 'UI_AvatarIcon_Side_Hutao',
        imageBaseURL: BASE_URL,
      })

      expect(assets.imageType).toBe('character_side_icon')
    })

    it('should detect equip icon', () => {
      const assets = new ImageAssets({
        name: 'UI_EquipIcon_Pole_Homa',
        imageBaseURL: BASE_URL,
      })

      expect(assets.imageType).toBe('equip')
    })

    it('should detect equip awaken icon', () => {
      const assets = new ImageAssets({
        name: 'UI_EquipIcon_Pole_Homa_Awaken',
        imageBaseURL: BASE_URL,
      })

      expect(assets.imageType).toBe('equip')
    })

    it('should detect relic icon', () => {
      const assets = new ImageAssets({
        name: 'UI_RelicIcon_15001_4',
        imageBaseURL: BASE_URL,
      })

      expect(assets.imageType).toBe('equip')
    })

    it('should return undefined for unknown pattern', () => {
      const assets = new ImageAssets({
        name: 'UI_SomeOtherIcon',
        imageBaseURL: BASE_URL,
      })

      expect(assets.imageType).toBeUndefined()
    })
  })

  describe('mihoyoURL', () => {
    it('should construct mihoyo URL for known image types', () => {
      const assets = new ImageAssets({
        name: 'UI_AvatarIcon_Hutao',
        imageBaseURL: BASE_URL,
      })

      expect(assets.mihoyoURL).toContain('mihoyo.com')
      expect(assets.mihoyoURL).toContain('UI_AvatarIcon_Hutao.png')
    })

    it('should return empty string for unknown image types', () => {
      const assets = new ImageAssets({
        name: 'UI_Unknown_Test',
        imageBaseURL: BASE_URL,
      })

      expect(assets.mihoyoURL).toBe('')
    })

    it('should return empty string for empty name', () => {
      const assets = new ImageAssets({ name: '', imageBaseURL: BASE_URL })

      expect(assets.mihoyoURL).toBe('')
    })
  })
})
