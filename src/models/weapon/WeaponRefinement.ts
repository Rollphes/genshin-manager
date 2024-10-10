import { Client } from '@/client/Client'
import { OutOfRangeError } from '@/errors/OutOfRangeError'
import { StatProperty } from '@/models/StatProperty'
import { FightPropType } from '@/types'
import { JsonObject } from '@/utils/JsonParser'

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
  /**
   * Weapon skill addProps
   */
  public readonly addProps: StatProperty[]

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

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
        Client._cachedTextMap.get(String(equipAffixJson.nameTextMapHash)) || ''
      this.skillDescription =
        Client._cachedTextMap.get(String(equipAffixJson.descTextMapHash)) || ''
      this.addProps = (equipAffixJson.addProps as JsonObject[])
        .filter((addProp) => addProp.propType !== undefined)
        .map(
          (addProp) =>
            new StatProperty(
              addProp.propType as FightPropType,
              (addProp.value ?? 0) as number,
            ),
        )
    } else {
      this.skillName = undefined
      this.skillDescription = undefined
      this.addProps = []
      if (this.refinementRank > 1)
        throw new OutOfRangeError('refinementRank', this.refinementRank, 1, 1)
    }
  }

  /**
   * Get max refinement rank by weapon ID
   * @param weaponId Weapon ID
   * @returns Max refinement rank
   */
  public static getMaxRefinementRankByWeaponId(weaponId: number): number {
    const weaponJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponExcelConfigData',
      weaponId,
    )
    for (let i = 1; i < 6; i++) {
      const skillAffix = (weaponJson.skillAffix as number[])[0] * 10 + i - 1
      if (
        !Client._hasCachedExcelBinOutputById(
          'EquipAffixExcelConfigData',
          skillAffix,
        )
      )
        return i - 1 || 1
    }
    return 5
  }
}
