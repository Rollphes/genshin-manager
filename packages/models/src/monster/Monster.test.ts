import { describe, expect, it } from 'vitest'

import { ImageAssets } from '@/assets/ImageAssets'
import { StatProperty } from '@/common/StatProperty'
import { Monster } from '@/monster/Monster'
import { FightProp } from '@/types/enums'

describe('Monster', () => {
  it('should create with all properties', () => {
    const icon = new ImageAssets({
      name: 'UI_MonsterIcon_Slime_Water_01',
      imageBaseURL: 'https://example.com',
    })
    const stat = new StatProperty({
      type: FightProp.FightPropBaseHP,
      name: 'Base HP',
      value: 500,
    })
    const monster = new Monster({
      id: 21010101,
      level: 50,
      playerCount: 1,
      internalName: 'Monster_Slime_Water_01',
      name: 'Hydro Slime',
      describeName: 'Slime',
      description: 'A slime',
      icon,
      stats: [stat],
      codexType: undefined,
    })

    expect(monster.id).toBe(21010101)
    expect(monster.level).toBe(50)
    expect(monster.name).toBe('Hydro Slime')
    expect(monster.stats).toHaveLength(1)
    expect(monster.icon).toBeDefined()
  })

  it('should handle monster without icon and codex', () => {
    const monster = new Monster({
      id: 99999999,
      level: 1,
      playerCount: 4,
      internalName: 'Monster_Unknown',
      name: 'Unknown',
      describeName: '',
      description: '',
      icon: undefined,
      stats: [],
      codexType: undefined,
    })

    expect(monster.icon).toBeUndefined()
    expect(monster.codexType).toBeUndefined()
    expect(monster.playerCount).toBe(4)
  })
})
