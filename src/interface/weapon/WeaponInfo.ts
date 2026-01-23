import { Client } from '@/application/client/Client'
import { calculatePromoteLevel } from '@/domain/parsers/calculatePromoteLevel'
import { refinementLevelSchema } from '@/domain/schemas/commonSchemas'
import { createDynamicWeaponLevelSchema } from '@/domain/schemas/createDynamicWeaponLevelSchema'
import { toEnum } from '@/domain/typeGuards/toEnum'
import { FightProp, GrowCurve, WeaponType } from '@/domain/types/enums'
import { validate } from '@/domain/validation/validate'
import { AssetNotFoundError } from '@/infrastructure/errors/AssetNotFoundError'
import { ImageAssets } from '@/interface/assets/ImageAssets'
import { StatProperty } from '@/interface/StatProperty'
import { WeaponAscension } from '@/interface/weapon/WeaponAscension'
import { WeaponRefinement } from '@/interface/weapon/WeaponRefinement'

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
   * @param weaponId - weapon ID
   * @param level - weapon level (1-90)
   * @param isAscended - weapon is ascended
   * @param refinementRank - weapon refinement rank (1-5)
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
    this.level = validate(weaponLevelSchema, this.level, {
      propertyKey: 'level',
    })

    this.isAscended = isAscended
    this.refinementRank = refinementRank
    void validate(refinementLevelSchema, this.refinementRank, {
      propertyKey: 'refinementRank',
    })

    const weaponJson = Client._findBy('WeaponExcelConfigData', 'id', this.id)
    if (!weaponJson)
      throw new AssetNotFoundError(String(this.id), 'WeaponExcelConfigData')

    const weaponPromotesJson = Client._filterBy(
      'WeaponPromoteExcelConfigData',
      'weaponPromoteId',
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

    const enumContext = {
      source: 'WeaponExcelConfigData',
      recordId: weaponJson.id,
    } as const

    this.stats = weaponJson.weaponProp
      .map((weaponPropJson, index) => {
        if (!weaponPropJson.initValue) return
        return this.getStatPropertyByGrow(
          toEnum(GrowCurve, weaponPropJson.type, 'GrowCurve', {
            ...enumContext,
            path: `weaponProp[${String(index)}].type`,
          }),
          toEnum(FightProp, weaponPropJson.propType, 'FightProp', {
            ...enumContext,
            path: `weaponProp[${String(index)}].propType`,
          }),
          weaponPropJson.initValue,
          ascension.addProps.find(
            (prop) =>
              prop.type ===
              toEnum(FightProp, weaponPropJson.propType, 'FightProp', {
                ...enumContext,
                path: `weaponProp[${String(index)}].propType`,
              }),
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
    const weaponDatas = Client._getAll('WeaponExcelConfigData')
    return weaponDatas
      .filter((data) => !WeaponInfo.blackWeaponIds.includes(data.id))
      .map((data) => data.id)
  }

  /**
   * Get weapon ID by name
   * @param name - weapon name
   * @returns weapon ID
   */
  public static getWeaponIdByName(name: string): number[] {
    return Client._searchByText('WeaponExcelConfigData', name).map((r) => r.id)
  }

  private getStatPropertyByGrow(
    type: GrowCurve,
    propType: FightProp,
    initValue: number,
    addValue = 0,
  ): StatProperty {
    const curveData = Client._filterBy(
      'WeaponCurveExcelConfigData',
      'level',
      this.level,
    ).find((c) =>
      c.curveInfos.some((info) => (info.type as string) === (type as string)),
    )
    const curveInfo = curveData?.curveInfos.find(
      (info) => (info.type as string) === (type as string),
    )
    const curveValue = curveInfo?.value ?? 1
    const statValue = initValue * curveValue + addValue
    return new StatProperty(
      toEnum(FightProp, propType, 'FightProp', { path: 'computedStat' }),
      statValue,
    )
  }
}
