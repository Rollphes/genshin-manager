import { beforeAll, describe, expect, test } from 'vitest'

import { Client } from '@/client/Client.js'
import { Artifact } from '@/models/Artifact'
import { CharacterConstellation } from '@/models/character/CharacterConstellation'
import { CharacterCostume } from '@/models/character/CharacterCostume'
import { CharacterInfo } from '@/models/character/CharacterInfo'
import { CharacterInherentSkill } from '@/models/character/CharacterInherentSkill'
import { CharacterProfile } from '@/models/character/CharacterProfile'
import { CharacterSkill } from '@/models/character/CharacterSkill'
import { CharacterStory } from '@/models/character/CharacterStory'
import { CharacterVoice } from '@/models/character/CharacterVoice'
import { DailyFarming } from '@/models/DailyFarming'
import { Material } from '@/models/Material'
import { Monster } from '@/models/Monster'
import { ProfilePicture } from '@/models/ProfilePicture'
import { Weapon } from '@/models/weapon/Weapon'

describe('AllId Release Test', () => {
  beforeAll(async () => {
    // Client deployment is already handled in test/setup.ts
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  })
  test('should instantiate all CharacterInfo instances', () => {
    const characterIds = CharacterInfo.allCharacterIds
    expect(characterIds.length).toBeGreaterThan(0)

    characterIds.forEach((id) => {
      const character = new CharacterInfo(id)
      expect(character).toBeDefined()
      expect(character.id).toBe(id)
    })
  })

  test('should instantiate all CharacterCostume instances', () => {
    const costumeIds = CharacterCostume.allCostumeIds
    expect(costumeIds.length).toBeGreaterThan(0)

    costumeIds.forEach((id) => {
      const costume = new CharacterCostume(id)
      expect(costume).toBeDefined()
      expect(costume.id).toBe(id)
    })
  })

  test('should instantiate all CharacterProfile instances', () => {
    const characterIds = CharacterProfile.allCharacterIds
    expect(characterIds.length).toBeGreaterThan(0)

    characterIds.forEach((id) => {
      const profile = new CharacterProfile(id)
      expect(profile).toBeDefined()
      expect(profile.characterId).toBe(id)
    })
  })

  test('should instantiate all CharacterSkill instances', () => {
    const skillIds = CharacterSkill.allSkillIds
    expect(skillIds.length).toBeGreaterThan(0)

    skillIds.forEach((id) => {
      const skill = new CharacterSkill(id)
      expect(skill).toBeDefined()
      expect(skill.id).toBe(id)
    })
  })

  test('should instantiate all CharacterInherentSkill instances', () => {
    const inherentSkillIds = CharacterInherentSkill.allInherentSkillIds
    expect(inherentSkillIds.length).toBeGreaterThan(0)

    inherentSkillIds.forEach((id) => {
      const inherentSkill = new CharacterInherentSkill(id)
      expect(inherentSkill).toBeDefined()
      expect(inherentSkill.id).toBe(id)
    })
  })

  test('should instantiate all CharacterConstellation instances', () => {
    const constellationIds = CharacterConstellation.allConstellationIds
    expect(constellationIds.length).toBeGreaterThan(0)

    constellationIds.forEach((id) => {
      const constellation = new CharacterConstellation(id)
      expect(constellation).toBeDefined()
      expect(constellation.id).toBe(id)
    })
  })

  test('should instantiate all CharacterStory instances', () => {
    const fetterIds = CharacterStory.allFetterIds
    expect(fetterIds.length).toBeGreaterThan(0)

    fetterIds.forEach((id) => {
      const story = new CharacterStory(id)
      expect(story).toBeDefined()
      expect(story.fetterId).toBe(id)
    })
  })

  test('should instantiate all CharacterVoice instances', () => {
    const fetterIds = CharacterVoice.allFetterIds
    expect(fetterIds.length).toBeGreaterThan(0)

    fetterIds.forEach((id) => {
      const voice = new CharacterVoice(id, 'EN')
      expect(voice).toBeDefined()
      expect(voice.fetterId).toBe(id)
      expect(voice.cv).toBe('EN')
    })
  })

  test('should instantiate all Artifact instances', () => {
    const artifactIds = Artifact.allArtifactIds
    expect(artifactIds.length).toBeGreaterThan(0)

    artifactIds.forEach((id) => {
      const artifact = new Artifact(id, 10001)
      expect(artifact).toBeDefined()
      expect(artifact.id).toBe(id)
      expect(artifact.level).toBe(0)
    })
  })

  test('should instantiate all Material instances', () => {
    const materialIds = Material.allMaterialIds
    expect(materialIds.length).toBeGreaterThan(0)

    materialIds.forEach((id) => {
      const material = new Material(id)
      expect(material).toBeDefined()
      expect(material.id).toBe(id)
    })
  })

  test('should instantiate all Weapon instances', () => {
    const weaponIds = Weapon.allWeaponIds
    expect(weaponIds.length).toBeGreaterThan(0)

    weaponIds.forEach((id) => {
      const weapon = new Weapon(id)
      expect(weapon).toBeDefined()
      expect(weapon.id).toBe(id)
    })
  })

  test('should instantiate all Monster instances', () => {
    const monsterIds = Monster.allMonsterIds
    expect(monsterIds.length).toBeGreaterThan(0)

    monsterIds.forEach((id) => {
      const monster = new Monster(id)
      expect(monster).toBeDefined()
      expect(monster.id).toBe(id)
    })
  })

  test('should instantiate all ProfilePicture instances', () => {
    const profilePictureIds = ProfilePicture.allProfilePictureIds
    expect(profilePictureIds.length).toBeGreaterThan(0)

    profilePictureIds.forEach((id) => {
      const profilePicture = new ProfilePicture(id)
      expect(profilePicture).toBeDefined()
      expect(profilePicture.id).toBe(id)
    })
  })

  test('should instantiate all DailyFarming instances', () => {
    for (let i = 0; i < 7; i++) {
      const dailyFarming = new DailyFarming(i)
      expect(dailyFarming).toBeDefined()
      expect(dailyFarming.dayOfWeek).toBe(i)
    }
  })
})
