import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { StatProperty } from '@/models/StatProperty'
import { WeaponAscension } from '@/models/weapon/WeaponAscension'
import { WeaponRefinement } from '@/models/weapon/WeaponRefinement'
import { refinementLevelSchema } from '@/schemas/commonSchemas'
import { createDynamicWeaponLevelSchema } from '@/schemas/createDynamicWeaponLevelSchema'
import {
  type WeaponProp,
  WeaponType,
} from '@/types/generated/WeaponExcelConfigData'
import { calculatePromoteLevel } from '@/utils/parsers/calculatePromoteLevel'
import { ValidationHelper } from '@/utils/validation/ValidationHelper'

/**
 * Contains weapon information including stats, refinement, and enhancement data
 */
export class WeaponInfo {
  /**
   * Black weapon IDs
   */
  private static readonly blackWeaponIds = [
    10002, 10003, 10004, 10005, 10006, 10008, 11411, 11508, 12304, 12508, 12509,
    13304, 13503, 14306, 14411, 14508, 15306, 20001,
  ]

  /**
   * Weapon name
   */
  public readonly name: string
  /**
   * Weapon description
   */
  public readonly description: string
  /**
   * Weapon type
   */
  public readonly type: WeaponType
  /**
   * Weapon skill name
   */
  public readonly skillName: string | undefined
  /**
   * Weapon skill description
   */
  public readonly skillDescription: string | undefined
  /**
   * Weapon ID
   */
  public readonly id: number
  /**
   * Weapon level
   */
  public readonly level: number
  /**
   * Weapon max level
   */
  public readonly maxLevel: number
  /**
   * Weapon promote level
   */
  public readonly promoteLevel: number
  /**
   * Weapon is ascended
   */
  public readonly isAscended: boolean
  /**
   * Weapon refinement rank
   */
  public readonly refinementRank: number
  /**
   * Weapon rarity
   */
  public readonly rarity: number
  /**
   * Weapon stats
   */
  public readonly stats: StatProperty[]
  /**
   * Whether the weapon is awakened
   */
  public readonly isAwaken: boolean
  /**
   * Weapon icon
   */
  public readonly icon: ImageAssets

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

  /**
   * Create a WeaponInfo
   * @param weaponId weapon ID
   * @param level weapon level (1-90). Default: 1
   * @param isAscended weapon is ascended. Default: true
   * @param refinementRank weapon refinement rank (1-5). Default: 1
   */
  constructor(
    weaponId: number,
    level = 1,
    isAscended = true,
    refinementRank = 1,
  ) {
    this.id = weaponId
    this.level = level

    const maxPromoteLevel =
      WeaponAscension.getMaxPromoteLevelByWeaponId(weaponId)
    const maxAscension = new WeaponAscension(this.id, maxPromoteLevel)
    this.maxLevel = maxAscension.unlockMaxLevel
    const weaponLevelSchema = createDynamicWeaponLevelSchema(this.maxLevel)
    this.level = ValidationHelper.validate(weaponLevelSchema, this.level, {
      propertyKey: 'level',
    })

    this.isAscended = isAscended
    this.refinementRank = refinementRank
    void ValidationHelper.validate(refinementLevelSchema, this.refinementRank, {
      propertyKey: 'refinementRank',
    })

    const weaponJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponExcelConfigData',
      this.id,
    )

    const weaponPromotesJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponPromoteExcelConfigData',
      weaponJson.weaponPromoteId,
    )
    this.promoteLevel = calculatePromoteLevel(
      weaponPromotesJson,
      this.level,
      this.isAscended,
    )

    const ascension = new WeaponAscension(this.id, this.promoteLevel)
    const refinement = new WeaponRefinement(this.id, this.refinementRank)
    this.skillName = refinement.skillName
    this.skillDescription = refinement.skillDescription

    this.name = Client._cachedTextMap.get(weaponJson.nameTextMapHash) ?? ''
    this.description =
      Client._cachedTextMap.get(weaponJson.descTextMapHash) ?? ''
    this.type = weaponJson.weaponType

    this.rarity = weaponJson.rankLevel

    this.stats = weaponJson.weaponProp
      .map((weaponPropJson) => {
        if (!weaponPropJson.initValue) return
        return this.getStatPropertyByJson(
          weaponPropJson,
          ascension.addProps.find(
            (prop) => prop.type === weaponPropJson.propType,
          )?.value ?? 0,
        )
      })
      .filter((stat): stat is StatProperty => stat !== undefined)

    this.isAwaken = this.promoteLevel >= 2
    this.icon = new ImageAssets(
      this.isAwaken ? weaponJson.awakenIcon : weaponJson.icon,
    )
  }

  /**
   * Get all weapon IDs
   * @returns all weapon IDs
   */
  public static get allWeaponIds(): number[] {
    const weaponDatas = Object.values(
      Client._getCachedExcelBinOutputByName('WeaponExcelConfigData'),
    )
    return weaponDatas
      .filter(
        (data): data is NonNullable<typeof data> =>
          data?.id !== undefined &&
          !WeaponInfo.blackWeaponIds.includes(data.id),
      )
      .map((data) => data.id)
  }

  /**
   * Get weapon ID by name
   * @param name weapon name
   * @returns weapon ID
   */
  public static getWeaponIdByName(name: string): number[] {
    return Client._searchIdInExcelBinOutByText(
      'WeaponExcelConfigData',
      name,
    ).map((k) => +k)
  }

  /**
   * Get stat value by json
   * @param weaponPropJson weapon property json
   * @param addValue add value
   * @returns stat value
   */
  private getStatPropertyByJson(
    weaponPropJson: WeaponProp,
    addValue = 0,
  ): StatProperty {
    const curveValue = Client._getJsonFromCachedExcelBinOutput(
      'WeaponCurveExcelConfigData',
      weaponPropJson.type,
    )[this.level]
    const statValue = weaponPropJson.initValue * curveValue + addValue
    return new StatProperty(weaponPropJson.propType, statValue)
  }
}
