import { Client } from '@/client/Client'
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
   * @param constellationId - constellation ID
   * @param locked - whether the constellation is locked
   */
  constructor(constellationId: number, locked = false) {
    this.id = constellationId
    this.locked = locked
    const talentJson = Client._findBy(
      'AvatarTalentExcelConfigData',
      'talentId',
      this.id,
    )
    if (!talentJson) {
      throw new Error(
        `AvatarTalentExcelConfigData not found for talentId ${String(this.id)}`,
      )
    }

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
    const talentDatas = Client._getAll('AvatarTalentExcelConfigData')
    return talentDatas.map((data) => data.talentId)
  }

  /**
   * Get constellation IDs by character ID
   * @param characterId - character ID
   * @param skillDepotId - skill depot ID
   * @returns constellation IDs
   * @throws Error - When the avatar or skill depot data is not found
   */
  public static getConstellationIdsByCharacterId(
    characterId: number,
    skillDepotId?: number,
  ): number[] {
    const avatarJson = Client._findBy(
      'AvatarExcelConfigData',
      'id',
      characterId,
    )
    if (!avatarJson) {
      throw new Error(
        `AvatarExcelConfigData not found for id ${String(characterId)}`,
      )
    }

    const depotId =
      skillDepotId && [10000005, 10000007].includes(characterId)
        ? skillDepotId
        : avatarJson.skillDepotId
    const depotJson = Client._findBy(
      'AvatarSkillDepotExcelConfigData',
      'id',
      depotId,
    )
    if (!depotJson) {
      throw new Error(
        `AvatarSkillDepotExcelConfigData not found for id ${String(depotId)}`,
      )
    }

    return depotJson.talents
  }
}
