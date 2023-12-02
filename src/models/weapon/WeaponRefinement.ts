import { Client } from '@/client/Client'

/**
 * Class of weapon refinement.
 */
export class WeaponRefinement {
  /**
   * Weapon id
   */
  public readonly id: number
  /**
   * Weapon refinement rank
   */
  public readonly refinementRank: number
  /**
   * Weapon skill name
   */
  public readonly skillName: string | undefined
  /**
   * Weapon skill description
   */
  public readonly skillDescription: string | undefined

  /**
   * Create a weapon refinement.
   * @param weaponId Weapon id
   * @param refinementRank Weapon refinement rank (1-5). Default: 1.
   */
  constructor(weaponId: number, refinementRank: number = 1) {
    this.id = weaponId
    this.refinementRank = refinementRank
    const weaponJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponExcelConfigData',
      this.id,
    )
    const skillAffix =
      (weaponJson.skillAffix as number[])[0] * 10 + this.refinementRank - 1
    if (skillAffix !== 0) {
      const equipAffixJson = Client._getJsonFromCachedExcelBinOutput(
        'EquipAffixExcelConfigData',
        skillAffix,
      )
      this.skillName =
        Client.cachedTextMap.get(String(equipAffixJson.nameTextMapHash)) || ''
      this.skillDescription =
        Client.cachedTextMap.get(String(equipAffixJson.descTextMapHash)) || ''
    }
  }
}
