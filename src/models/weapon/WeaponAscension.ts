import { Client } from '@/client/Client'
import { FightPropType, StatProperty } from '@/models/StatProperty'
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

  /**
   * Create a weapon ascension
   * @param weaponId Weapon ID
   * @param promoteLevel Weapon promote level (0-6). Default: 0
   */
  constructor(weaponId: number, promoteLevel: number = 0) {
    this.id = weaponId
    this.promoteLevel = promoteLevel
    const weaponJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponExcelConfigData',
      this.id,
    )
    const weaponPromoteJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponPromoteExcelConfigData',
      weaponJson.weaponPromoteId as number,
    )[this.promoteLevel] as JsonObject
    this.costItems = (weaponPromoteJson.costItems as JsonObject[]).map(
      (costItem) => {
        return {
          id: costItem.id as number,
          count: costItem.count as number,
        }
      },
    )
    this.costMora = weaponPromoteJson.coinCost as number
    this.addProps = (weaponPromoteJson.addProps as JsonObject[]).map(
      (addProp) =>
        new StatProperty(
          addProp.propType as FightPropType,
          (addProp.value ?? 0) as number,
        ),
    )
    this.unlockMaxLevel = weaponPromoteJson.unlockMaxLevel as number
  }
}
