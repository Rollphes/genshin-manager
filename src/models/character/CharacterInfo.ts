import { Client } from '@/client/Client'
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

  constructor(characterId: number, skillDepotId?: number) {
    this.id = characterId
    const costumeDatas = Object.values(
      Client.cachedExcelBinOutput
        .get('AvatarCostumeExcelConfigData')
        ?.get() as JsonObject,
    ) as JsonObject[]
    const defaultCostumeData = costumeDatas.find(
      (k) => k.avatarId == this.id && !('rarity' in k),
    ) as JsonObject
    this.defaultCostumeId = defaultCostumeData.costumeId as number

    const avatarJson = Client.cachedExcelBinOutputGetter(
      'AvatarExcelConfigData',
      this.id,
    )

    this.depotId =
      skillDepotId ?? [10000005, 10000007].includes(this.id)
        ? this.id == 10000005
          ? 501
          : 701
        : (avatarJson.skillDepotId as number)
    const depotJson = Client.cachedExcelBinOutputGetter(
      'AvatarSkillDepotExcelConfigData',
      this.depotId,
    )

    const skillJson = depotJson.energySkill
      ? Client.cachedExcelBinOutputGetter(
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
      const skillJson = Client.cachedExcelBinOutputGetter(
        'AvatarSkillExcelConfigData',
        skillId,
      )
      const proudId = skillJson.proudSkillGroupId as number | undefined
      if (proudId) this.proudMap.set(skillId, proudId)
    })
  }
  /**
   * Get all character ids
   * @returns All character ids
   */
  public static getAllCharacterIds(): number[] {
    const avatarDatas = Object.values(
      Client.cachedExcelBinOutput
        .get('AvatarExcelConfigData')
        ?.get() as JsonObject,
    ) as JsonObject[]
    return avatarDatas
      .filter((k) => !('rarity' in k))
      .map((k) => k.id as number)
  }
}
