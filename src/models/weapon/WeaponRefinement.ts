import { Client } from '@/client/Client'
import { OutOfRangeError } from '@/errors/OutOfRangeError'

/**
 * Class of weapon refinement
 */
export class WeaponRefinement {
  /**
   * Weapon ID
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
  //TODO:add addProps

  /**
   * Create a weapon refinement
   * @param weaponId Weapon ID
   * @param refinementRank Weapon refinement rank (1-5). Default: 1
   */
  constructor(weaponId: number, refinementRank: number = 1) {
    this.id = weaponId
    this.refinementRank = refinementRank
    if (this.refinementRank < 1 || this.refinementRank > 5)
      throw new OutOfRangeError('refinementRank', this.refinementRank, 1, 5)
    const weaponJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponExcelConfigData',
      this.id,
    )
    const skillAffix =
      (weaponJson.skillAffix as number[])[0] * 10 + this.refinementRank - 1
    if (
      Client._hasCachedExcelBinOutputById(
        'EquipAffixExcelConfigData',
        skillAffix,
      )
    ) {
      const equipAffixJson = Client._getJsonFromCachedExcelBinOutput(
        'EquipAffixExcelConfigData',
        skillAffix,
      )
      this.skillName =
        Client.cachedTextMap.get(String(equipAffixJson.nameTextMapHash)) || ''
      this.skillDescription =
        Client.cachedTextMap.get(String(equipAffixJson.descTextMapHash)) || ''
    } else {
      this.skillName = undefined
      this.skillDescription = undefined
      if (this.refinementRank > 1)
        throw new OutOfRangeError('refinementRank', this.refinementRank, 1, 1)
    }
  }
}
