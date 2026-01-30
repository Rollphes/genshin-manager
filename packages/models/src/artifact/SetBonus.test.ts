import { describe, expect, it } from 'vitest'

import { Artifact } from '@/artifact/Artifact'
import { SetBonus } from '@/artifact/SetBonus'
import { ImageAssets } from '@/assets/ImageAssets'
import { StatProperty } from '@/common/StatProperty'
import { EquipType, FightProp } from '@/types/enums'

function createArtifact(id: number, setId: number | undefined): Artifact {
  return new Artifact({
    id,
    level: 0,
    type: EquipType.EquipBracer,
    name: `Artifact ${String(id)}`,
    description: '',
    setId,
    setName: setId ? `Set ${String(setId)}` : undefined,
    setDescriptions: {},
    rarity: 5,
    mainStat: new StatProperty({
      type: FightProp.FightPropHP,
      name: 'HP',
      value: 717,
    }),
    subStats: [],
    appendProps: [],
    icon: new ImageAssets({
      name: `UI_RelicIcon_${String(id)}`,
      imageBaseURL: 'https://example.com',
    }),
  })
}

describe('SetBonus', () => {
  it('should store categorized bonuses', () => {
    const bonus = new SetBonus({
      oneSetBonus: [createArtifact(1, 15009)],
      twoSetBonus: [createArtifact(2, 15001)],
      fourSetBonus: [createArtifact(3, 15002)],
    })

    expect(bonus.oneSetBonus).toHaveLength(1)
    expect(bonus.twoSetBonus).toHaveLength(1)
    expect(bonus.fourSetBonus).toHaveLength(1)
  })

  it('should handle empty bonuses', () => {
    const bonus = new SetBonus({
      oneSetBonus: [],
      twoSetBonus: [],
      fourSetBonus: [],
    })

    expect(bonus.oneSetBonus).toHaveLength(0)
    expect(bonus.twoSetBonus).toHaveLength(0)
    expect(bonus.fourSetBonus).toHaveLength(0)
  })
})
