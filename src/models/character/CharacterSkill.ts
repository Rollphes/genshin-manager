import { Client } from '@/client/Client'
import { AssetNotFoundError } from '@/errors/assets/AssetNotFoundError'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { CharacterInfo } from '@/models/character/CharacterInfo'
import { skillLevelSchema } from '@/schemas/commonSchemas'
import { ValidationHelper } from '@/utils/validation/ValidationHelper'

/**
 * Contains character skill information including attacks, burst, and elemental abilities
 */
export class CharacterSkill {
  /**
   * Skill ID
   */
  public readonly id: number
  /**
   * Skill name
   */
  public readonly name: string
  /**
   * Skill description
   */
  public readonly description: string
  /**
   * Skill icon
   */
  public readonly icon: ImageAssets
  /**
   * level + extraLevel
   */
  public readonly level: number
  /**
   * Levels increased by constellation
   */
  public readonly extraLevel: number
  /**
   * Skill param descriptions
   * @returns (`${description}|${param}`)[]
   */
  public readonly paramDescriptions: string[] = []

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

  /**
   * Create a Skill
   * @param skillId skill ID
   * @param level skill level (1-15). Default: 1
   * @param extraLevel levels increased by constellation (0 or 3). Default: 0
   */
  constructor(skillId: number, level = 1, extraLevel = 0) {
    this.id = skillId
    const skillJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarSkillExcelConfigData',
      this.id,
    )
    const nameTextMapHash = skillJson.nameTextMapHash
    const descTextMapHash = skillJson.descTextMapHash
    this.name = Client._cachedTextMap.get(nameTextMapHash) ?? ''
    this.description = Client._cachedTextMap.get(descTextMapHash) ?? ''
    this.icon = new ImageAssets(skillJson.skillIcon)
    this.extraLevel = extraLevel
    this.level = level + this.extraLevel
    void ValidationHelper.validate(skillLevelSchema, this.level, {
      propertyKey: 'level + extraLevel',
    })

    if (skillJson.proudSkillGroupId === 0) return
    const proudSkillGroupId = skillJson.proudSkillGroupId
    const proudSkillJson = Client._getJsonFromCachedExcelBinOutput(
      'ProudSkillExcelConfigData',
      proudSkillGroupId,
    )[this.level]
    if (!proudSkillJson) {
      throw new AssetNotFoundError(
        `level ${String(this.level)}`,
        'ProudSkillExcelConfigData',
      )
    }
    const params = proudSkillJson.paramList
    proudSkillJson.paramDescList.forEach((paramDescHash) => {
      const paramDesc = (
        Client._cachedTextMap.get(paramDescHash) ?? ''
      ).replace(/|/g, '')
      if (paramDesc === '') return
      this.paramDescriptions.push(
        paramDesc.replace(/\{param.*?\}/g, (paramTag) => {
          const paramId = paramTag.match(/(?<=param).*?(?=:)/g)?.[0]
          const replaceTag = paramTag.match(/(?<=:).*?(?=})/g)?.[0]
          if (paramId === undefined || replaceTag === undefined) return ''
          const fixedIndex = +(replaceTag.match(/(?<=F)./g)?.[0] ?? '0')
          const isInt = replaceTag.includes('I')
          const isPercent = replaceTag.includes('P')
          const paramValue = params[+paramId - 1]

          if (isInt) return String(Math.floor(paramValue))
          if (isPercent) return `${(paramValue * 100).toFixed(fixedIndex)}%`
          return paramValue.toFixed(fixedIndex)
        }),
      )
    })
  }

  /**
   * Get all skill IDs
   * @returns all skill IDs
   */
  public static get allSkillIds(): number[] {
    const characterIds = CharacterInfo.allCharacterIds
    return characterIds.flatMap((characterId) => {
      if ([10000005, 10000007].includes(characterId)) {
        return CharacterInfo.getTravelerSkillDepotIds(characterId).flatMap(
          (skillDepotId) => {
            return new CharacterInfo(characterId, skillDepotId).skillOrder
          },
        )
      }
      return new CharacterInfo(characterId).skillOrder
    })
  }

  /**
   * Get skill order by character ID
   * @param characterId character ID
   * @param skillDepotId skill depot ID
   * @returns skill order
   */
  public static getSkillOrderByCharacterId(
    characterId: number,
    skillDepotId?: number,
  ): number[] {
    const avatarJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarExcelConfigData',
      characterId,
    )
    const depotId =
      skillDepotId && [10000005, 10000007].includes(characterId)
        ? skillDepotId
        : avatarJson.skillDepotId
    const depotJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarSkillDepotExcelConfigData',
      depotId,
    )
    return [501, 701].includes(depotId)
      ? depotJson.skills.slice(0, 1)
      : depotJson.skills.slice(0, 2).concat(depotJson.energySkill)
  }
}
