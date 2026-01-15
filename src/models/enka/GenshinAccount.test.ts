import { beforeAll, describe, expect, it } from 'vitest'

import { createEnkaBuildResponse } from '@/__test__/__mocks__/api/enka-manager/createEnkaBuildResponse'
import { createGenshinAccountsResponse } from '@/__test__/__mocks__/api/enka-manager/createGenshinAccountsResponse'
import { Client } from '@/client/Client'
import { EnkaBuild } from '@/models/enka/EnkaBuild'
import { GenshinAccount } from '@/models/enka/GenshinAccount'
import { PlayerDetail } from '@/models/enka/PlayerDetail'
import type { APIBuild } from '@/types/enkaNetwork/EnkaAccountTypes'

describe('GenshinAccount', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  }, 30000)

  describe('Constructor', () => {
    it('should create GenshinAccount from mock data', () => {
      const gameAccounts = createGenshinAccountsResponse()
      const gameAccount = gameAccounts.account1
      const buildDatas: Record<string, APIBuild[]> = {}
      const genshinAccount = new GenshinAccount(
        gameAccount,
        buildDatas,
        'testuser',
        'https://enka.network',
      )
      expect(genshinAccount).toBeDefined()
    })
  })

  describe('Instance Properties', () => {
    let genshinAccount: GenshinAccount

    beforeAll(() => {
      const gameAccounts = createGenshinAccountsResponse()
      const gameAccount = gameAccounts.account1
      const buildDatas: Record<string, APIBuild[]> = {}
      genshinAccount = new GenshinAccount(
        gameAccount,
        buildDatas,
        'testuser',
        'https://enka.network',
      )
    })

    it('should have correct uid', () => {
      expect(genshinAccount.uid).toBe(123456789)
    })

    it('should have correct hash', () => {
      expect(genshinAccount.hash).toBe('hash123')
    })

    it('should have correct region', () => {
      expect(genshinAccount.region).toBe('os_usa')
    })

    it('should have correct uidPublic', () => {
      expect(genshinAccount.uidPublic).toBe(true)
    })

    it('should have correct livePublic', () => {
      expect(genshinAccount.livePublic).toBe(true)
    })

    it('should have correct verified', () => {
      expect(genshinAccount.verified).toBe(true)
    })

    it('should have playerDetail as PlayerDetail', () => {
      expect(genshinAccount.playerDetail).toBeInstanceOf(PlayerDetail)
    })

    it('should have builds as array', () => {
      expect(genshinAccount.builds).toBeDefined()
      expect(Array.isArray(genshinAccount.builds)).toBe(true)
    })

    it('should have correct url', () => {
      expect(genshinAccount.url).toBe('https://enka.network/u/testuser/hash123')
    })

    it('should have data as original API data', () => {
      expect(genshinAccount.data).toBeDefined()
      expect(genshinAccount.data.uid).toBe(123456789)
    })
  })

  describe('PlayerDetail Properties', () => {
    let genshinAccount: GenshinAccount

    beforeAll(() => {
      const gameAccounts = createGenshinAccountsResponse()
      const gameAccount = gameAccounts.account1
      const buildDatas: Record<string, APIBuild[]> = {}
      genshinAccount = new GenshinAccount(
        gameAccount,
        buildDatas,
        'testuser',
        'https://enka.network',
      )
    })

    it('should have playerDetail with correct nickname', () => {
      expect(genshinAccount.playerDetail.nickname).toBe('TestPlayer1')
    })

    it('should have playerDetail with correct level', () => {
      expect(genshinAccount.playerDetail.level).toBe(60)
    })
  })

  describe('Different Account Properties', () => {
    it('should handle account with uidPublic false', () => {
      const gameAccounts = createGenshinAccountsResponse()
      const gameAccount = gameAccounts.account2
      const buildDatas: Record<string, APIBuild[]> = {}
      const genshinAccount = new GenshinAccount(
        gameAccount,
        buildDatas,
        'testuser',
        'https://enka.network',
      )
      expect(genshinAccount.uidPublic).toBe(false)
      expect(genshinAccount.livePublic).toBe(false)
      expect(genshinAccount.verified).toBe(false)
      expect(genshinAccount.region).toBe('os_euro')
    })
  })

  describe('Builds Functionality', () => {
    it('should create builds from build data', () => {
      const gameAccounts = createGenshinAccountsResponse()
      const gameAccount = {
        ...gameAccounts.account1,
        avatar_order: { '10000002': 0 },
      }
      const buildDatas: Record<string, APIBuild[]> = {
        '10000002': [createEnkaBuildResponse(1, 10000002)],
      }
      const genshinAccount = new GenshinAccount(
        gameAccount,
        buildDatas,
        'testuser',
        'https://enka.network',
      )
      expect(genshinAccount.builds.length).toBe(1)
      expect(genshinAccount.builds[0].length).toBe(1)
      expect(genshinAccount.builds[0][0]).toBeInstanceOf(EnkaBuild)
    })

    it('should order builds correctly', () => {
      const gameAccounts = createGenshinAccountsResponse()
      const gameAccount = {
        ...gameAccounts.account1,
        avatar_order: { '10000002': 1, '10000003': 0 },
      }
      const build1 = createEnkaBuildResponse(1, 10000002)
      const build2 = createEnkaBuildResponse(2, 10000003)
      const buildDatas: Record<string, APIBuild[]> = {
        '10000002': [build1],
        '10000003': [build2],
      }
      const genshinAccount = new GenshinAccount(
        gameAccount,
        buildDatas,
        'testuser',
        'https://enka.network',
      )
      expect(genshinAccount.builds.length).toBe(2)
      expect(genshinAccount.builds[0][0].characterDetail.id).toBe(10000003)
      expect(genshinAccount.builds[1][0].characterDetail.id).toBe(10000002)
    })

    it('should order multiple builds for same character', () => {
      const gameAccounts = createGenshinAccountsResponse()
      const gameAccount = {
        ...gameAccounts.account1,
        avatar_order: { '10000002': 0 },
      }
      const build1 = { ...createEnkaBuildResponse(1, 10000002), order: 2 }
      const build2 = { ...createEnkaBuildResponse(2, 10000002), order: 1 }
      const buildDatas: Record<string, APIBuild[]> = {
        '10000002': [build1, build2],
      }
      const genshinAccount = new GenshinAccount(
        gameAccount,
        buildDatas,
        'testuser',
        'https://enka.network',
      )
      expect(genshinAccount.builds[0].length).toBe(2)
      expect(genshinAccount.builds[0][0].id).toBe(2)
      expect(genshinAccount.builds[0][1].id).toBe(1)
    })
  })

  describe('Different Base URLs', () => {
    it('should handle different base URLs', () => {
      const gameAccounts = createGenshinAccountsResponse()
      const gameAccount = gameAccounts.account1
      const buildDatas: Record<string, APIBuild[]> = {}
      const genshinAccount = new GenshinAccount(
        gameAccount,
        buildDatas,
        'testuser',
        'https://custom.enka.network',
      )
      expect(genshinAccount.url).toBe(
        'https://custom.enka.network/u/testuser/hash123',
      )
    })
  })

  describe('Different Usernames', () => {
    it('should handle different usernames', () => {
      const gameAccounts = createGenshinAccountsResponse()
      const gameAccount = gameAccounts.account1
      const buildDatas: Record<string, APIBuild[]> = {}
      const genshinAccount = new GenshinAccount(
        gameAccount,
        buildDatas,
        'anotheruser',
        'https://enka.network',
      )
      expect(genshinAccount.url).toBe(
        'https://enka.network/u/anotheruser/hash123',
      )
    })
  })
})
