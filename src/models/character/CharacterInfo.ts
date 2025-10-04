import { Client } from '@/client'
import { AssetNotFoundError } from '@/errors'
import { travelerIdSchema } from '@/schemas'
import { Element, ElementKeys } from '@/types'
import {
  BodyType,
  QualityType,
  WeaponType,
} from '@/types/generated/AvatarExcelConfigData'
import { ValidationHelper } from '@/utils/validation'

/**
 * Contains basic information about a character
 */
export class CharacterInfo {
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
   * @param characterId character ID
   * @param skillDepotId skill depot ID
   */
  constructor(characterId: number, skillDepotId?: number) {
    this.id = characterId
    const costumeDatas = Object.values(
      Client._getCachedExcelBinOutputByName('AvatarCostumeExcelConfigData'),
    )
    const defaultCostumeData = costumeDatas.find(
      (k) => k !== undefined && k.characterId === this.id && k.quality === 0,
    )
    if (!defaultCostumeData) {
      throw new AssetNotFoundError(
        String(this.id),
        'Default costume for character',
      )
    }
    this.defaultCostumeId = defaultCostumeData.skinId

    const avatarJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarExcelConfigData',
      this.id,
    )

    this.depotId =
      skillDepotId && [10000005, 10000007].includes(this.id)
        ? skillDepotId
        : avatarJson.skillDepotId
    const depotJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarSkillDepotExcelConfigData',
      this.depotId,
    )

    const skillJson = depotJson.energySkill
      ? Client._getJsonFromCachedExcelBinOutput(
          'AvatarSkillExcelConfigData',
          depotJson.energySkill,
        )
      : undefined

    const nameTextMapHash = avatarJson.nameTextMapHash
    this.name = Client._cachedTextMap.get(nameTextMapHash) ?? ''

    this.element =
      skillJson && skillJson.costElemType in ElementKeys
        ? ElementKeys[skillJson.costElemType as keyof typeof ElementKeys]
        : undefined

    this.skillOrder = (
      [501, 701].includes(this.depotId)
        ? depotJson.skills.slice(0, 1)
        : depotJson.skills.slice(0, 2).concat(depotJson.energySkill)
    ).filter((skillId): skillId is number => skillId !== 0)
    depotJson.inherentProudSkillOpens.forEach((k) => {
      if (k.proudSkillGroupId === 0) return
      const proudSkillJson = Client._getJsonFromCachedExcelBinOutput(
        'ProudSkillExcelConfigData',
        k.proudSkillGroupId,
      )[1]
      if (!proudSkillJson) return
      if (proudSkillJson.isHideLifeProudSkill) return
      this.inherentSkillOrder.push(k.proudSkillGroupId)
    })

    this.constellationIds = depotJson.talents.filter((constId) => constId !== 0)

    this.skillOrder = this.skillOrder.filter((skillId) => {
      const skillJson = Client._getJsonFromCachedExcelBinOutput(
        'AvatarSkillExcelConfigData',
        skillId,
      )
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
    const avatarDatas = Object.values(
      Client._getCachedExcelBinOutputByName('AvatarExcelConfigData'),
    )
    return avatarDatas
      .filter(
        (k): k is NonNullable<typeof k> => k !== undefined && !('rarity' in k),
      )
      .map((k) => k.id)
  }

  /**
   * Get character ID by name
   * @param name character name
   * @returns character ID
   */
  public static getCharacterIdByName(name: string): number[] {
    return Client._searchIdInExcelBinOutByText(
      'AvatarExcelConfigData',
      name,
    ).map((k) => +k)
  }

  /**
   * Get traveler skill depot IDs
   * @param characterId character ID
   * @returns skill depot IDs
   */
  public static getTravelerSkillDepotIds(characterId: number): number[] {
    if (![10000005, 10000007].includes(characterId)) {
      void ValidationHelper.validate(travelerIdSchema, characterId, {
        propertyKey: 'characterId',
      })
    }

    const avatarData = Client._getJsonFromCachedExcelBinOutput(
      'AvatarExcelConfigData',
      characterId,
    )
    return avatarData.candSkillDepotIds
  }
}
