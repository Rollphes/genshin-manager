import { describe, expect, it } from 'vitest'

import { EnkaAccount } from '@/dto/EnkaAccount'
import type { OwnerResponse } from '@/types/api/responses'

describe('EnkaAccount', () => {
  const ownerResponse: OwnerResponse = {
    id: 42,
    username: 'testuser',
    profile: {
      bio: 'Hello world',
      level: 5,
      signup_state: 1,
      avatar: 'https://example.com/avatar.png',
      image_url: 'https://example.com/image.png',
    },
  }

  it('should create from constructor data', () => {
    const account = new EnkaAccount({
      id: 42,
      username: 'testuser',
      bio: 'Hello world',
      level: 5,
      signupState: 1,
      avatar: 'https://example.com/avatar.png',
      imageURL: 'https://example.com/image.png',
      url: 'https://enka.network/u/testuser',
      data: ownerResponse,
    })
    expect(account.id).toBe(42)
    expect(account.username).toBe('testuser')
    expect(account.bio).toBe('Hello world')
    expect(account.url).toBe('https://enka.network/u/testuser')
  })

  it('should build from API response via fromResponse', () => {
    const account = EnkaAccount.fromResponse(
      ownerResponse,
      'https://enka.network',
    )
    expect(account.id).toBe(42)
    expect(account.username).toBe('testuser')
    expect(account.bio).toBe('Hello world')
    expect(account.level).toBe(5)
    expect(account.signupState).toBe(1)
    expect(account.avatar).toBe('https://example.com/avatar.png')
    expect(account.imageURL).toBe('https://example.com/image.png')
    expect(account.url).toBe('https://enka.network/u/testuser')
    expect(account.data).toBe(ownerResponse)
  })

  it('should handle null avatar', () => {
    const response: OwnerResponse = {
      ...ownerResponse,
      profile: { ...ownerResponse.profile, avatar: null },
    }
    const account = EnkaAccount.fromResponse(response, 'https://enka.network')
    expect(account.avatar).toBeUndefined()
  })

  it('should handle different base URLs', () => {
    const account = EnkaAccount.fromResponse(
      ownerResponse,
      'https://custom.enka.network',
    )
    expect(account.url).toBe('https://custom.enka.network/u/testuser')
  })

  it('should handle different usernames', () => {
    const response: OwnerResponse = {
      ...ownerResponse,
      username: 'anotheruser',
    }
    const account = EnkaAccount.fromResponse(response, 'https://enka.network')
    expect(account.username).toBe('anotheruser')
    expect(account.url).toBe('https://enka.network/u/anotheruser')
  })

  it('should preserve raw data', () => {
    const account = EnkaAccount.fromResponse(
      ownerResponse,
      'https://enka.network',
    )
    expect(account.data).toBe(ownerResponse)
    expect(account.data.username).toBe('testuser')
  })
})
