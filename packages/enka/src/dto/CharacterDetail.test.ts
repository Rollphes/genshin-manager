import { describe, expect, it } from 'vitest'

import { CharacterDetail } from '@/dto/CharacterDetail'
import type { AvatarInfoResponse } from '@/types/api/responses'

describe('CharacterDetail', () => {
  const mockAvatarInfo: AvatarInfoResponse = {
    avatarId: 10000046,
    costumeId: 200401,
    propMap: {
      4001: { val: '90' },
      1002: { val: '6' },
      1001: { val: '0' },
    },
    talentIdList: [461, 462, 463],
    fightPropMap: { 1: 15552.5, 2: 311.2, 3: 0 },
    skillDepotId: 4601,
    skillLevelMap: { '10461': 10, '10462': 10, '10465': 10 },
    proudSkillExtraLevelMap: { '3941': 3 },
    equipList: [
      {
        itemId: 11509,
        weapon: { level: 90, promoteLevel: 6, affixMap: { '111509': 4 } },
      },
      {
        itemId: 81525,
        reliquary: {
          level: 21,
          mainPropId: 10001,
          appendPropIdList: [501221, 501231],
        },
      },
    ],
    fetterInfo: { expLevel: 10 },
  }

  it('should construct from data', () => {
    const detail = CharacterDetail.fromResponse(mockAvatarInfo)
    expect(detail.avatarId).toBe(10000046)
    expect(detail.costumeId).toBe(200401)
    expect(detail.level).toBe(90)
    expect(detail.ascension).toBe(6)
    expect(detail.skillDepotId).toBe(4601)
    expect(detail.constellationCount).toBe(3)
    expect(detail.friendshipLevel).toBe(10)
  })

  it('should separate weapon and artifact equips', () => {
    const detail = CharacterDetail.fromResponse(mockAvatarInfo)
    expect(detail.weaponEquip).toBeDefined()
    expect(detail.weaponEquip?.itemId).toBe(11509)
    expect(detail.artifactEquips).toHaveLength(1)
    expect(detail.artifactEquips[0].itemId).toBe(81525)
  })

  it('should handle missing optional fields', () => {
    const minimal: AvatarInfoResponse = {
      avatarId: 10000007,
      propMap: {},
      fightPropMap: {},
      skillDepotId: 701,
      skillLevelMap: {},
      equipList: [],
      fetterInfo: { expLevel: 1 },
    }
    const detail = CharacterDetail.fromResponse(minimal)
    expect(detail.level).toBe(1)
    expect(detail.ascension).toBe(0)
    expect(detail.constellationCount).toBe(0)
    expect(detail.weaponEquip).toBeUndefined()
    expect(detail.artifactEquips).toHaveLength(0)
  })
})
