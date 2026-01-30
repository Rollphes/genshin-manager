import { describe, expect, it } from 'vitest'

import {
  ascensionLevelSchema,
  assetIdSchema,
  assetProcessingConfigSchema,
  cacheConfigSchema,
  characterLevelSchema,
  characterRaritySchema,
  configSchema,
  constellationLevelSchema,
  dayOfWeekSchema,
  elementSchema,
  filePathSchema,
  fixedRefinementSchema,
  languageCodeSchema,
  loggingConfigSchema,
  monsterLevelSchema,
  networkConfigSchema,
  playerCountSchema,
  refinementLevelSchema,
  schemas,
  skillLevelSchema,
  travelerIdSchema,
  uidSchema,
  urlSchema,
  weaponLevelSchema,
  weaponRaritySchema,
  weaponTypeSchema,
} from '@/schemas/commonSchemas'

describe('commonSchemas', () => {
  describe('dayOfWeekSchema', () => {
    it('should accept 0-6', () => {
      for (let i = 0; i <= 6; i++)
        expect(dayOfWeekSchema.safeParse(i).success).toBe(true)
    })

    it('should reject invalid days', () => {
      expect(dayOfWeekSchema.safeParse(-1).success).toBe(false)
      expect(dayOfWeekSchema.safeParse(7).success).toBe(false)
    })
  })

  describe('monsterLevelSchema', () => {
    it('should accept 1-200', () => {
      expect(monsterLevelSchema.safeParse(1).success).toBe(true)
      expect(monsterLevelSchema.safeParse(100).success).toBe(true)
      expect(monsterLevelSchema.safeParse(200).success).toBe(true)
    })

    it('should reject invalid levels', () => {
      expect(monsterLevelSchema.safeParse(0).success).toBe(false)
      expect(monsterLevelSchema.safeParse(201).success).toBe(false)
    })
  })

  describe('playerCountSchema', () => {
    it('should accept 1-4', () => {
      for (let i = 1; i <= 4; i++)
        expect(playerCountSchema.safeParse(i).success).toBe(true)
    })

    it('should reject invalid counts', () => {
      expect(playerCountSchema.safeParse(0).success).toBe(false)
      expect(playerCountSchema.safeParse(5).success).toBe(false)
    })
  })

  describe('weaponLevelSchema', () => {
    it('should accept 1-90', () => {
      expect(weaponLevelSchema.safeParse(1).success).toBe(true)
      expect(weaponLevelSchema.safeParse(45).success).toBe(true)
      expect(weaponLevelSchema.safeParse(90).success).toBe(true)
    })

    it('should reject invalid levels', () => {
      expect(weaponLevelSchema.safeParse(0).success).toBe(false)
      expect(weaponLevelSchema.safeParse(91).success).toBe(false)
    })
  })

  describe('characterLevelSchema', () => {
    it('should accept 1-100', () => {
      expect(characterLevelSchema.safeParse(1).success).toBe(true)
      expect(characterLevelSchema.safeParse(50).success).toBe(true)
      expect(characterLevelSchema.safeParse(100).success).toBe(true)
    })

    it('should reject invalid levels', () => {
      expect(characterLevelSchema.safeParse(0).success).toBe(false)
      expect(characterLevelSchema.safeParse(101).success).toBe(false)
    })
  })

  describe('ascensionLevelSchema', () => {
    it('should accept 0-6', () => {
      for (let i = 0; i <= 6; i++)
        expect(ascensionLevelSchema.safeParse(i).success).toBe(true)
    })

    it('should reject invalid levels', () => {
      expect(ascensionLevelSchema.safeParse(-1).success).toBe(false)
      expect(ascensionLevelSchema.safeParse(7).success).toBe(false)
    })
  })

  describe('refinementLevelSchema', () => {
    it('should accept 1-5', () => {
      for (let i = 1; i <= 5; i++)
        expect(refinementLevelSchema.safeParse(i).success).toBe(true)
    })

    it('should reject invalid levels', () => {
      expect(refinementLevelSchema.safeParse(0).success).toBe(false)
      expect(refinementLevelSchema.safeParse(6).success).toBe(false)
    })
  })

  describe('constellationLevelSchema', () => {
    it('should accept 0-6', () => {
      for (let i = 0; i <= 6; i++)
        expect(constellationLevelSchema.safeParse(i).success).toBe(true)
    })

    it('should reject invalid levels', () => {
      expect(constellationLevelSchema.safeParse(-1).success).toBe(false)
      expect(constellationLevelSchema.safeParse(7).success).toBe(false)
    })
  })

  describe('skillLevelSchema', () => {
    it('should accept 1-15', () => {
      expect(skillLevelSchema.safeParse(1).success).toBe(true)
      expect(skillLevelSchema.safeParse(10).success).toBe(true)
      expect(skillLevelSchema.safeParse(15).success).toBe(true)
    })

    it('should reject invalid levels', () => {
      expect(skillLevelSchema.safeParse(0).success).toBe(false)
      expect(skillLevelSchema.safeParse(16).success).toBe(false)
    })
  })

  describe('uidSchema', () => {
    it('should accept valid 9-digit UIDs', () => {
      expect(uidSchema.safeParse('123456789').success).toBe(true)
      expect(uidSchema.safeParse('800000001').success).toBe(true)
    })

    it('should reject invalid UIDs', () => {
      expect(uidSchema.safeParse('12345678').success).toBe(false)
      expect(uidSchema.safeParse('1234567890').success).toBe(false)
      expect(uidSchema.safeParse('abcdefghi').success).toBe(false)
    })

    it('should have correct error message', () => {
      const result = uidSchema.safeParse('12345')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'UID must be a 9-digit number',
        )
      }
    })
  })

  describe('travelerIdSchema', () => {
    it('should accept valid traveler IDs', () => {
      expect(travelerIdSchema.safeParse(10000005).success).toBe(true)
      expect(travelerIdSchema.safeParse(10000007).success).toBe(true)
    })

    it('should reject invalid traveler IDs', () => {
      expect(travelerIdSchema.safeParse(10000001).success).toBe(false)
      expect(travelerIdSchema.safeParse(10000006).success).toBe(false)
    })

    it('should have correct error message', () => {
      const result = travelerIdSchema.safeParse(12345)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'characterId must be a valid traveler ID (10000005 or 10000007)',
        )
      }
    })
  })

  describe('fixedRefinementSchema', () => {
    it('should accept exactly 1', () => {
      expect(fixedRefinementSchema.safeParse(1).success).toBe(true)
    })

    it('should reject other values', () => {
      expect(fixedRefinementSchema.safeParse(0).success).toBe(false)
      expect(fixedRefinementSchema.safeParse(2).success).toBe(false)
      expect(fixedRefinementSchema.safeParse(5).success).toBe(false)
    })

    it('should have correct error message', () => {
      const result = fixedRefinementSchema.safeParse(2)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'refinementRank must be exactly 1 for this weapon type',
        )
      }
    })
  })

  describe('filePathSchema', () => {
    it('should accept non-empty strings', () => {
      expect(filePathSchema.safeParse('/path/to/file').success).toBe(true)
      expect(filePathSchema.safeParse('C:\\Users\\test').success).toBe(true)
    })

    it('should reject empty strings', () => {
      const result = filePathSchema.safeParse('')
      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues[0].message).toBe('File path cannot be empty')
    })
  })

  describe('urlSchema', () => {
    it('should accept valid URLs', () => {
      expect(urlSchema.safeParse('https://example.com').success).toBe(true)
      expect(urlSchema.safeParse('http://localhost:3000').success).toBe(true)
    })

    it('should reject invalid URLs', () => {
      const result = urlSchema.safeParse('not-a-url')
      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues[0].message).toBe('Must be a valid URL')
    })
  })

  describe('assetIdSchema', () => {
    it('should accept numeric strings', () => {
      expect(assetIdSchema.safeParse('12345').success).toBe(true)
      expect(assetIdSchema.safeParse('0').success).toBe(true)
    })

    it('should reject non-numeric strings', () => {
      const result = assetIdSchema.safeParse('abc')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Asset ID must be a numeric string',
        )
      }
    })
  })

  describe('languageCodeSchema', () => {
    it('should accept valid language codes', () => {
      const validCodes = [
        'en-us',
        'ja-jp',
        'ko-kr',
        'zh-cn',
        'zh-tw',
        'de-de',
        'es-es',
        'fr-fr',
        'id-id',
        'pt-pt',
        'ru-ru',
        'th-th',
        'vi-vn',
      ]
      for (const code of validCodes)
        expect(languageCodeSchema.safeParse(code).success).toBe(true)
    })

    it('should reject invalid language codes', () => {
      expect(languageCodeSchema.safeParse('invalid').success).toBe(false)
      expect(languageCodeSchema.safeParse('en').success).toBe(false)
    })
  })

  describe('characterRaritySchema', () => {
    it('should accept 4 and 5', () => {
      expect(characterRaritySchema.safeParse('4').success).toBe(true)
      expect(characterRaritySchema.safeParse('5').success).toBe(true)
    })

    it('should reject invalid rarities', () => {
      expect(characterRaritySchema.safeParse('1').success).toBe(false)
      expect(characterRaritySchema.safeParse('3').success).toBe(false)
    })
  })

  describe('weaponRaritySchema', () => {
    it('should accept 1-5', () => {
      for (let i = 1; i <= 5; i++)
        expect(weaponRaritySchema.safeParse(String(i)).success).toBe(true)
    })

    it('should reject invalid rarities', () => {
      expect(weaponRaritySchema.safeParse('0').success).toBe(false)
      expect(weaponRaritySchema.safeParse('6').success).toBe(false)
    })
  })

  describe('elementSchema', () => {
    it('should accept valid elements', () => {
      const elements = [
        'Anemo',
        'Geo',
        'Electro',
        'Dendro',
        'Hydro',
        'Pyro',
        'Cryo',
      ]
      for (const element of elements)
        expect(elementSchema.safeParse(element).success).toBe(true)
    })

    it('should reject invalid elements', () => {
      expect(elementSchema.safeParse('Fire').success).toBe(false)
      expect(elementSchema.safeParse('anemo').success).toBe(false)
    })
  })

  describe('weaponTypeSchema', () => {
    it('should accept valid weapon types', () => {
      const types = [
        'WEAPON_SWORD_ONE_HAND',
        'WEAPON_CLAYMORE',
        'WEAPON_BOW',
        'WEAPON_CATALYST',
        'WEAPON_POLE',
      ]
      for (const type of types)
        expect(weaponTypeSchema.safeParse(type).success).toBe(true)
    })

    it('should reject invalid weapon types', () => {
      expect(weaponTypeSchema.safeParse('SWORD').success).toBe(false)
      expect(weaponTypeSchema.safeParse('weapon_bow').success).toBe(false)
    })
  })

  describe('networkConfigSchema', () => {
    it('should accept valid config with defaults', () => {
      const result = networkConfigSchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.timeout).toBe(10000)
        expect(result.data.retries).toBe(3)
        expect(result.data.retryDelay).toBe(1000)
      }
    })

    it('should accept custom values', () => {
      const result = networkConfigSchema.safeParse({
        timeout: 5000,
        retries: 5,
        retryDelay: 2000,
        userAgent: 'CustomAgent/1.0',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.timeout).toBe(5000)
        expect(result.data.userAgent).toBe('CustomAgent/1.0')
      }
    })

    it('should reject out of range values', () => {
      expect(networkConfigSchema.safeParse({ timeout: 999 }).success).toBe(
        false,
      )
      expect(networkConfigSchema.safeParse({ timeout: 30001 }).success).toBe(
        false,
      )
      expect(networkConfigSchema.safeParse({ retries: -1 }).success).toBe(false)
      expect(networkConfigSchema.safeParse({ retries: 11 }).success).toBe(false)
    })
  })

  describe('cacheConfigSchema', () => {
    it('should accept valid config with defaults', () => {
      const result = cacheConfigSchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.enabled).toBe(true)
        expect(result.data.ttl).toBe(3600000)
        expect(result.data.maxSize).toBe(1000)
        expect(result.data.cleanupInterval).toBe(300000)
      }
    })

    it('should reject invalid values', () => {
      expect(cacheConfigSchema.safeParse({ ttl: -1 }).success).toBe(false)
      expect(cacheConfigSchema.safeParse({ maxSize: 0 }).success).toBe(false)
      expect(
        cacheConfigSchema.safeParse({ cleanupInterval: 59999 }).success,
      ).toBe(false)
    })
  })

  describe('loggingConfigSchema', () => {
    it('should accept valid config with defaults', () => {
      const result = loggingConfigSchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.level).toBe('info')
        expect(result.data.enabled).toBe(true)
        expect(result.data.includeTimestamp).toBe(true)
        expect(result.data.includeLevel).toBe(true)
      }
    })

    it('should accept all log levels', () => {
      for (const level of ['error', 'warn', 'info', 'debug'])
        expect(loggingConfigSchema.safeParse({ level }).success).toBe(true)
    })

    it('should reject invalid log level', () => {
      expect(loggingConfigSchema.safeParse({ level: 'trace' }).success).toBe(
        false,
      )
    })
  })

  describe('assetProcessingConfigSchema', () => {
    it('should accept valid config with defaults', () => {
      const result = assetProcessingConfigSchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.downloadTimeout).toBe(10000)
        expect(result.data.maxConcurrentDownloads).toBe(5)
        expect(result.data.retryFailedDownloads).toBe(true)
        expect(result.data.verifyIntegrity).toBe(false)
      }
    })

    it('should reject out of range values', () => {
      expect(
        assetProcessingConfigSchema.safeParse({ downloadTimeout: 999 }).success,
      ).toBe(false)
      expect(
        assetProcessingConfigSchema.safeParse({ maxConcurrentDownloads: 0 })
          .success,
      ).toBe(false)
      expect(
        assetProcessingConfigSchema.safeParse({ maxConcurrentDownloads: 21 })
          .success,
      ).toBe(false)
    })
  })

  describe('configSchema', () => {
    it('should accept empty config with defaults', () => {
      const result = configSchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) expect(result.data.language).toBe('en-us')
    })

    it('should accept full config', () => {
      const result = configSchema.safeParse({
        network: { timeout: 5000 },
        cache: { enabled: false },
        logging: { level: 'debug' },
        assetProcessing: { maxConcurrentDownloads: 10 },
        dataDirectory: '/data',
        language: 'ja-jp',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('schemas export object', () => {
    it('should export all range schemas', () => {
      expect(schemas.createUpdateIntervalSchema).toBeDefined()
      expect(schemas.createPromoteLevelSchema).toBeDefined()
      expect(schemas.createDynamicWeaponLevelSchema).toBeDefined()
      expect(schemas.createArtifactLevelSchema).toBeDefined()
      expect(schemas.weaponLevelSchema).toBeDefined()
      expect(schemas.characterLevelSchema).toBeDefined()
      expect(schemas.ascensionLevelSchema).toBeDefined()
      expect(schemas.refinementLevelSchema).toBeDefined()
      expect(schemas.constellationLevelSchema).toBeDefined()
      expect(schemas.skillLevelSchema).toBeDefined()
      expect(schemas.dayOfWeekSchema).toBeDefined()
      expect(schemas.monsterLevelSchema).toBeDefined()
      expect(schemas.playerCountSchema).toBeDefined()
    })

    it('should export all string schemas', () => {
      expect(schemas.uidSchema).toBeDefined()
      expect(schemas.travelerIdSchema).toBeDefined()
      expect(schemas.fixedRefinementSchema).toBeDefined()
      expect(schemas.filePathSchema).toBeDefined()
      expect(schemas.urlSchema).toBeDefined()
      expect(schemas.assetIdSchema).toBeDefined()
      expect(schemas.languageCodeSchema).toBeDefined()
    })

    it('should export all enum schemas', () => {
      expect(schemas.characterRaritySchema).toBeDefined()
      expect(schemas.weaponRaritySchema).toBeDefined()
      expect(schemas.elementSchema).toBeDefined()
      expect(schemas.weaponTypeSchema).toBeDefined()
    })

    it('should export all config schemas', () => {
      expect(schemas.networkConfigSchema).toBeDefined()
      expect(schemas.cacheConfigSchema).toBeDefined()
      expect(schemas.loggingConfigSchema).toBeDefined()
      expect(schemas.assetProcessingConfigSchema).toBeDefined()
      expect(schemas.configSchema).toBeDefined()
    })
  })
})
