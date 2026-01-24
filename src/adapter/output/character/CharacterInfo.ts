import { AssetNotFoundError } from '@/adapter/input/errors/AssetNotFoundError'
import { Client } from '@/application/client/Client'
import { travelerIdSchema } from '@/domain/schemas/commonSchemas'
import type { BodyType, QualityType, WeaponType } from '@/domain/types/enums'
import { CostElemType } from '@/domain/types/enums'
import { Element } from '@/domain/types/types'
import { validate } from '@/domain/validation/validate'

/**
 * Contains basic information about a character
 */
export class CharacterInfo {
  private static elementMap: Record<CostElemType, Element | undefined> = {
    [CostElemType.None]: undefined,
    [CostElemType.Fire]: Element.Pyro,
    [CostElemType.Electric]: Element.Electro,
    [CostElemType.Ice]: Element.Cryo,
    [CostElemType.Wind]: Element.Anemo,
    [CostElemType.Water]: Element.Hydro,
    [CostElemType.Rock]: Element.Geo,
    [CostElemType.Grass]: Element.Dendro,
  }

  /**
   * Character ID
   */
  public readonly id: number
  /**
   * Default costume ID
   */
  public readonly defaultCostumeId: number
  /**
   * Character name
   */
  public readonly name: string
  /**
   * Character max level
   */
  public readonly maxLevel: number = 90
  /**
   * Skill depot ID
   */
  public readonly depotId: number
  /**
   * Element of the character
   */
  public readonly element: Element | undefined
  /**
   * Skill order
   */
  public readonly skillOrder: number[]
  /**
   * Inherent skill order
   */
  public readonly inherentSkillOrder: number[] = []
  /**
   * Constellation IDs
   */
  public readonly constellationIds: number[]
  /**
   * Map of skill ID and proud ID
   * @key Skill ID
   * @value Proud ID
   */
  public readonly proudMap = new Map<number, number>()
  /**
   * Character rarity (1-5 stars)
   * @warning Aloy has rarity 0 due to her special collaboration character status
   */
  public readonly rarity: number
  /**
   * Weapon type
   */
  public readonly weaponType: WeaponType
  /**
   * Body type
   */
  public readonly bodyType: BodyType

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

  /**
   * Create a CharacterInfo
   * @param characterId - character ID
   * @param skillDepotId - skill depot ID
   */
  constructor(characterId: number, skillDepotId?: number) {
    this.id = characterId
    const costumeDatas = Client._getAll('AvatarCostumeExcelConfigData')
    const defaultCostumeData = costumeDatas.find(
      (k) => k.characterId === this.id && k.quality === 0,
    )
    if (!defaultCostumeData) {
      throw new AssetNotFoundError(
        String(this.id),
        'Default costume for character',
      )
    }
    this.defaultCostumeId = defaultCostumeData.skinId

    const avatarJson = Client._findBy('AvatarExcelConfigData', 'id', this.id)
    if (!avatarJson) {
      throw new Error(
        `AvatarExcelConfigData not found for id ${String(this.id)}`,
      )
    }

    this.depotId =
      skillDepotId && [10000005, 10000007].includes(this.id)
        ? skillDepotId
        : avatarJson.skillDepotId
    const depotJson = Client._findBy(
      'AvatarSkillDepotExcelConfigData',
      'id',
      this.depotId,
    )
    if (!depotJson) {
      throw new Error(
        `AvatarSkillDepotExcelConfigData not found for id ${String(this.depotId)}`,
      )
    }

    const skillJson = depotJson.energySkill
      ? Client._findBy(
          'AvatarSkillExcelConfigData',
          'id',
          depotJson.energySkill,
        )
      : undefined

    const nameTextMapHash = avatarJson.nameTextMapHash
    this.name = Client._cachedTextMap.get(nameTextMapHash) ?? ''

    this.element =
      skillJson && skillJson.costElemType in CharacterInfo.elementMap
        ? CharacterInfo.elementMap[skillJson.costElemType]
        : undefined

    this.skillOrder = (
      [501, 701].includes(this.depotId)
        ? depotJson.skills.slice(0, 1)
        : depotJson.skills.slice(0, 2).concat(depotJson.energySkill)
    ).filter((skillId): skillId is number => skillId !== 0)
    depotJson.inherentProudSkillOpens.forEach((k) => {
      if (k.proudSkillGroupId === 0) return
      const proudSkillJson = Client._filterBy(
        'ProudSkillExcelConfigData',
        'proudSkillGroupId',
        k.proudSkillGroupId,
      ).find((p) => p.level === 1)
      if (!proudSkillJson) return
      if (proudSkillJson.isHideLifeProudSkill) return
      this.inherentSkillOrder.push(k.proudSkillGroupId)
    })

    this.constellationIds = depotJson.talents.filter((constId) => constId !== 0)

    this.skillOrder = this.skillOrder.filter((skillId) => {
      const skillJson = Client._findBy(
        'AvatarSkillExcelConfigData',
        'id',
        skillId,
      )
      if (!skillJson) return false
      const proudId = skillJson.proudSkillGroupId
      if (proudId) this.proudMap.set(skillId, proudId)
      return Boolean(proudId)
    })

    const qualityMap: Record<QualityType, number> = {
      QUALITY_ORANGE: 5,
      QUALITY_PURPLE: 4,
      QUALITY_ORANGE_SP: 0,
    }
    this.rarity = qualityMap[avatarJson.qualityType]
    this.weaponType = avatarJson.weaponType
    this.bodyType = avatarJson.bodyType
  }

  /**
   * Get all character IDs
   * @returns all character IDs
   */
  public static get allCharacterIds(): number[] {
    const avatarDatas = Client._getAll('AvatarExcelConfigData')
    return avatarDatas
      .filter((k) => k.id <= 11000000 && k.id !== 10000001)
      .map((k) => k.id)
  }

  /**
   * Get character ID by name
   * @param name - character name
   * @returns character ID
   */
  public static getCharacterIdByName(name: string): number[] {
    return Client._searchByText('AvatarExcelConfigData', name).map((r) => r.id)
  }

  /**
   * Get traveler skill depot IDs
   * @param characterId - character ID
   * @returns skill depot IDs
   * @throws Error - When the avatar data is not found
   */
  public static getTravelerSkillDepotIds(characterId: number): number[] {
    if (![10000005, 10000007].includes(characterId)) {
      void validate(travelerIdSchema, characterId, {
        propertyKey: 'characterId',
      })
    }

    const avatarData = Client._findBy(
      'AvatarExcelConfigData',
      'id',
      characterId,
    )
    if (!avatarData) {
      throw new Error(
        `AvatarExcelConfigData not found for id ${String(characterId)}`,
      )
    }

    return avatarData.candSkillDepotIds
  }
}
