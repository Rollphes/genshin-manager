import { describe, expect, it } from 'vitest'

import { ImageAssets } from '@/assets/ImageAssets'
import { StatProperty } from '@/common/StatProperty'
import { WeaponType } from '@/types/enums'
import { WeaponInfo } from '@/weapon/WeaponInfo'

describe('WeaponInfo', () => {
  it('should create with all properties', () => {
    const icon = new ImageAssets({
      name: 'UI_EquipIcon_Pole_Homa',
      imageBaseURL: 'https://example.com',
    })
    const stat = new StatProperty({
      type: 'FIGHT_PROP_BASE_ATTACK' as never,
      name: 'Base ATK',
      value: 608,
    })
    const info = new WeaponInfo({
      id: 13501,
      name: 'Staff of Homa',
      description: 'A weapon description',
      type: WeaponType.WeaponPole,
      skillName: 'Reckless Cinnabar',
      skillDescription: 'HP increased by 20%',
      level: 90,
      maxLevel: 90,
      promoteLevel: 6,
      isAscended: true,
      refinementRank: 1,
      rarity: 5,
      stats: [stat],
      isAwaken: true,
      icon,
    })

    expect(info.id).toBe(13501)
    expect(info.name).toBe('Staff of Homa')
    expect(info.type).toBe(WeaponType.WeaponPole)
    expect(info.level).toBe(90)
    expect(info.rarity).toBe(5)
    expect(info.stats).toHaveLength(1)
    expect(info.isAwaken).toBe(true)
    expect(info.icon.name).toBe('UI_EquipIcon_Pole_Homa')
  })

  it('should handle weapon without skill', () => {
    const icon = new ImageAssets({
      name: 'UI_EquipIcon_Sword_Dull',
      imageBaseURL: 'https://example.com',
    })
    const info = new WeaponInfo({
      id: 11101,
      name: 'Dull Blade',
      description: 'A dull blade',
      type: WeaponType.WeaponSwordOneHand,
      skillName: undefined,
      skillDescription: undefined,
      level: 1,
      maxLevel: 70,
      promoteLevel: 0,
      isAscended: false,
      refinementRank: 1,
      rarity: 1,
      stats: [],
      isAwaken: false,
      icon,
    })

    expect(info.skillName).toBeUndefined()
    expect(info.skillDescription).toBeUndefined()
    expect(info.isAwaken).toBe(false)
  })
})
