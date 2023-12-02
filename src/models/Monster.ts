import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { FightProps, StatProperty } from '@/models/StatProperty'
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
   * Monster id
   */
  public readonly id: number
  /**
   * Monster level
   */
  public readonly level: number
  /**
   * Monster Internal name
   */
  public readonly monsterName: string
  /**
   * Monster name
   */
  public readonly name: string
  /**
   * Monster Preview name
   */
  public readonly describeName: string = ''
  /**
   * Monster description
   */
  public readonly description: string = ''
  /**
   * Monster Preview icon
   */
  public readonly icon: ImageAssets | undefined
  /**
   * Monster status
   */
  public readonly status: StatProperty[] = []
  /**
   * Monster type
   */
  public readonly codexType: CodexType | undefined

  /**
   * Create a Monster
   * @param monsterId monsterId
   * @param level monsterLevel
   * @param playerCount Number of players
   */
  constructor(monsterId: number, level: number = 1, playerCount: number = 1) {
    this.id = monsterId
    this.level = level

    const monsterJson = Client._getJsonFromCachedExcelBinOutput(
      'MonsterExcelConfigData',
      this.id,
    )
    this.monsterName = monsterJson.monsterName as string
    this.name =
      Client.cachedTextMap.get(String(monsterJson.nameTextMapHash)) || ''
    const describeId = +String(this.id).slice(1, 6)
    if (
      Object.keys(
        Client._getCachedExcelBinOutputByName('MonsterDescribeExcelConfigData'),
      ).includes(String(describeId))
    ) {
      const monsterDescribeJson = Client._getJsonFromCachedExcelBinOutput(
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
        Client._getCachedExcelBinOutputByName('AnimalCodexExcelConfigData'),
      ).includes(String(monsterJson.describeId as number))
    ) {
      const AnimalCodexJson = Client._getJsonFromCachedExcelBinOutput(
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
    this.status = [
      new StatProperty(FightProps[1], hpBase),
      new StatProperty(FightProps[4], attackBase),
      new StatProperty(FightProps[7], defenseBase),
      new StatProperty(
        FightProps[29],
        (monsterJson.physicalSubHurt ?? 0) as number,
      ),
      new StatProperty(
        FightProps[51],
        (monsterJson.elecSubHurt ?? 0) as number,
      ),
      new StatProperty(
        FightProps[52],
        (monsterJson.waterSubHurt ?? 0) as number,
      ),
      new StatProperty(
        FightProps[53],
        (monsterJson.grassSubHurt ?? 0) as number,
      ),
      new StatProperty(
        FightProps[54],
        (monsterJson.windSubHurt ?? 0) as number,
      ),
      new StatProperty(
        FightProps[55],
        (monsterJson.rockSubHurt ?? 0) as number,
      ),
      new StatProperty(FightProps[56], (monsterJson.iceSubHurt ?? 0) as number),
    ]
  }

  /**
   * Get all monster ids
   * @returns All monster ids
   */
  public static getAllMonsterIds(): number[] {
    return Object.keys(
      Client._getCachedExcelBinOutputByName('MonsterExcelConfigData'),
    ).map((id) => Number(id))
  }

  /**
   * find monsterId by describeId
   * @param describeId describeId
   * @returns monsterId
   */
  public static findMonsterIdByDescribeId(describeId: number): number {
    const convertId = describeId.toString().padStart(5, '0')
    //Since some monsterId cannot be obtained by this method, the describeId is converted.
    const exceptionIds: { [key in number]: number } = {
      21104: 22110403,
      30604: 23060201,
    }
    return Object.keys(exceptionIds).includes(String(describeId))
      ? exceptionIds[+describeId]
      : Number(`2${convertId}01`)
  }

  /**
   * Get monster's stat value by stat type
   * @param propGrowCurve monsterExcelConfigData.propGrowCurves
   * @param initValue Initial value
   * @param playerCount Number of players
   * @returns Stat value
   */
  private getStatValueByJson(
    propGrowCurve: JsonObject | undefined,
    initValue: number = 0,
    playerCount: number = 1,
  ): number {
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
    const curveValue = Client._getJsonFromCachedExcelBinOutput(
      'MonsterCurveExcelConfigData',
      propGrowCurve.growCurve as string,
    )[this.level] as number
    return initValue * curveValue * bonusValue
  }
}
