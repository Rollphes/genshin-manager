import { describe, expect, it } from 'vitest'

import { CharacterInfo } from '@/character/CharacterInfo'
import { BodyType, WeaponType } from '@/types/enums'
import { Element } from '@/types/types'

describe('CharacterInfo', () => {
  it('should create with all properties', () => {
    const info = new CharacterInfo({
      id: 10000046,
      defaultCostumeId: 204601,
      name: 'Hu Tao',
      maxLevel: 90,
      depotId: 4601,
      element: Element.Pyro,
      skillOrder: [10461, 10462, 10465],
      inherentSkillOrder: [462101, 462201],
      constellationIds: [461, 462, 463, 464, 465, 466],
      proudMap: new Map([
        [10461, 4631],
        [10462, 4632],
        [10465, 4635],
      ]),
      rarity: 5,
      weaponType: WeaponType.WeaponPole,
      bodyType: BodyType.BodyGirl,
    })

    expect(info.id).toBe(10000046)
    expect(info.name).toBe('Hu Tao')
    expect(info.element).toBe(Element.Pyro)
    expect(info.rarity).toBe(5)
    expect(info.weaponType).toBe(WeaponType.WeaponPole)
    expect(info.skillOrder).toHaveLength(3)
    expect(info.constellationIds).toHaveLength(6)
    expect(info.proudMap.get(10461)).toBe(4631)
  })

  it('should handle undefined element', () => {
    const info = new CharacterInfo({
      id: 10000005,
      defaultCostumeId: 200501,
      name: 'Traveler',
      maxLevel: 90,
      depotId: 501,
      element: undefined,
      skillOrder: [],
      inherentSkillOrder: [],
      constellationIds: [],
      proudMap: new Map(),
      rarity: 5,
      weaponType: WeaponType.WeaponSwordOneHand,
      bodyType: BodyType.BodyBoy,
    })

    expect(info.element).toBeUndefined()
  })
})
