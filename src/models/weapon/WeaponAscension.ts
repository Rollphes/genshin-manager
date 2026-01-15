import { Client } from '@/client/Client'
import { AssetNotFoundError } from '@/errors/assets/AssetNotFoundError'
import { StatProperty } from '@/models/StatProperty'
import { createPromoteLevelSchema } from '@/schemas/createPromoteLevelSchema'
import { validate } from '@/utils/validation/validate'

/**
 * Handles weapon enhancement data including promote levels, costs, and stat boosts
 */
export class WeaponAscension {
  /**
   * Weapon ID
   */
  public readonly id: number
  /**
   * Weapon promote level
   */
  public readonly promoteLevel: number
  /**
   * Weapon ascension costItems
   */
  public readonly costItems: {
    /**
     * Cost item ID(materialIDd)
     */
    id: number
    /**
     * Cost item count
     */
    count: number
  }[]
  /**
   * Weapon ascension costMora
   */
  public readonly costMora: number
  /**
   * Weapon ascension addProps
   */
  public readonly addProps: StatProperty[]
  /**
   * Weapon ascension unlockMaxLevel
   */
  public readonly unlockMaxLevel: number

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

  /**
   * Create a weapon ascension
   * @param weaponId weapon ID
   * @param promoteLevel weapon promote level (0-6). Default: 0
   */
  constructor(weaponId: number, promoteLevel = 0) {
    this.id = weaponId
    this.promoteLevel = promoteLevel
    const maxPromoteLevel = WeaponAscension.getMaxPromoteLevelByWeaponId(
      this.id,
    )
    const promoteLevelSchema = createPromoteLevelSchema(maxPromoteLevel)
    void validate(promoteLevelSchema, this.promoteLevel, {
      propertyKey: 'promoteLevel',
    })
    const weaponJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponExcelConfigData',
      this.id,
    )
    const weaponPromoteJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponPromoteExcelConfigData',
      weaponJson.weaponPromoteId,
    )[this.promoteLevel]
    if (!weaponPromoteJson) {
      throw new AssetNotFoundError(
        `promoteLevel ${String(this.promoteLevel)}`,
        'WeaponPromoteExcelConfigData',
      )
    }
    this.costItems = weaponPromoteJson.costItems.map((costItem) => {
      return {
        id: costItem.id,
        count: costItem.count,
      }
    })
    this.costMora = weaponPromoteJson.coinCost
    this.addProps = weaponPromoteJson.addProps.map(
      (addProp) => new StatProperty(addProp.propType, addProp.value),
    )
    this.unlockMaxLevel = weaponPromoteJson.unlockMaxLevel
  }

  /**
   * Get max promote level by weapon ID
   * @param weaponId weapon ID
   * @returns max promote level
   */
  public static getMaxPromoteLevelByWeaponId(weaponId: number): number {
    const weaponJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponExcelConfigData',
      weaponId,
    )
    const weaponPromoteJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponPromoteExcelConfigData',
      weaponJson.weaponPromoteId,
    )
    return Math.max(
      ...Object.values(weaponPromoteJson).map((promote) =>
        promote ? promote.promoteLevel : 0,
      ),
    )
  }
}
