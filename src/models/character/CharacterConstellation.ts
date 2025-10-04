import { Client } from '@/client'
import { ImageAssets } from '@/models/assets/ImageAssets'
/**
 * Manages character constellation upgrades and unlockable passive abilities
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
   * @param constellationId constellation ID
   * @param locked whether the constellation is locked
   */
  constructor(constellationId: number, locked = false) {
    this.id = constellationId
    this.locked = locked
    const talentJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarTalentExcelConfigData',
      this.id,
    )
    const nameTextMapHash = talentJson.nameTextMapHash
    const descTextMapHash = talentJson.descTextMapHash
    this.name = Client._cachedTextMap.get(nameTextMapHash) ?? ''
    this.description = Client._cachedTextMap.get(descTextMapHash) ?? ''
    this.icon = new ImageAssets(talentJson.icon)
  }

  /**
   * Get all constellation IDs
   * @returns all constellation IDs
   */
  public static get allConstellationIds(): number[] {
    const talentDatas = Object.values(
      Client._getCachedExcelBinOutputByName('AvatarTalentExcelConfigData'),
    )
    return talentDatas
      .filter(
        (data): data is NonNullable<typeof data> =>
          data?.talentId !== undefined,
      )
      .map((data) => data.talentId)
  }

  /**
   * Get constellation IDs by character ID
   * @param characterId character ID
   * @param skillDepotId skill depot ID
   * @returns constellation IDs
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
        : avatarJson.skillDepotId
    const depotJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarSkillDepotExcelConfigData',
      depotId,
    )
    return depotJson.talents
  }
}
