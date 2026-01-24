import { StatProperty } from '@/adapter/output/StatProperty'
import { Client } from '@/application/client/Client'
import {
  fixedRefinementSchema,
  refinementLevelSchema,
} from '@/domain/schemas/commonSchemas'
import { toEnum } from '@/domain/typeGuards/toEnum'
import { FightProp } from '@/domain/types/enums'
import { validate } from '@/domain/validation/validate'
import { AssetNotFoundError } from '@/infrastructure/errors/AssetNotFoundError'

/**
 * Manages weapon refinement levels and passive ability improvements
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
   * @param weaponId - weapon ID
   * @param refinementRank - weapon refinement rank (1-5)
   */
  constructor(weaponId: number, refinementRank = 1) {
    this.id = weaponId
    this.refinementRank = refinementRank
    void validate(refinementLevelSchema, this.refinementRank, {
      propertyKey: 'refinementRank',
    })

    const weaponJson = Client._findBy('WeaponExcelConfigData', 'id', this.id)
    if (!weaponJson)
      throw new AssetNotFoundError(String(this.id), 'WeaponExcelConfigData')

    const skillAffix = weaponJson.skillAffix[0] * 10 + this.refinementRank - 1
    const equipAffixJson = Client._findBy(
      'EquipAffixExcelConfigData',
      'affixId',
      skillAffix,
    )
    if (equipAffixJson) {
      const nameTextMapHash = equipAffixJson.nameTextMapHash
      const descTextMapHash = equipAffixJson.descTextMapHash
      this.skillName = Client._cachedTextMap.get(nameTextMapHash) ?? ''
      this.skillDescription = Client._cachedTextMap.get(descTextMapHash) ?? ''
      const affixContext = {
        source: 'EquipAffixExcelConfigData',
        recordId: skillAffix,
      } as const

      this.addProps = equipAffixJson.addProps
        .map((addProp, index) => {
          return {
            ...addProp,
            propType: toEnum(FightProp, addProp.propType, 'FightProp', {
              ...affixContext,
              path: `addProps[${String(index)}].propType`,
            }),
          }
        })
        .filter((addProp) => addProp.propType !== FightProp.FightPropNone)
        .map(
          (addProp) =>
            new StatProperty(
              toEnum(FightProp, addProp.propType, 'FightProp', {
                ...affixContext,
                path: 'addProps.propType',
              }),
              addProp.value,
            ),
        )
    } else {
      this.skillName = undefined
      this.skillDescription = undefined
      this.addProps = []
      if (this.refinementRank > 1) {
        void validate(fixedRefinementSchema, this.refinementRank, {
          propertyKey: 'refinementRank',
        })
      }
    }
  }

  /**
   * Get max refinement rank by weapon ID
   * @param weaponId - weapon ID
   * @returns max refinement rank
   * @throws {@link AssetNotFoundError} - When the weapon data is not found
   */
  public static getMaxRefinementRankByWeaponId(weaponId: number): number {
    const weaponJson = Client._findBy('WeaponExcelConfigData', 'id', weaponId)
    if (!weaponJson)
      throw new AssetNotFoundError(String(weaponId), 'WeaponExcelConfigData')

    for (let i = 1; i < 6; i++) {
      const skillAffix = weaponJson.skillAffix[0] * 10 + i - 1
      const found = Client._findBy(
        'EquipAffixExcelConfigData',
        'affixId',
        skillAffix,
      )
      if (!found) return i - 1 || 1
    }
    return 5
  }
}
