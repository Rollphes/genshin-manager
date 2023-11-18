import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { FightPropType, StatProperty } from '@/models/StatProperty'
import { WeaponAscension } from '@/models/weapon/WeaponAscension'
import { WeaponRefinement } from '@/models/weapon/WeaponRefinement'
import { JsonObject } from '@/utils/JsonParser'

/**
 * Class of weapon.
 */
export class Weapon {
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
  public readonly WeaponType: WeaponType
  /**
   * Weapon skill name
   */
  public readonly skillName: string | undefined
  /**
   * Weapon skill description
   */
  public readonly skillDescription: string | undefined
  /**
   * Weapon id
   */
  public readonly id: number
  /**
   * Weapon level
   */
  public readonly level: number
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
   * Weapon main stat
   */
  public readonly mainStat: StatProperty
  /**
   * Weapon sub stat
   */
  public readonly subStat: StatProperty | undefined
  /**
   * Whether the weapon is awakened
   */
  public readonly isAwaken: boolean
  /**
   * Weapon icon
   */
  public readonly icon: ImageAssets

  /**
   * Create a Weapon
   * @param weaponId Weapon id
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
    this.isAscended = isAscended
    this.refinementRank = refinementRank
    const weaponJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponExcelConfigData',
      this.id,
    )

    const weaponPromotesJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponPromoteExcelConfigData',
      weaponJson.weaponPromoteId as number,
    )
    const beforePromoteLevelByLevel = Math.max(
      ...(Object.values(weaponPromotesJson) as JsonObject[])
        .filter((promote) => (promote.unlockMaxLevel as number) < this.level)
        .map((promote) => ((promote.promoteLevel ?? 0) as number) + 1),
      0,
    )
    const afterPromoteLevelByLevel = Math.max(
      ...(Object.values(weaponPromotesJson) as JsonObject[])
        .filter((promote) => (promote.unlockMaxLevel as number) <= this.level)
        .map((promote) => ((promote.promoteLevel ?? 0) as number) + 1),
      0,
    )
    this.promoteLevel = isAscended
      ? afterPromoteLevelByLevel
      : beforePromoteLevelByLevel

    const ascension = new WeaponAscension(this.id, this.promoteLevel)

    const refinement = new WeaponRefinement(this.id, this.refinementRank)
    this.skillName = refinement.skillName
    this.skillDescription = refinement.skillDescription

    this.name =
      Client.cachedTextMap.get(String(weaponJson.nameTextMapHash)) || ''
    this.description =
      Client.cachedTextMap.get(String(weaponJson.descTextMapHash)) || ''
    this.WeaponType = weaponJson.weaponType as WeaponType

    this.rarity = weaponJson.rankLevel as number

    const weaponPropJsonArray = weaponJson.weaponProp as JsonObject[]

    const props = weaponPropJsonArray.map((weaponPropJson) => {
      if (!weaponPropJson.initValue || !weaponPropJson.propType) return
      return this.getStatPropertyByJson(
        weaponPropJson,
        ascension.addProps.find((prop) => prop.type === weaponPropJson.propType)
          ?.value ?? 0,
      )
    })
    this.mainStat = props[0] as StatProperty
    this.subStat = props[1]

    this.isAwaken = this.promoteLevel >= 2
    this.icon = new ImageAssets(
      (this.isAwaken ? weaponJson.awakenIcon : weaponJson.icon) as string,
    )
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
  ) {
    const curveValue = Client._getJsonFromCachedExcelBinOutput(
      'WeaponCurveExcelConfigData',
      weaponPropJson.type as string,
    )[this.level] as number
    const statValue =
      (weaponPropJson.initValue as number) * curveValue + addValue
    return new StatProperty(weaponPropJson.propType as FightPropType, statValue)
  }
  /**
   * Get all weapon ids
   * @returns All weapon ids
   */
  public static getAllWeaponIds(): number[] {
    const weaponDatas = Object.values(
      Client._getCachedExcelBinOutputByName('WeaponExcelConfigData'),
    )
    return weaponDatas.map((data) => data.id as number)
  }
}

export type WeaponType =
  | 'WEAPON_BOW'
  | 'WEAPON_CATALYST'
  | 'WEAPON_CLAYMORE'
  | 'WEAPON_POLE'
  | 'WEAPON_SWORD_ONE_HAND'
