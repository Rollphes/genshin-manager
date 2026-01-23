import { Client } from '@/client/Client'
import { AssetNotFoundError } from '@/errors/assets/AssetNotFoundError'
import { StatProperty } from '@/models/StatProperty'
import { createPromoteLevelSchema } from '@/schemas/createPromoteLevelSchema'
import { FightProp } from '@/types/enums'
import { CostItem } from '@/types/types'
import { toEnum } from '@/utils/typeGuards/toEnum'
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
  public readonly costItems: CostItem[]
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
   * @param weaponId - weapon ID
   * @param promoteLevel - weapon promote level (0-6)
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
    const weaponJson = Client._findBy('WeaponExcelConfigData', 'id', this.id)
    if (!weaponJson)
      throw new AssetNotFoundError(String(this.id), 'WeaponExcelConfigData')

    const weaponPromotesJson = Client._filterBy(
      'WeaponPromoteExcelConfigData',
      'weaponPromoteId',
      weaponJson.weaponPromoteId,
    )
    const weaponPromoteJson = weaponPromotesJson.find(
      (p) => p.promoteLevel === this.promoteLevel,
    )
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
      (addProp, index) =>
        new StatProperty(
          toEnum(FightProp, addProp.propType, 'FightProp', {
            source: 'WeaponPromoteExcelConfigData',
            recordId: `${String(weaponJson.weaponPromoteId)}[${String(this.promoteLevel)}]`,
            path: `addProps[${String(index)}].propType`,
          }),
          addProp.value,
        ),
    )
    this.unlockMaxLevel = weaponPromoteJson.unlockMaxLevel
  }

  /**
   * Get max promote level by weapon ID
   * @param weaponId - weapon ID
   * @returns max promote level
   * @throws {@link AssetNotFoundError} - When the weapon data is not found
   */
  public static getMaxPromoteLevelByWeaponId(weaponId: number): number {
    const weaponJson = Client._findBy('WeaponExcelConfigData', 'id', weaponId)
    if (!weaponJson)
      throw new AssetNotFoundError(String(weaponId), 'WeaponExcelConfigData')

    const weaponPromotesJson = Client._filterBy(
      'WeaponPromoteExcelConfigData',
      'weaponPromoteId',
      weaponJson.weaponPromoteId,
    )
    return Math.max(...weaponPromotesJson.map((p) => p.promoteLevel))
  }
}
