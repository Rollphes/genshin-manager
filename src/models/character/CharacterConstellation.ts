import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
/**
 * Class of character's constellation
 */
export class CharacterConstellation {
  /**
   * Constellation ID
   */
  public readonly id: number
  /**
   * Constellation name
   */
  public readonly name: string
  /**
   * Constellation description
   */
  public readonly description: string
  /**
   * Constellation icon
   */
  public readonly icon: ImageAssets
  /**
   * Whether the constellation is locked
   */
  public readonly locked: boolean

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

  /**
   * Create a Constellation
   * @param constellationId Constellation ID
   * @param locked Whether the constellation is locked
   */
  constructor(constellationId: number, locked = false) {
    this.id = constellationId
    this.locked = locked
    const talentJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarTalentExcelConfigData',
      this.id,
    )
    const nameTextMapHash = talentJson.nameTextMapHash as number
    const descTextMapHash = talentJson.descTextMapHash as number
    this.name = Client._cachedTextMap.get(String(nameTextMapHash)) ?? ''
    this.description = Client._cachedTextMap.get(String(descTextMapHash)) ?? ''
    this.icon = new ImageAssets(talentJson.icon as string)
  }

  /**
   * Get all constellation IDs
   * @returns All constellation IDs
   */
  public static get allConstellationIds(): number[] {
    const talentDatas = Object.values(
      Client._getCachedExcelBinOutputByName('AvatarTalentExcelConfigData'),
    )
    return talentDatas.map((data) => data.talentId as number)
  }

  /**
   * Get constellation IDs by character ID
   * @param characterId Character ID
   * @param skillDepotId Skill depot ID
   * @returns Constellation IDs
   */
  public static getConstellationIdsByCharacterId(
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
