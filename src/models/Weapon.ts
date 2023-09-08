import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { FightPropType, StatProperty } from '@/models/StatProperty'
import { JsonObject } from '@/utils/JsonParser'

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

  constructor(
    weaponId: number,
    level: number = 1,
    promoteLevel: number = 0,
    refinementRank: number = 0,
  ) {
    this.id = weaponId
    this.level = level
    this.promoteLevel = promoteLevel
    this.refinementRank = refinementRank
    const weaponJson = Client.cachedExcelBinOutputGetter(
      'WeaponExcelConfigData',
      this.id,
    )
    const weaponPromoteJson = Client.cachedExcelBinOutputGetter(
      'WeaponPromoteExcelConfigData',
      weaponJson.weaponPromoteId as number,
    )

    const skillAffix =
      (weaponJson.skillAffix as number[])[0] * 10 + this.refinementRank - 1
    if (skillAffix != 0) {
      const equipAffixJson = Client.cachedExcelBinOutputGetter(
        'EquipAffixExcelConfigData',
        skillAffix,
      )
      this.skillName =
        Client.cachedTextMap.get(String(equipAffixJson.nameTextMapHash)) || ''
      this.skillDescription =
        Client.cachedTextMap.get(String(equipAffixJson.descTextMapHash)) || ''
    }

    this.name =
      Client.cachedTextMap.get(String(weaponJson.nameTextMapHash)) || ''
    this.description =
      Client.cachedTextMap.get(String(weaponJson.descTextMapHash)) || ''
    this.WeaponType = weaponJson.weaponType as WeaponType

    this.rarity = weaponJson.rankLevel as number

    const weaponPropJsonArray = weaponJson.weaponProp as JsonObject[]

    const addBaseAtkByPromoteLevel =
      ((weaponPromoteJson.addProps as JsonObject[])[0].value as
        | number
        | undefined) ?? 0

    this.mainStat = this.getStatPropertyByJson(
      weaponPropJsonArray[0],
      addBaseAtkByPromoteLevel,
    )

    if (weaponPropJsonArray[1].propType || weaponPropJsonArray[1].initValue) {
      this.subStat = this.getStatPropertyByJson(weaponPropJsonArray[1])
    }

    this.isAwaken = this.promoteLevel >= 2
    this.icon = new ImageAssets(
      (this.isAwaken ? weaponJson.awakenIcon : weaponJson.icon) as string,
    )
  }
  private getStatPropertyByJson(
    weaponPropJson: JsonObject,
    addValue: number = 0,
  ) {
    const curveValue = Client.cachedExcelBinOutputGetter(
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
      Client.cachedExcelBinOutput
        .get('WeaponExcelConfigData')
        ?.get() as JsonObject,
    ) as JsonObject[]
    return weaponDatas.map((data) => data.id as number)
  }
}

export type WeaponType =
  | 'WEAPON_BOW'
  | 'WEAPON_CATALYST'
  | 'WEAPON_CLAYMORE'
  | 'WEAPON_POLE'
  | 'WEAPON_SWORD_ONE_HAND'
