import { beforeAll, describe, expect, it } from 'vitest'

import { createEnkaAccountResponse } from '@/__test__/__mocks__/api/enka-manager/createEnkaAccountResponse'
import { Client } from '@/client/Client'
import { EnkaAccount } from '@/models/enka/EnkaAccount'

describe('EnkaAccount', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  }, 30000)

  describe('Constructor', () => {
    it('should create EnkaAccount from mock data', () => {
      const mockData = createEnkaAccountResponse('testuser')
      const enkaAccount = new EnkaAccount(mockData, 'https://enka.network')
      expect(enkaAccount).toBeDefined()
    })
  })

  describe('Instance Properties', () => {
    let enkaAccount: EnkaAccount

    beforeAll(() => {
      const mockData = createEnkaAccountResponse('testuser')
      enkaAccount = new EnkaAccount(mockData, 'https://enka.network')
    })

    it('should have correct id', () => {
      expect(enkaAccount.id).toBe(12345)
    })

    it('should have correct username', () => {
      expect(enkaAccount.username).toBe('testuser')
    })

    it('should have correct bio', () => {
      expect(enkaAccount.bio).toBe('Bio for testuser')
    })

    it('should have correct level', () => {
      expect(enkaAccount.level).toBe(10)
    })

    it('should have correct signupState', () => {
      expect(enkaAccount.signupState).toBe(1)
    })

    it('should have avatar as undefined or string', () => {
      expect(
        enkaAccount.avatar === undefined ||
          typeof enkaAccount.avatar === 'string',
      ).toBe(true)
    })

    it('should have correct imageURL', () => {
      expect(enkaAccount.imageURL).toBe('https://example.com/avatar.png')
    })

    it('should have correct url', () => {
      expect(enkaAccount.url).toBe('https://enka.network/u/testuser')
    })

    it('should have data as original API data', () => {
      expect(enkaAccount.data).toBeDefined()
      expect(enkaAccount.data.username).toBe('testuser')
    })
  })

  describe('Different Usernames', () => {
    it('should handle different usernames', () => {
      const mockData = createEnkaAccountResponse('anotheruser')
      const enkaAccount = new EnkaAccount(mockData, 'https://enka.network')
      expect(enkaAccount.username).toBe('anotheruser')
      expect(enkaAccount.bio).toBe('Bio for anotheruser')
      expect(enkaAccount.url).toBe('https://enka.network/u/anotheruser')
    })
  })

  describe('Different Base URLs', () => {
    it('should handle different base URLs', () => {
      const mockData = createEnkaAccountResponse('testuser')
      const enkaAccount = new EnkaAccount(
        mockData,
        'https://custom.enka.network',
      )
      expect(enkaAccount.url).toBe('https://custom.enka.network/u/testuser')
    })
  })
})
