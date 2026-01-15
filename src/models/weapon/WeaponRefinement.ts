import { Client } from '@/client/Client'
import { StatProperty } from '@/models/StatProperty'
import {
  fixedRefinementSchema,
  refinementLevelSchema,
} from '@/schemas/commonSchemas'
import { PropType } from '@/types/generated/EquipAffixExcelConfigData'
import { toFightPropType } from '@/utils/typeGuards/toFightPropType'
import { validate } from '@/utils/validation/validate'

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
   * @param weaponId weapon ID
   * @param refinementRank weapon refinement rank (1-5). Default: 1
   */
  constructor(weaponId: number, refinementRank = 1) {
    this.id = weaponId
    this.refinementRank = refinementRank
    void validate(refinementLevelSchema, this.refinementRank, {
      propertyKey: 'refinementRank',
    })

    const weaponJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponExcelConfigData',
      this.id,
    )
    const skillAffix = weaponJson.skillAffix[0] * 10 + this.refinementRank - 1
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
      const nameTextMapHash = equipAffixJson.nameTextMapHash
      const descTextMapHash = equipAffixJson.descTextMapHash
      this.skillName = Client._cachedTextMap.get(nameTextMapHash) ?? ''
      this.skillDescription = Client._cachedTextMap.get(descTextMapHash) ?? ''
      this.addProps = equipAffixJson.addProps
        .filter((addProp) => addProp.propType !== PropType.FightPropNone)
        .map(
          (addProp) =>
            new StatProperty(
              toFightPropType(addProp.propType, 'WeaponRefinement'),
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
   * @param weaponId weapon ID
   * @returns max refinement rank
   */
  public static getMaxRefinementRankByWeaponId(weaponId: number): number {
    const weaponJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponExcelConfigData',
      weaponId,
    )
    for (let i = 1; i < 6; i++) {
      const skillAffix = weaponJson.skillAffix[0] * 10 + i - 1
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
