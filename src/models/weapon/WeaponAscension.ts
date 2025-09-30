import { Client } from '@/client'
import { StatProperty } from '@/models/StatProperty'
import { createPromoteLevelSchema } from '@/schemas'
import { FightPropType } from '@/types'
import { JsonObject } from '@/types/json'
import { ValidationHelper } from '@/utils/validation'

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
    void ValidationHelper.validate(promoteLevelSchema, this.promoteLevel, {
      propertyKey: 'promoteLevel',
    })
    const weaponJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponExcelConfigData',
      this.id,
    )
    const weaponPromoteJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponPromoteExcelConfigData',
      weaponJson.weaponPromoteId as number,
    )[this.promoteLevel] as JsonObject
    this.costItems = (weaponPromoteJson.costItems as JsonObject[])
      .filter(
        (costItem) => costItem.id !== undefined && costItem.count !== undefined,
      )
      .map((costItem) => {
        return {
          id: costItem.id as number,
          count: costItem.count as number,
        }
      })
    this.costMora = (weaponPromoteJson.coinCost as number | undefined) ?? 0
    this.addProps = (weaponPromoteJson.addProps as JsonObject[])
      .filter(
        (addProp) =>
          addProp.propType !== undefined &&
          addProp.propType !== 'FIGHT_PROP_NONE' &&
          addProp.value !== undefined,
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
      weaponJson.weaponPromoteId as number,
    )
    return Math.max(
      ...(Object.values(weaponPromoteJson) as JsonObject[]).map(
        (promote) => (promote.promoteLevel ?? 0) as number,
      ),
    )
  }
}
