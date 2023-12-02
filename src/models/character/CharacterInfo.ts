import { Client } from '@/client/Client'
import { WeaponType } from '@/models/weapon/Weapon'
import { ElementKeys, ValueOf } from '@/types'
import { JsonObject } from '@/utils/JsonParser'
/**
 * Class that summarizes IDs and other information related to the character.
 */
export class CharacterInfo {
  /**
   * Character id
   */
  public readonly id: number
  /**
   * Default costume id
   */
  public readonly defaultCostumeId: number
  /**
   * Character name
   */
  public readonly name: string
  /**
   * Skill depot id
   */
  public readonly depotId: number
  /**
   * Element of the character
   */
  public readonly element: ValueOf<typeof ElementKeys> | undefined
  /**
   * Skill order
   */
  public readonly skillOrder: number[]
  /**
   * Sub skills
   */
  public readonly subSkills: number[]
  /**
   * Talent ids
   */
  public readonly talentIds: number[]
  /**
   * Map of skill id and proud id
   */
  public readonly proudMap: Map<number, number> = new Map()
  /**
   * Rarity.
   * aloy is treated as 0 because it is special
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

  /**
   * Create a CharacterInfo
   * @param characterId Character id
   * @param skillDepotId Skill depot id
   */
  constructor(characterId: number, skillDepotId?: number) {
    this.id = characterId
    const costumeDatas = Object.values(
      Client._getCachedExcelBinOutputByName('AvatarCostumeExcelConfigData'),
    )
    const defaultCostumeData = costumeDatas.find(
      (k) => k.characterId === this.id && !('quality' in k),
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
      Client.cachedTextMap.get(String(avatarJson.nameTextMapHash)) || ''

    this.element = skillJson
      ? ElementKeys[skillJson.costElemType as keyof typeof ElementKeys]
      : undefined

    this.skillOrder = [501, 701].includes(this.depotId)
      ? (depotJson.skills as number[]).slice(0, 1)
      : (depotJson.skills as number[])
          .slice(0, 2)
          .concat(depotJson.energySkill as number)
    const runSkillId = (depotJson.subSkills as number[])[3]
    this.subSkills =
      runSkillId ?? null
        ? [runSkillId].concat(depotJson.subSkills as number[])
        : (depotJson.subSkills as number[])

    this.talentIds = depotJson.talents as number[]

    this.skillOrder.forEach((skillId) => {
      const skillJson = Client._getJsonFromCachedExcelBinOutput(
        'AvatarSkillExcelConfigData',
        skillId,
      )
      const proudId = skillJson.proudSkillGroupId as number | undefined
      if (proudId) this.proudMap.set(skillId, proudId)
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
   * Get all character ids
   * @returns All character ids
   */
  public static getAllCharacterIds(): number[] {
    const avatarDatas = Object.values(
      Client._getCachedExcelBinOutputByName('AvatarExcelConfigData'),
    )
    return avatarDatas
      .filter((k) => !('rarity' in k))
      .map((k) => k.id as number)
  }

  /**
   * Get character id by name
   * @param name Character name
   * @returns Character id
   */
  public static getCharacterIdByName(name: string): number[] {
    const hashes = Client._searchHashInCachedTextMapByValue(name)
    return Client._searchKeyInExcelBinOutputByTextHashes(
      'AvatarExcelConfigData',
      hashes,
    ).map((k) => +k)
  }
}

type QualityType = 'QUALITY_ORANGE' | 'QUALITY_PURPLE' | 'QUALITY_ORANGE_SP'

/**
 * Body type
 */
export type BodyType =
  | 'BODY_BOY'
  | 'BODY_GIRL'
  | 'BODY_LADY'
  | 'BODY_LOLI'
  | 'BODY_MALE'
