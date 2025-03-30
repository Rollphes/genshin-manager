import { Client } from '@/client/Client'
import { OutOfRangeError } from '@/errors/OutOfRangeError'
import {
  BodyType,
  Element,
  ElementKeys,
  QualityType,
  WeaponType,
} from '@/types'
import { JsonObject } from '@/utils/JsonParser'

/**
 * Class of information about the character.
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
  public readonly proudMap: Map<number, number> = new Map()
  /**
   * Rarity
   * @warn aloy is treated as 0 because it is special
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
   * @param characterId Character ID
   * @param skillDepotId Skill depot ID
   */
  constructor(characterId: number, skillDepotId?: number) {
    this.id = characterId
    const costumeDatas = Object.values(
      Client._getCachedExcelBinOutputByName('AvatarCostumeExcelConfigData'),
    )
    const defaultCostumeData = costumeDatas.find(
      (k) => k.characterId === this.id && k.quality === 0,
    ) as JsonObject
    this.defaultCostumeId = defaultCostumeData.skinId as number

    const avatarJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarExcelConfigData',
      this.id,
    )

    this.depotId =
      skillDepotId && [10000005, 10000007].includes(this.id)
        ? skillDepotId
        : (avatarJson.skillDepotId as number)
    const depotJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarSkillDepotExcelConfigData',
      this.depotId,
    )

    const skillJson = depotJson.energySkill
      ? Client._getJsonFromCachedExcelBinOutput(
          'AvatarSkillExcelConfigData',
          depotJson.energySkill as number,
        )
      : undefined

    this.name =
      Client._cachedTextMap.get(String(avatarJson.nameTextMapHash)) || ''

    this.element = skillJson
      ? ElementKeys[skillJson.costElemType as keyof typeof ElementKeys]
      : undefined

    this.skillOrder = (
      [501, 701].includes(this.depotId)
        ? (depotJson.skills as number[]).slice(0, 1)
        : (depotJson.skills as (number | undefined)[])
            .slice(0, 2)
            .concat(depotJson.energySkill as number | undefined)
    ).filter(
      (skillId): skillId is number => skillId !== 0 && skillId !== undefined,
    )
    ;(depotJson.inherentProudSkillOpens as JsonObject[]).forEach((k) => {
      if (k.proudSkillGroupId === undefined || k.proudSkillGroupId === 0) return
      const proudSkillJson = Client._getJsonFromCachedExcelBinOutput(
        'ProudSkillExcelConfigData',
        k.proudSkillGroupId as number,
      )[1] as JsonObject
      if (!proudSkillJson) return
      if (proudSkillJson.isHideLifeProudSkill) return
      this.inherentSkillOrder.push(k.proudSkillGroupId as number)
    })

    this.constellationIds = (depotJson.talents as number[]).filter(
      (constId) => constId !== 0,
    )

    this.skillOrder = this.skillOrder.filter((skillId) => {
      const skillJson = Client._getJsonFromCachedExcelBinOutput(
        'AvatarSkillExcelConfigData',
        skillId,
      )
      const proudId = skillJson.proudSkillGroupId as number | undefined
      if (proudId) this.proudMap.set(skillId, proudId)
      return proudId !== undefined
    })

    const qualityMap: { [key in QualityType]: number } = {
      QUALITY_ORANGE: 5,
      QUALITY_PURPLE: 4,
      QUALITY_ORANGE_SP: 0,
    }
    this.rarity = qualityMap[avatarJson.qualityType as QualityType]
    this.weaponType = avatarJson.weaponType as WeaponType
    this.bodyType = avatarJson.bodyType as BodyType
  }

  /**
   * Get all character IDs
   * @returns All character IDs
   */
  public static get allCharacterIds(): number[] {
    const avatarDatas = Object.values(
      Client._getCachedExcelBinOutputByName('AvatarExcelConfigData'),
    )
    return avatarDatas
      .filter((k) => !('rarity' in k))
      .map((k) => k.id as number)
  }

  /**
   * Get character ID by name
   * @param name Character name
   * @returns Character ID
   */
  public static getCharacterIdByName(name: string): number[] {
    return Client._searchIdInExcelBinOutByText(
      'AvatarExcelConfigData',
      name,
    ).map((k) => +k)
  }

  /**
   * Get traveler skill depot IDs
   * @param characterId Character ID
   * @returns skill depot IDs
   */
  public static getTravelerSkillDepotIds(characterId: number): number[] {
    if (![10000005, 10000007].includes(characterId))
      throw new OutOfRangeError('characterId', characterId, 10000005, 10000007)

    const avatarData = Client._getJsonFromCachedExcelBinOutput(
      'AvatarExcelConfigData',
      characterId,
    )
    return avatarData.candSkillDepotIds as number[]
  }
}
