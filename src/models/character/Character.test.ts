import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { Character } from '@/models/character/Character'
import { CharacterInfo } from '@/models/character/CharacterInfo'

describe('Character', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  }, 30000)

  describe('Static Methods', () => {
    it('should return all character IDs', () => {
      const ids = Character.allCharacterIds
      expect(ids).toBeDefined()
      expect(ids.length).toBeGreaterThan(0)
      expect(ids).toEqual(CharacterInfo.allCharacterIds)
    })

    it('should get character ID by name', () => {
      const ids = Character.getCharacterIdByName('Amber')
      expect(ids).toBeDefined()
      expect(ids.length).toBeGreaterThan(0)
    })

    it('should get traveler skill depot IDs', () => {
      const travelerId = 10000005 // Aether
      const depotIds = Character.getTravelerSkillDepotIds(travelerId)
      expect(depotIds).toBeDefined()
      expect(depotIds.length).toBeGreaterThan(0)
    })
  })

  describe('Constructor', () => {
    it('should create character with default values', () => {
      const characterId = 10000002 // Ayaka
      const character = new Character(characterId)

      expect(character.id).toBe(characterId)
      expect(character.level).toBe(1)
      expect(character.isAscended).toBe(false)
      expect(character.constellationLevel).toBe(0)
    })

    it('should create character with custom level', () => {
      const characterId = 10000002
      const character = new Character(characterId, 90)

      expect(character.level).toBe(90)
    })

    it('should create character with ascension flag', () => {
      const characterId = 10000002
      const character = new Character(characterId, 80, true)

      expect(character.level).toBe(80)
      expect(character.isAscended).toBe(true)
    })

    it('should create character with constellation level', () => {
      const characterId = 10000002
      const character = new Character(characterId, 90, true, 6)

      expect(character.constellationLevel).toBe(6)
    })
  })

  describe('Basic Properties', () => {
    let character: Character

    beforeAll(() => {
      character = new Character(10000002, 90, true, 0) // Ayaka Lv90
    })

    it('should have valid name', () => {
      expect(character.name).toBeDefined()
      expect(typeof character.name).toBe('string')
      expect(character.name.length).toBeGreaterThan(0)
    })

    it('should have valid max level', () => {
      expect(character.maxLevel).toBeDefined()
      expect(character.maxLevel).toBe(90)
    })

    it('should have valid element', () => {
      expect(character.element).toBeDefined()
    })

    it('should have valid rarity', () => {
      expect(character.rarity).toBeDefined()
      expect(character.rarity).toBeGreaterThanOrEqual(4)
      expect(character.rarity).toBeLessThanOrEqual(5)
    })

    it('should have valid weapon type', () => {
      expect(character.weaponType).toBeDefined()
    })

    it('should have valid body type', () => {
      expect(character.bodyType).toBeDefined()
    })

    it('should have valid promote level', () => {
      expect(character.promoteLevel).toBeDefined()
      expect(character.promoteLevel).toBeGreaterThanOrEqual(0)
      expect(character.promoteLevel).toBeLessThanOrEqual(6)
    })

    it('should have valid stats', () => {
      const stats = character.stats
      expect(stats).toBeDefined()
      expect(Array.isArray(stats)).toBe(true)
      expect(stats.length).toBeGreaterThan(0)
    })

    it('should have valid default costume ID', () => {
      expect(character.defaultCostumeId).toBeDefined()
      expect(typeof character.defaultCostumeId).toBe('number')
    })

    it('should have valid depot ID', () => {
      expect(character.depotId).toBeDefined()
      expect(typeof character.depotId).toBe('number')
    })

    it('should have valid skill order', () => {
      expect(character.skillOrder).toBeDefined()
      expect(Array.isArray(character.skillOrder)).toBe(true)
      expect(character.skillOrder.length).toBeGreaterThan(0)
    })

    it('should have valid inherent skill order', () => {
      expect(character.inherentSkillOrder).toBeDefined()
      expect(Array.isArray(character.inherentSkillOrder)).toBe(true)
    })

    it('should have valid constellation IDs', () => {
      expect(character.constellationIds).toBeDefined()
      expect(Array.isArray(character.constellationIds)).toBe(true)
      expect(character.constellationIds.length).toBe(6)
    })

    it('should have valid proud map', () => {
      expect(character.proudMap).toBeDefined()
      expect(character.proudMap instanceof Map).toBe(true)
    })
  })

  describe('Related Objects', () => {
    let character: Character

    beforeAll(() => {
      character = new Character(10000002, 90, true, 3) // Ayaka C3
    })

    it('should return constellations', () => {
      const constellations = character.constellations
      expect(constellations).toBeDefined()
      expect(constellations.length).toBe(6)
      // C3 means first 3 have locked=false (acquired), rest locked=true
      expect(constellations[0].locked).toBe(false)
      expect(constellations[1].locked).toBe(false)
      expect(constellations[2].locked).toBe(false)
      expect(constellations[3].locked).toBe(true)
    })

    it('should return inherent skills', () => {
      const skills = character.inherentSkills
      expect(skills).toBeDefined()
      expect(Array.isArray(skills)).toBe(true)
    })

    it('should return ascension materials', () => {
      const materials = character.ascensionMaterials
      expect(materials).toBeDefined()
      expect(Array.isArray(materials)).toBe(true)
    })

    it('should return profile', () => {
      const profile = character.profile
      expect(profile).toBeDefined()
      expect(profile.characterId).toBe(character.id)
    })

    it('should return stories', () => {
      const stories = character.stories
      expect(stories).toBeDefined()
      expect(Array.isArray(stories)).toBe(true)
    })

    it('should return voices with default language', () => {
      const voices = character.getVoices()
      expect(voices).toBeDefined()
      expect(Array.isArray(voices)).toBe(true)
    })

    it('should return voices with specified language', () => {
      const voices = character.getVoices('JP')
      expect(voices).toBeDefined()
      expect(Array.isArray(voices)).toBe(true)
      if (voices.length > 0) expect(voices[0].cv).toBe('JP')
    })

    it('should return costumes', () => {
      const costumes = character.costumes
      expect(costumes).toBeDefined()
      expect(Array.isArray(costumes)).toBe(true)
    })
  })

  describe('Skills', () => {
    let character: Character

    beforeAll(() => {
      character = new Character(10000002, 90, true, 0)
    })

    it('should get normal attack skill', () => {
      const skill = character.getNormalAttack()
      expect(skill).toBeDefined()
      expect(skill.id).toBeDefined()
    })

    it('should get normal attack skill with custom level', () => {
      const skill = character.getNormalAttack(10)
      expect(skill).toBeDefined()
    })

    it('should get elemental skill', () => {
      const skill = character.getElementalSkill()
      expect(skill).toBeDefined()
      expect(skill.id).toBeDefined()
    })

    it('should get elemental burst', () => {
      const skill = character.getElementalBurst()
      expect(skill).toBeDefined()
      expect(skill.id).toBeDefined()
    })
  })

  describe('Materials', () => {
    let character: Character

    beforeAll(() => {
      character = new Character(10000002, 80, false, 0) // Ayaka Lv80 not ascended
    })

    it('should check if can ascend', () => {
      expect(character.isCanAscend).toBe(true)
    })

    it('should return next ascension materials', () => {
      const materials = character.nextAscensionMaterials
      expect(materials).toBeDefined()
      expect(Array.isArray(materials)).toBe(true)
      expect(materials.length).toBeGreaterThan(0)
    })

    it('should return empty next ascension for max level', () => {
      const maxCharacter = new Character(10000002, 90, true, 0)
      const materials = maxCharacter.nextAscensionMaterials
      expect(materials).toEqual([])
    })

    it('should return total ascension materials', () => {
      const materials = character.totalAscensionMaterials
      expect(materials).toBeDefined()
      expect(Array.isArray(materials)).toBe(true)
    })

    it('should get normal attack materials', () => {
      const materials = character.getNormalAttackMaterials(2)
      expect(materials).toBeDefined()
      expect(Array.isArray(materials)).toBe(true)
    })

    it('should get elemental skill materials', () => {
      const materials = character.getElementalSkillMaterials(2)
      expect(materials).toBeDefined()
      expect(Array.isArray(materials)).toBe(true)
    })

    it('should get elemental burst materials', () => {
      const materials = character.getElementalBurstMaterials(2)
      expect(materials).toBeDefined()
      expect(Array.isArray(materials)).toBe(true)
    })
  })

  describe('Upgrade Plan Calculation', () => {
    let character: Character

    beforeAll(() => {
      character = new Character(10000002, 1, false, 0)
    })

    it('should calculate upgrade materials for character level', () => {
      const materials = character.calculateUpgradeMaterials({
        characterLevel: [1, 90],
      })
      expect(materials).toBeDefined()
      expect(Array.isArray(materials)).toBe(true)
      expect(materials.length).toBeGreaterThan(0)
    })

    it('should calculate upgrade materials for skills', () => {
      const materials = character.calculateUpgradeMaterials({
        skillLevels: {
          normalAttack: [1, 10],
          elementalSkill: [1, 10],
          elementalBurst: [1, 10],
        },
      })
      expect(materials).toBeDefined()
      expect(Array.isArray(materials)).toBe(true)
      expect(materials.length).toBeGreaterThan(0)
    })

    it('should calculate combined upgrade materials', () => {
      const materials = character.calculateUpgradeMaterials({
        characterLevel: [1, 90],
        skillLevels: {
          normalAttack: [1, 10],
        },
      })
      expect(materials).toBeDefined()
      expect(materials.length).toBeGreaterThan(0)
    })
  })

  describe('Summary', () => {
    it('should return valid summary object', () => {
      const character = new Character(10000002, 90, true, 6)
      const summary = character.summary

      expect(summary).toBeDefined()
      expect(summary.name).toBeDefined()
      expect(summary.element).toBeDefined()
      expect(summary.weapon).toBeDefined()
      expect(summary.rarity).toBeDefined()
      expect(summary.level).toBe('90/90')
      expect(summary.constellation).toBe('C6')
    })

    it('should show correct level format for non-ascended', () => {
      const character = new Character(10000002, 80, false, 0)
      const summary = character.summary

      // Lv80 non-ascended: unlockMaxLevel(80) - 10 = 70
      expect(summary.level).toBe('80/70')
    })
  })
})
