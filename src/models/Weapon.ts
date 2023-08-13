import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { FightPropType, StatProperty } from '@/models/StatProperty'
import { JsonObject } from '@/utils/JsonParser'

export class Weapon {
  public readonly name: string
  public readonly description: string
  public readonly WeaponType: WeaponType
  public readonly skillName: string | undefined
  public readonly skillDescription: string | undefined
  public readonly id: number
  public readonly level: number
  public readonly promoteLevel: number
  public readonly refinementRank: number
  public readonly rarity: number
  public readonly mainStat: StatProperty
  public readonly subStat: StatProperty | undefined
  public readonly isAwaken: boolean
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
}

export type WeaponType =
  | 'WEAPON_BOW'
  | 'WEAPON_CATALYST'
  | 'WEAPON_CLAYMORE'
  | 'WEAPON_POLE'
  | 'WEAPON_SWORD_ONE_HAND'
