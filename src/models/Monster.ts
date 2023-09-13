import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { FightProp } from '@/models/character/FightProp'
import { JsonObject } from '@/utils/JsonParser'

/**
 * Monster type
 * @CODEX_SUBTYPE_ELEMENT_LIFE is original reason: Element lifeforms does not have a subType
 */
export type CodexType =
  | 'CODEX_SUBTYPE_ELEMENT_LIFE'
  | 'CODEX_SUBTYPE_ABYSS'
  | 'CODEX_SUBTYPE_ANIMAL'
  | 'CODEX_SUBTYPE_AUTOMATRON'
  | 'CODEX_SUBTYPE_AVIARY'
  | 'CODEX_SUBTYPE_BEAST'
  | 'CODEX_SUBTYPE_BOSS'
  | 'CODEX_SUBTYPE_CRITTER'
  | 'CODEX_SUBTYPE_FATUI'
  | 'CODEX_SUBTYPE_FISH'
  | 'CODEX_SUBTYPE_HILICHURL'
  | 'CODEX_SUBTYPE_HUMAN'

const StatusBonusMonsterAtMultiPlay = {
  FIGHT_PROP_BASE_HP: [1.0, 1.5, 2.0, 2.5],
  FIGHT_PROP_BASE_ATTACK: [1.0, 1.1, 1.25, 1.4],
  FIGHT_PROP_BASE_DEFENSE: [1.0, 1.0, 1.0, 1.0],
} as const

/**
 * Class of Monster.
 */
export class Monster {
  /**
   * ID of the monster
   */
  public readonly id: number
  /**
   * Level of the monster
   */
  public readonly level: number
  /**
   * Internal name of the monster
   */
  public readonly monsterName: string
  /**
   * Name of the monster
   */
  public readonly name: string
  /**
   * Preview name of the monster
   */
  public readonly describeName: string = ''
  /**
   * Description of the monster
   */
  public readonly description: string = ''
  /**
   * Preview icon of the monster
   */
  public readonly icon: ImageAssets | undefined
  /**
   * FightProp of the monster
   */
  public readonly fightProp: FightProp
  /**
   * Type of the monster
   */
  public readonly codexType: CodexType | undefined

  constructor(monsterId: number, level: number = 1, playerCount: number = 1) {
    this.id = monsterId
    this.level = level

    const monsterJson = Client.cachedExcelBinOutputGetter(
      'MonsterExcelConfigData',
      this.id,
    )
    this.monsterName = monsterJson.monsterName as string
    this.name =
      Client.cachedTextMap.get(String(monsterJson.nameTextMapHash)) || ''
    const describeId = +String(this.id).slice(1, 6)
    if (
      Object.keys(
        Client.cachedExcelBinOutput
          .get('MonsterDescribeExcelConfigData')
          ?.get() as JsonObject,
      ).includes(String(describeId))
    ) {
      const monsterDescribeJson = Client.cachedExcelBinOutputGetter(
        'MonsterDescribeExcelConfigData',
        describeId,
      )
      this.describeName =
        Client.cachedTextMap.get(String(monsterDescribeJson.nameTextMapHash)) ||
        ''
      this.icon = new ImageAssets(monsterDescribeJson.icon as string)
    }

    if (
      monsterJson.describeId &&
      Object.keys(
        Client.cachedExcelBinOutput
          .get('AnimalCodexExcelConfigData')
          ?.get() as JsonObject,
      ).includes(String(monsterJson.describeId as number))
    ) {
      const AnimalCodexJson = Client.cachedExcelBinOutputGetter(
        'AnimalCodexExcelConfigData',
        monsterJson.describeId as number,
      )
      this.description =
        Client.cachedTextMap.get(String(AnimalCodexJson.descTextMapHash)) || ''
      this.codexType =
        (AnimalCodexJson.subType as CodexType | undefined) ??
        'CODEX_SUBTYPE_ELEMENT_LIFE'
    }

    const propGrowCurves = monsterJson.propGrowCurves as JsonObject[]
    const hpBase = this.getStatValueByJson(
      propGrowCurves[0],
      monsterJson.hpBase as number | undefined,
      playerCount,
    )
    const attackBase = this.getStatValueByJson(
      propGrowCurves[1],
      monsterJson.attackBase as number | undefined,
      playerCount,
    )
    const defenseBase = this.getStatValueByJson(
      propGrowCurves[2],
      monsterJson.defenseBase as number | undefined,
      playerCount,
    )
    this.fightProp = new FightProp({
      1: hpBase,
      4: attackBase,
      7: defenseBase,
      29: monsterJson.physicalSubHurt as number | undefined,
      50: monsterJson.fireSubHurt as number | undefined,
      51: monsterJson.elecSubHurt as number | undefined,
      52: monsterJson.waterSubHurt as number | undefined,
      53: monsterJson.grassSubHurt as number | undefined,
      54: monsterJson.windSubHurt as number | undefined,
      55: monsterJson.rockSubHurt as number | undefined,
      56: monsterJson.iceSubHurt as number | undefined,
    })
  }

  /**
   * Get monster's stat value by stat type
   * @param monsterGrowJson monsterExcelConfigData.propGrowCurves
   * @param initValue Initial value
   * @param playerCount Number of players
   * @returns Stat value
   */
  private getStatValueByJson(
    propGrowCurve: JsonObject | undefined,
    initValue: number = 0,
    playerCount: number = 1,
  ) {
    if (!propGrowCurve) return initValue
    const bonusValue =
      propGrowCurve.type === undefined
        ? 1.0
        : StatusBonusMonsterAtMultiPlay[
            propGrowCurve.type as keyof typeof StatusBonusMonsterAtMultiPlay
          ][playerCount - 1]
    if (
      propGrowCurve.growCurve === undefined ||
      propGrowCurve.growCurve === 'GROW_CURVE_DEFENDING' //Skip GROW_CURVE_DEFENDING as it does not exist in the 4.0 data
    )
      return initValue * bonusValue
    const curveValue = Client.cachedExcelBinOutputGetter(
      'MonsterCurveExcelConfigData',
      propGrowCurve.growCurve as string,
    )[this.level] as number
    return initValue * curveValue * bonusValue
  }

  public static getAllMonsterIds(): number[] {
    return Object.keys(
      Client.cachedExcelBinOutput
        .get('MonsterExcelConfigData')
        ?.get() as JsonObject,
    ).map((id) => Number(id))
  }

  /**
   * find monsterId by describeId
   * @param describeId describeId
   */
  public static findMonsterIdByDescribeId(describeId: number): number {
    const convertId = describeId.toString().padStart(5, '0')
    return describeId == 21104 ? 22110403 : Number(`2${convertId}01`) //21104 is an Id that cannot get monsterId in this way, so convert it to 22110403.
    //TODO:add findMonsterIdByDescribeId test Action
  }
}
