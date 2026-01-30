import { describe, expect, it } from 'vitest'

import { Artifact } from '@/artifact/Artifact'
import { ImageAssets } from '@/assets/ImageAssets'
import { StatProperty } from '@/common/StatProperty'
import { EquipType, FightProp } from '@/types/enums'

describe('Artifact', () => {
  it('should create with all properties', () => {
    const icon = new ImageAssets({
      name: 'UI_RelicIcon_15001_4',
      imageBaseURL: 'https://example.com',
    })
    const mainStat = new StatProperty({
      type: FightProp.FightPropHPPercent,
      name: 'HP%',
      value: 0.466,
    })
    const subStat = new StatProperty({
      type: FightProp.FightPropCriticalHurt,
      name: 'CRIT DMG',
      value: 0.194,
    })
    const artifact = new Artifact({
      id: 81101,
      level: 20,
      type: EquipType.EquipBracer,
      name: 'Flower of Life',
      description: 'A flower',
      setId: 15001,
      setName: "Gladiator's Finale",
      setDescriptions: {
        2: 'ATK +18%',
        4: 'Normal Attack DMG +35%',
      },
      rarity: 5,
      mainStat,
      subStats: [subStat],
      appendProps: [
        { id: 501221, type: FightProp.FightPropCriticalHurt, value: 0.194 },
      ],
      icon,
    })

    expect(artifact.id).toBe(81101)
    expect(artifact.level).toBe(20)
    expect(artifact.type).toBe(EquipType.EquipBracer)
    expect(artifact.rarity).toBe(5)
    expect(artifact.setId).toBe(15001)
    expect(artifact.subStats).toHaveLength(1)
    expect(artifact.appendProps).toHaveLength(1)
  })

  it('should handle artifact without set', () => {
    const icon = new ImageAssets({
      name: 'UI_RelicIcon_15000_1',
      imageBaseURL: 'https://example.com',
    })
    const mainStat = new StatProperty({
      type: FightProp.FightPropHP,
      name: 'HP',
      value: 4780,
    })
    const artifact = new Artifact({
      id: 99999,
      level: 0,
      type: EquipType.EquipBracer,
      name: 'Unknown Flower',
      description: '',
      setId: undefined,
      setName: undefined,
      setDescriptions: {},
      rarity: 1,
      mainStat,
      subStats: [],
      appendProps: [],
      icon,
    })

    expect(artifact.setId).toBeUndefined()
    expect(artifact.setName).toBeUndefined()
  })
})
