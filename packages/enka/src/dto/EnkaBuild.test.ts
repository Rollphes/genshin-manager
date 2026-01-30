import { describe, expect, it } from 'vitest'

import { EnkaBuild } from '@/dto/EnkaBuild'
import type { BuildResponse } from '@/types/api/responses'

describe('EnkaBuild', () => {
  const mockBuild: BuildResponse = {
    id: 12345,
    name: 'Main DPS',
    avatar_id: '10000046',
    avatar_data: {
      avatarId: 10000046,
      propMap: { 4001: { val: '90' }, 1002: { val: '6' }, 1001: { val: '0' } },
      fightPropMap: { 1: 15000 },
      skillDepotId: 4601,
      skillLevelMap: { '10461': 10 },
      equipList: [],
      fetterInfo: { expLevel: 10 },
    },
    order: 0,
    live: true,
    settings: {
      caption: 'Best build',
      honkardWidth: 100,
      adaptiveColor: true,
    },
    public: true,
    image: 'https://example.com/image.png',
    hoyo_type: 0,
  }

  it('should construct from response', () => {
    const build = EnkaBuild.fromResponse(mockBuild)
    expect(build.id).toBe(12345)
    expect(build.name).toBe('Main DPS')
    expect(build.avatarId).toBe('10000046')
    expect(build.isLive).toBe(true)
    expect(build.isPublic).toBe(true)
    expect(build.description).toBe('Best build')
    expect(build.honkardWidth).toBe(100)
    expect(build.isAdaptiveColor).toBe(true)
    expect(build.imageURL).toBe('https://example.com/image.png')
  })

  it('should build character detail from avatar_data', () => {
    const build = EnkaBuild.fromResponse(mockBuild)
    expect(build.characterDetail.avatarId).toBe(10000046)
    expect(build.characterDetail.level).toBe(90)
  })

  it('should handle null image and missing settings', () => {
    const minimal: BuildResponse = {
      ...mockBuild,
      image: null,
      settings: {},
    }
    const build = EnkaBuild.fromResponse(minimal)
    expect(build.imageURL).toBeUndefined()
    expect(build.description).toBeUndefined()
    expect(build.isAdaptiveColor).toBe(false)
  })
})
