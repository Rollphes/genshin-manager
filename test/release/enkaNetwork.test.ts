import { beforeAll, describe, expect, test } from 'vitest'

import { Client } from '@/client/Client.js'
import { EnkaManager } from '@/client/EnkaManager.js'

describe('EnkaNetwork Release Test', () => {
  beforeAll(async () => {
    // Client deployment is already handled in test/setup.ts
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  })
  test(
    'should fetch all user data from EnkaNetwork API',
    { timeout: 30000 },
    async () => {
      const enkaManager = new EnkaManager()
      const userData = await enkaManager.fetchAll(800802278)

      // Validate basic EnkaData structure
      expect(userData).toBeDefined()
      expect(userData.uid).toBe(800802278)
      expect(userData.playerDetail).toBeDefined()
      expect(userData.characterDetails).toBeDefined()
      expect(Array.isArray(userData.characterDetails)).toBe(true)
      expect(userData.nextShowCaseDate).toBeInstanceOf(Date)
      expect(userData.url).toBe('https://enka.network/u/800802278')

      // Validate PlayerDetail
      expect(userData.playerDetail.nickname).toBeDefined()
      expect(typeof userData.playerDetail.nickname).toBe('string')
      expect(userData.playerDetail.worldLevel).toBeGreaterThanOrEqual(0)
      expect(userData.playerDetail.nameCard.id).toBeGreaterThan(0)

      // Validate CharacterDetails array
      userData.characterDetails.forEach((character) => {
        expect(character.id).toBeGreaterThan(0)
        expect(character.level).toBeGreaterThan(0)
        expect(character.level).toBeLessThanOrEqual(90)
        expect(character.promoteLevel).toBeGreaterThanOrEqual(0)
        expect(character.promoteLevel).toBeLessThanOrEqual(6)
      })

      // Success if we reach this point
      expect(true).toBe(true)
    },
  )
})
