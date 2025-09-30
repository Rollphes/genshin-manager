import { Client } from '@/client'
import { CharacterAscension } from '@/models/character/CharacterAscension'
import { CharacterBaseStats } from '@/models/character/CharacterBaseStats'
import { CharacterConstellation } from '@/models/character/CharacterConstellation'
import { CharacterCostume } from '@/models/character/CharacterCostume'
import { CharacterInfo } from '@/models/character/CharacterInfo'
import { CharacterInherentSkill } from '@/models/character/CharacterInherentSkill'
import { CharacterProfile } from '@/models/character/CharacterProfile'
import { CharacterSkill } from '@/models/character/CharacterSkill'
import { CharacterSkillAscension } from '@/models/character/CharacterSkillAscension'
import { CharacterStory } from '@/models/character/CharacterStory'
import { CharacterVoice } from '@/models/character/CharacterVoice'
import { StatProperty } from '@/models/StatProperty'
import { BodyType, CharacterUpgradePlan, Element, WeaponType } from '@/types'
import { calculatePromoteLevel } from '@/utils/parsers'

/**
 * Unified character class providing comprehensive access to all character data
 */
export class Character {
  /**
   * Character ID
   */
  public readonly id: number
  /**
   * Character level
   */
  public readonly level: number
  /**
   * Character is ascended
   */
  public readonly isAscended: boolean
  /**
   * Constellation level (0-6)
   */
  public readonly constellationLevel: number
  /**
   * Character info instance
   */
  private readonly info: CharacterInfo
  /**
   * Character base stats instance
   */
  private readonly baseStats: CharacterBaseStats
  /**
   * Character ascension instance
   */
  private readonly ascension: CharacterAscension

  /**
   * Create a Character
   * @param characterId character ID
   * @param level character level (1-90). Default: 1
   * @param isAscended character is ascended (true or false). Default: false
   * @param constellationLevel constellation level (0-6). Default: 0
   * @param skillDepotId skill depot ID (for travelers). Optional
   */
  constructor(
    characterId: number,
    level = 1,
    isAscended = false,
    constellationLevel = 0,
    skillDepotId?: number,
  ) {
    this.id = characterId
    this.level = level
    this.isAscended = isAscended
    this.constellationLevel = constellationLevel
    this.info = new CharacterInfo(characterId, skillDepotId)
    this.baseStats = new CharacterBaseStats(characterId, level, isAscended)
    this.ascension = new CharacterAscension(
      characterId,
      this.baseStats.promoteLevel,
    )
  }

  /**
   * Get all character IDs
   * @returns all character IDs
   */
  public static get allCharacterIds(): number[] {
    return CharacterInfo.allCharacterIds
  }

  /**
   * Character name
   */
  public get name(): string {
    return this.info.name
  }

  /**
   * Character max level
   */
  public get maxLevel(): number {
    return this.info.maxLevel
  }

  /**
   * Element of the character
   */
  public get element(): Element | undefined {
    return this.info.element
  }

  /**
   * Character rarity
   */
  public get rarity(): number {
    return this.info.rarity
  }

  /**
   * Weapon type
   */
  public get weaponType(): WeaponType {
    return this.info.weaponType
  }

  /**
   * Body type
   */
  public get bodyType(): BodyType {
    return this.info.bodyType
  }

  /**
   * Character promote level
   */
  public get promoteLevel(): number {
    return this.baseStats.promoteLevel
  }

  /**
   * Calculated character stats
   */
  public get stats(): StatProperty[] {
    return this.baseStats.stats
  }

  /**
   * Default costume ID
   */
  public get defaultCostumeId(): number {
    return this.info.defaultCostumeId
  }

  /**
   * Skill depot ID
   */
  public get depotId(): number {
    return this.info.depotId
  }

  /**
   * Skill order
   */
  public get skillOrder(): number[] {
    return this.info.skillOrder
  }

  /**
   * Inherent skill order
   */
  public get inherentSkillOrder(): number[] {
    return this.info.inherentSkillOrder
  }

  /**
   * Constellation IDs
   */
  public get constellationIds(): number[] {
    return this.info.constellationIds
  }

  /**
   * Map of skill ID and proud ID
   */
  public get proudMap(): Map<number, number> {
    return this.info.proudMap
  }

  /**
   * Character constellations
   */
  public get constellations(): CharacterConstellation[] {
    return this.constellationIds.map(
      (constId, index) =>
        new CharacterConstellation(constId, index < this.constellationLevel),
    )
  }

  /**
   * Character inherent skills (passive talents)
   */
  public get inherentSkills(): CharacterInherentSkill[] {
    return this.inherentSkillOrder.map(
      (skillId) => new CharacterInherentSkill(skillId),
    )
  }

  /**
   * Character ascension materials
   */
  public get ascensionMaterials(): { id: number; count: number }[] {
    return this.ascension.costItems
  }

  /**
   * Character profile
   */
  public get profile(): CharacterProfile {
    return new CharacterProfile(this.id)
  }

  /**
   * Character stories
   */
  public get stories(): CharacterStory[] {
    return CharacterStory.getAllFetterIdsByCharacterId(this.id).map(
      (fetterId) => new CharacterStory(fetterId),
    )
  }

  /**
   * Character voices
   */
  public get voices(): CharacterVoice[] {
    return CharacterVoice.getAllFetterIdsByCharacterId(this.id).map(
      (fetterId) => new CharacterVoice(fetterId, 'JP'),
    )
  }

  /**
   * Character costumes
   */
  public get costumes(): CharacterCostume[] {
    return CharacterCostume.allCostumeIds
      .map((costumeId) => new CharacterCostume(costumeId))
      .filter((costume) => costume.characterId === this.id)
  }

  /**
   * Check if character can ascend to next level
   * @returns true if character can ascend
   */
  public get isCanAscend(): boolean {
    const maxPromoteLevel = CharacterAscension.getMaxPromoteLevelByCharacterId(
      this.id,
    )
    return this.promoteLevel < maxPromoteLevel
  }

  /**
   * Get character summary information
   * @returns character summary object
   */
  public get summary(): {
    name: string
    element: Element | undefined
    weapon: WeaponType
    rarity: number
    level: string
    constellation: string
  } {
    return {
      name: this.name,
      element: this.element,
      weapon: this.weaponType,
      rarity: this.rarity,
      level: `${String(this.level)}/${String(this.isAscended ? this.ascension.unlockMaxLevel : this.ascension.unlockMaxLevel - 10)}`,
      constellation: `C${String(this.constellationLevel)}`,
    }
  }

  /**
   * Get required materials for next ascension
   * @returns array of materials needed for next ascension
   */
  public get nextAscensionMaterials(): { id: number; count: number }[] {
    if (!this.isCanAscend) return []
    const nextAscension = new CharacterAscension(this.id, this.promoteLevel + 1)
    return nextAscension.costItems
  }

  /**
   * Get total materials needed from current to max level
   * @returns array of total materials needed
   */
  public get totalAscensionMaterials(): { id: number; count: number }[] {
    const maxPromoteLevel = CharacterAscension.getMaxPromoteLevelByCharacterId(
      this.id,
    )
    const materialsMap = new Map<number, number>()

    for (let i = this.promoteLevel + 1; i <= maxPromoteLevel; i++) {
      const ascension = new CharacterAscension(this.id, i)
      for (const item of ascension.costItems) {
        const current = materialsMap.get(item.id) ?? 0
        materialsMap.set(item.id, current + item.count)
      }
    }

    return Array.from(materialsMap.entries()).map(([id, count]) => ({
      id,
      count,
    }))
  }

  /**
   * Get character ID by name
   * @param name character name
   * @returns character ID
   */
  public static getCharacterIdByName(name: string): number[] {
    return CharacterInfo.getCharacterIdByName(name)
  }

  /**
   * Get traveler skill depot IDs
   * @param characterId character ID
   * @returns skill depot IDs
   */
  public static getTravelerSkillDepotIds(characterId: number): number[] {
    return CharacterInfo.getTravelerSkillDepotIds(characterId)
  }

  /**
   * Get normal attack skill
   * @param skillLevel skill level (1-15). Default: 1
   * @returns normal attack skill
   */
  public getNormalAttack(skillLevel = 1): CharacterSkill {
    return this.getSkill(0, skillLevel)
  }

  /**
   * Get elemental skill
   * @param skillLevel skill level (1-15). Default: 1
   * @returns elemental skill
   */
  public getElementalSkill(skillLevel = 1): CharacterSkill {
    return this.getSkill(1, skillLevel)
  }

  /**
   * Get elemental burst
   * @param skillLevel skill level (1-15). Default: 1
   * @returns elemental burst
   */
  public getElementalBurst(skillLevel = 1): CharacterSkill {
    return this.getSkill(2, skillLevel)
  }

  /**
   * Get normal attack upgrade materials for a specific level
   * @param skillLevel skill level (1-15)
   * @returns array of materials needed
   */
  public getNormalAttackMaterials(
    skillLevel: number,
  ): { id: number; count: number }[] {
    return this.getSkillMaterials(0, skillLevel)
  }

  /**
   * Get elemental skill upgrade materials for a specific level
   * @param skillLevel skill level (1-15)
   * @returns array of materials needed
   */
  public getElementalSkillMaterials(
    skillLevel: number,
  ): { id: number; count: number }[] {
    return this.getSkillMaterials(1, skillLevel)
  }

  /**
   * Get elemental burst upgrade materials for a specific level
   * @param skillLevel skill level (1-15)
   * @returns array of materials needed
   */
  public getElementalBurstMaterials(
    skillLevel: number,
  ): { id: number; count: number }[] {
    return this.getSkillMaterials(2, skillLevel)
  }

  /**
   * Calculate total materials needed for character upgrade plan
   * @param plan character upgrade plan specifying level and skill changes
   * @returns array of total materials needed
   */
  public calculateUpgradeMaterials(
    plan: CharacterUpgradePlan,
  ): { id: number; count: number }[] {
    const materialsMap = new Map<number, number>()

    if (plan.characterLevel) {
      const [currentLevel, targetLevel] = plan.characterLevel
      const characterMaterials = this.calculateCharacterLevelMaterials(
        currentLevel,
        targetLevel,
      )
      for (const item of characterMaterials) {
        const current = materialsMap.get(item.id) ?? 0
        materialsMap.set(item.id, current + item.count)
      }
    }

    if (plan.skillLevels) {
      if (plan.skillLevels.normalAttack) {
        const [current, target] = plan.skillLevels.normalAttack
        const skillMaterials = this.calculateSkillLevelMaterials(
          0,
          current,
          target,
        )
        for (const item of skillMaterials) {
          const currentCount = materialsMap.get(item.id) ?? 0
          materialsMap.set(item.id, currentCount + item.count)
        }
      }

      if (plan.skillLevels.elementalSkill) {
        const [current, target] = plan.skillLevels.elementalSkill
        const skillMaterials = this.calculateSkillLevelMaterials(
          1,
          current,
          target,
        )
        for (const item of skillMaterials) {
          const currentCount = materialsMap.get(item.id) ?? 0
          materialsMap.set(item.id, currentCount + item.count)
        }
      }

      if (plan.skillLevels.elementalBurst) {
        const [current, target] = plan.skillLevels.elementalBurst
        const skillMaterials = this.calculateSkillLevelMaterials(
          2,
          current,
          target,
        )
        for (const item of skillMaterials) {
          const currentCount = materialsMap.get(item.id) ?? 0
          materialsMap.set(item.id, currentCount + item.count)
        }
      }
    }

    return Array.from(materialsMap.entries()).map(([id, count]) => ({
      id,
      count,
    }))
  }

  /**
   * Get a specific skill by index
   * @param skillIndex skill index (0: Normal Attack, 1: Elemental Skill, 2: Elemental Burst)
   * @param skillLevel skill level (1-15). Default: 1
   * @returns character skill
   */
  private getSkill(skillIndex: number, skillLevel = 1): CharacterSkill {
    const skillId = this.skillOrder[skillIndex]
    if (!skillId)
      throw new Error(`Skill at index ${String(skillIndex)} not found`)

    return new CharacterSkill(skillId, skillLevel, this.constellationLevel)
  }

  /**
   * Get talent materials for a specific skill
   * @param skillIndex skill index (0: Normal Attack, 1: Elemental Skill, 2: Elemental Burst)
   * @param skillLevel skill level (1-15)
   * @returns array of materials needed
   */
  private getSkillMaterials(
    skillIndex: number,
    skillLevel: number,
  ): { id: number; count: number }[] {
    const skillId = this.skillOrder[skillIndex]
    if (!skillId) return []
    const proudId = this.proudMap.get(skillId)
    if (!proudId) return []
    const skillAscension = new CharacterSkillAscension(proudId, skillLevel)
    return skillAscension.costItems
  }

  /**
   * Calculate character level upgrade materials
   * @param currentLevel current character level
   * @param targetLevel target character level
   * @returns array of materials needed
   */
  private calculateCharacterLevelMaterials(
    currentLevel: number,
    targetLevel: number,
  ): { id: number; count: number }[] {
    const materialsMap = new Map<number, number>()

    const avatarJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarExcelConfigData',
      this.id,
    )
    const avatarPromotesJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarPromoteExcelConfigData',
      avatarJson.avatarPromoteId as number,
    )

    const currentPromoteLevel = calculatePromoteLevel(
      avatarPromotesJson,
      currentLevel,
      false,
    )
    const targetPromoteLevel = calculatePromoteLevel(
      avatarPromotesJson,
      targetLevel,
      false,
    )

    for (
      let promoteLevel = currentPromoteLevel + 1;
      promoteLevel <= targetPromoteLevel;
      promoteLevel++
    ) {
      const ascension = new CharacterAscension(this.id, promoteLevel)
      for (const item of ascension.costItems) {
        const current = materialsMap.get(item.id) ?? 0
        materialsMap.set(item.id, current + item.count)
      }
    }

    return Array.from(materialsMap.entries()).map(([id, count]) => ({
      id,
      count,
    }))
  }

  /**
   * Calculate skill level upgrade materials
   * @param skillIndex skill index
   * @param currentLevel current skill level
   * @param targetLevel target skill level
   * @returns array of materials needed
   */
  private calculateSkillLevelMaterials(
    skillIndex: number,
    currentLevel: number,
    targetLevel: number,
  ): { id: number; count: number }[] {
    const materialsMap = new Map<number, number>()
    const skillId = this.skillOrder[skillIndex]
    if (!skillId) return []

    const proudId = this.proudMap.get(skillId)
    if (!proudId) return []

    for (let level = currentLevel + 1; level <= targetLevel; level++) {
      const skillAscension = new CharacterSkillAscension(proudId, level)
      for (const item of skillAscension.costItems) {
        const current = materialsMap.get(item.id) ?? 0
        materialsMap.set(item.id, current + item.count)
      }
    }

    return Array.from(materialsMap.entries()).map(([id, count]) => ({
      id,
      count,
    }))
  }
}
