import { describe, expect, it } from 'vitest'

import { ImageAssets } from '@/assets/ImageAssets'
import { WeaponType } from '@/types/enums'
import { Weapon } from '@/weapon/Weapon'
import { WeaponAscension } from '@/weapon/WeaponAscension'
import { WeaponInfo } from '@/weapon/WeaponInfo'
import { WeaponRefinement } from '@/weapon/WeaponRefinement'

describe('Weapon', () => {
  it('should provide shortcut getters', () => {
    const icon = new ImageAssets({
      name: 'UI_EquipIcon_Pole_Homa',
      imageBaseURL: 'https://example.com',
    })
    const info = new WeaponInfo({
      id: 13501,
      name: 'Staff of Homa',
      description: '',
      type: WeaponType.WeaponPole,
      skillName: 'Reckless Cinnabar',
      skillDescription: 'HP increased by 20%',
      level: 90,
      maxLevel: 90,
      promoteLevel: 6,
      isAscended: true,
      refinementRank: 1,
      rarity: 5,
      stats: [],
      isAwaken: true,
      icon,
    })
    const ascension = new WeaponAscension({
      id: 13501,
      promoteLevel: 6,
      costItems: [],
      costMora: 0,
      addProps: [],
      unlockMaxLevel: 90,
    })
    const refinement = new WeaponRefinement({
      id: 13501,
      refinementRank: 1,
      skillName: 'Reckless Cinnabar',
      skillDescription: 'HP increased by 20%',
      addProps: [],
    })

    const weapon = new Weapon({
      info,
      ascension,
      refinement,
      allAscensionMaterials: [{ id: 104131, count: 6 }],
    })

    expect(weapon.id).toBe(13501)
    expect(weapon.name).toBe('Staff of Homa')
    expect(weapon.level).toBe(90)
    expect(weapon.isCanAscend).toBe(false)
    expect(weapon.allAscensionMaterials).toHaveLength(1)
  })

  it('should detect can ascend', () => {
    const icon = new ImageAssets({
      name: 'UI_EquipIcon_Sword_Dull',
      imageBaseURL: 'https://example.com',
    })
    const info = new WeaponInfo({
      id: 11101,
      name: 'Dull Blade',
      description: '',
      type: WeaponType.WeaponSwordOneHand,
      skillName: undefined,
      skillDescription: undefined,
      level: 40,
      maxLevel: 70,
      promoteLevel: 2,
      isAscended: false,
      refinementRank: 1,
      rarity: 1,
      stats: [],
      isAwaken: false,
      icon,
    })
    const weapon = new Weapon({
      info,
      ascension: new WeaponAscension({
        id: 11101,
        promoteLevel: 2,
        costItems: [],
        costMora: 0,
        addProps: [],
        unlockMaxLevel: 50,
      }),
      refinement: new WeaponRefinement({
        id: 11101,
        refinementRank: 1,
        skillName: undefined,
        skillDescription: undefined,
        addProps: [],
      }),
      allAscensionMaterials: [],
    })

    expect(weapon.isCanAscend).toBe(true)
  })
})
