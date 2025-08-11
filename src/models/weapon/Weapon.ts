import { Client } from '@/client/Client'
import { OutOfRangeError } from '@/errors/OutOfRangeError'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { StatProperty } from '@/models/StatProperty'
import { WeaponAscension } from '@/models/weapon/WeaponAscension'
import { WeaponRefinement } from '@/models/weapon/WeaponRefinement'
import { FightPropType, WeaponType } from '@/types'
import { calculatePromoteLevel } from '@/utils/calculatePromoteLevel'
import { JsonObject } from '@/utils/JsonParser'

/**
 * Class of weapon
 */
export class Weapon {
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
   * Create a Weapon
   * @param weaponId Weapon ID
   * @param level Weapon level (1-90). Default: 1
   * @param isAscended Weapon is ascended. Default: true
   * @param refinementRank Weapon refinement rank (1-5). Default: 1
   */
  constructor(
    weaponId: number,
    level: number = 1,
    isAscended: boolean = true,
    refinementRank: number = 1,
  ) {
    this.id = weaponId
    this.level = level

    const maxPromoteLevel =
      WeaponAscension.getMaxPromoteLevelByWeaponId(weaponId)
    const maxAscension = new WeaponAscension(this.id, maxPromoteLevel)
    this.maxLevel = maxAscension.unlockMaxLevel
    if (this.level < 1 || this.level > this.maxLevel)
      throw new OutOfRangeError('level', this.level, 1, this.maxLevel)

    this.isAscended = isAscended
    this.refinementRank = refinementRank
    if (this.refinementRank < 1 || this.refinementRank > 5)
      throw new OutOfRangeError('refinementRank', this.refinementRank, 1, 5)

    const weaponJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponExcelConfigData',
      this.id,
    )

    const weaponPromotesJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponPromoteExcelConfigData',
      weaponJson.weaponPromoteId as number,
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

    this.name =
      Client._cachedTextMap.get(String(weaponJson.nameTextMapHash)) ?? ''
    this.description =
      Client._cachedTextMap.get(String(weaponJson.descTextMapHash)) ?? ''
    this.type = weaponJson.weaponType as WeaponType

    this.rarity = weaponJson.rankLevel as number

    const weaponPropJsonArray = weaponJson.weaponProp as JsonObject[]

    this.stats = weaponPropJsonArray
      .map((weaponPropJson) => {
        if (!weaponPropJson.initValue || !weaponPropJson.propType) return
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
      (this.isAwaken ? weaponJson.awakenIcon : weaponJson.icon) as string,
    )
  }

  /**
   * Get all weapon IDs
   * @returns All weapon IDs
   */
  public static get allWeaponIds(): number[] {
    const weaponDatas = Object.values(
      Client._getCachedExcelBinOutputByName('WeaponExcelConfigData'),
    )
    return weaponDatas
      .filter((data) => !Weapon.blackWeaponIds.includes(data.id as number))
      .map((data) => data.id as number)
  }

  /**
   * Get weapon ID by name
   * @param name Weapon name
   * @returns Weapon ID
   */
  public static getWeaponIdByName(name: string): number[] {
    return Client._searchIdInExcelBinOutByText(
      'WeaponExcelConfigData',
      name,
    ).map((k) => +k)
  }

  /**
   * Get stat value by json
   * @param weaponPropJson Weapon property json
   * @param addValue Add value
   * @returns Stat value
   */
  private getStatPropertyByJson(
    weaponPropJson: JsonObject,
    addValue: number = 0,
  ): StatProperty {
    const curveValue = Client._getJsonFromCachedExcelBinOutput(
      'WeaponCurveExcelConfigData',
      weaponPropJson.type as string,
    )[this.level] as number
    const statValue =
      (weaponPropJson.initValue as number) * curveValue + addValue
    return new StatProperty(weaponPropJson.propType as FightPropType, statValue)
  }
}
