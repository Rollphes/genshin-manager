import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'

/**
 * Class of character's talent.
 */
export class Talent {
  /**
   * Talent id
   */
  public readonly id: number
  /**
   * Talent name
   */
  public readonly name: string
  /**
   * Talent description
   */
  public readonly description: string
  /**
   * Talent icon
   */
  public readonly icon: ImageAssets
  /**
   * Whether the talent is locked
   */
  public readonly locked: boolean

  /**
   * Create a Talent
   * @param talentId Talent id
   * @param locked Whether the talent is locked
   */
  constructor(talentId: number, locked: boolean = false) {
    this.id = talentId
    this.locked = locked
    const talentJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarTalentExcelConfigData',
      this.id,
    )
    this.name =
      Client.cachedTextMap.get(String(talentJson.nameTextMapHash)) || ''
    this.description =
      Client.cachedTextMap.get(String(talentJson.descTextMapHash)) || ''
    this.icon = new ImageAssets(talentJson.icon as string)
  }
  /**
   * Get all talent ids
   * @returns All talent ids
   */
  public static getAllTalentIds(): number[] {
    const talentDatas = Object.values(
      Client._getCachedExcelBinOutputByName('AvatarTalentExcelConfigData'),
    )
    return talentDatas.map((data) => data.talentId as number)
  }

  /**
   * Get talent ids by character id
   * @param characterId Character id
   * @param skillDepotId Skill depot id
   * @returns Talent ids
   */
  public static getTalentIdsByCharacterId(
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
        : (avatarJson.skillDepotId as number)
    const depotJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarSkillDepotExcelConfigData',
      depotId,
    )
    return depotJson.talents as number[]
  }
}
