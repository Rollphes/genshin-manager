import { Client } from '@/client/Client'
import { OutOfRangeError } from '@/errors/OutOfRangeError'
import { StatProperty } from '@/models/StatProperty'
import { FightPropType } from '@/types'
import { JsonObject } from '@/utils/JsonParser'

/**
 * Class of weapon ascension
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
   * @param weaponId Weapon ID
   * @param promoteLevel Weapon promote level (0-6). Default: 0
   */
  constructor(weaponId: number, promoteLevel: number = 0) {
    this.id = weaponId
    this.promoteLevel = promoteLevel
    const maxPromoteLevel = WeaponAscension.getMaxPromoteLevelByWeaponId(
      this.id,
    )
    if (this.promoteLevel < 0 || this.promoteLevel > maxPromoteLevel) {
      throw new OutOfRangeError(
        'promoteLevel',
        this.promoteLevel,
        0,
        maxPromoteLevel,
      )
    }
    const weaponJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponExcelConfigData',
      this.id,
    )
    const weaponPromoteJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponPromoteExcelConfigData',
      weaponJson.weaponPromoteId as number,
    )[this.promoteLevel] as JsonObject
    this.costItems = (weaponPromoteJson.costItems as JsonObject[])
      .map((costItem) => {
        return {
          id: costItem.id as number,
          count: costItem.count as number,
        }
      })
      .filter(
        (costItem) => costItem.id !== undefined && costItem.count !== undefined,
      )
    this.costMora = (weaponPromoteJson.coinCost as number | undefined) ?? 0
    this.addProps = (weaponPromoteJson.addProps as JsonObject[])
      .filter(
        (addProp) =>
          addProp.propType !== undefined && addProp.value !== undefined,
      )
      .map(
        (addProp) =>
          new StatProperty(
            addProp.propType as FightPropType,
            (addProp.value ?? 0) as number,
          ),
      )
    this.unlockMaxLevel = weaponPromoteJson.unlockMaxLevel as number
  }

  /**
   * Get max promote level by weapon ID
   * @param weaponId Weapon ID
   * @returns Max promote level
   */
  public static getMaxPromoteLevelByWeaponId(weaponId: number): number {
    const weaponJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponExcelConfigData',
      weaponId,
    )
    const weaponPromoteJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponPromoteExcelConfigData',
      weaponJson.weaponPromoteId as number,
    )
    return Math.max(
      ...(Object.values(weaponPromoteJson) as JsonObject[]).map(
        (promote) => (promote.promoteLevel ?? 0) as number,
      ),
    )
  }
}
