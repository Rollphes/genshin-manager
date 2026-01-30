import { describe, expect, it } from 'vitest'

import { GenshinAccount } from '@/dto/GenshinAccount'
import type { GameAccountResponse } from '@/types/api/responses'

describe('GenshinAccount', () => {
  const mockGameAccount: GameAccountResponse = {
    uid: 800000001,
    uid_public: true,
    public: true,
    live_public: true,
    verified: true,
    player_info: {
      nickname: 'Traveler',
      level: 60,
      nameCardId: 210001,
    },
    hash: 'abc123',
    region: 'os_asia',
    order: 0,
    avatar_order: { '10000046': 0, '10000052': 1 },
    hoyo_type: 0,
  }

  it('should construct from response', () => {
    const account = GenshinAccount.fromResponse(mockGameAccount)
    expect(account.uid).toBe(800000001)
    expect(account.hash).toBe('abc123')
    expect(account.region).toBe('os_asia')
    expect(account.uidPublic).toBe(true)
    expect(account.livePublic).toBe(true)
    expect(account.verified).toBe(true)
    expect(account.order).toBe(0)
  })

  it('should build player detail from player_info', () => {
    const account = GenshinAccount.fromResponse(mockGameAccount)
    expect(account.playerDetail.nickname).toBe('Traveler')
    expect(account.playerDetail.level).toBe(60)
  })

  it('should preserve avatar order', () => {
    const account = GenshinAccount.fromResponse(mockGameAccount)
    expect(account.avatarOrder['10000046']).toBe(0)
    expect(account.avatarOrder['10000052']).toBe(1)
  })
})
