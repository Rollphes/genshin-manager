import { Client } from '@/client/Client'
import { OutOfRangeError } from '@/errors/OutOfRangeError'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { StatProperty } from '@/models/StatProperty'
import { CodexType, FightProps } from '@/types'
import { JsonObject } from '@/utils/JsonParser'

const statusBonusMonsterAtMultiPlay = {
  FIGHT_PROP_BASE_HP: [1.0, 1.5, 2.0, 2.5],
  FIGHT_PROP_BASE_ATTACK: [1.0, 1.1, 1.25, 1.4],
  FIGHT_PROP_BASE_DEFENSE: [1.0, 1.0, 1.0, 1.0],
} as const

/**
 * Class of Monster
 */
export class Monster {
  /**
   * Monster ID
   */
  public readonly id: number
  /**
   * Monster level
   */
  public readonly level: number
  /**
   * Monster Internal name
   */
  public readonly internalName: string
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
   * Monster stats
   */
  public readonly stats: StatProperty[] = []
  /**
   * Monster type
   */
  public readonly codexType: CodexType | undefined

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

  /**
   * Create a Monster
   * @param monsterId monster ID
   * @param level monsterLevel (1-100). Default: 1
   * @param playerCount Number of players (1-4). Default: 1
   */
  constructor(monsterId: number, level: number = 1, playerCount: number = 1) {
    this.id = monsterId
    this.level = level
    if (this.level < 1 || this.level > 100)
      throw new OutOfRangeError('level', this.level, 1, 200)
    if (playerCount < 1 || playerCount > 4)
      throw new OutOfRangeError('playerCount', playerCount, 1, 4)

    const monsterJson = Client._getJsonFromCachedExcelBinOutput(
      'MonsterExcelConfigData',
      this.id,
    )
    this.internalName = monsterJson.monsterName as string
    this.name =
      Client._cachedTextMap.get(String(monsterJson.nameTextMapHash)) ?? ''
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
        Client._cachedTextMap.get(
          String(monsterDescribeJson.nameTextMapHash),
        ) ?? ''
      this.icon = new ImageAssets(monsterDescribeJson.icon as string)
    }

    if (
      monsterJson.describeId &&
      Object.keys(
        Client._getCachedExcelBinOutputByName('AnimalCodexExcelConfigData'),
      ).includes(String(monsterJson.describeId as number))
    ) {
      const animalCodexJson = Client._getJsonFromCachedExcelBinOutput(
        'AnimalCodexExcelConfigData',
        monsterJson.describeId as number,
      )
      this.description =
        Client._cachedTextMap.get(String(animalCodexJson.descTextMapHash)) ?? ''
      this.codexType =
        (animalCodexJson.subType as CodexType | undefined) ??
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
    this.stats = [
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
   * Get all monster IDs
   * @returns All monster IDs
   */
  public static get allMonsterIds(): number[] {
    return Object.keys(
      Client._getCachedExcelBinOutputByName('MonsterExcelConfigData'),
    ).map((id) => Number(id))
  }

  /**
   * find monster ID by describe ID
   * @param describeId Describe ID
   * @returns monster ID
   */
  public static findMonsterIdByDescribeId(describeId: number): number {
    const convertId = describeId.toString().padStart(5, '0')
    //Since some monsterId cannot be obtained by this method, the describeId is converted.
    const exceptionIds: { [key in number]: number } = {
      21104: 22110403,
      30604: 23060201,
      90903: 29090304,
      62081: 26208103,
      91220: 29122000,
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
      propGrowCurve.type === undefined ||
      propGrowCurve.type === 'FIGHT_PROP_NONE'
        ? 1.0
        : statusBonusMonsterAtMultiPlay[
            propGrowCurve.type as keyof typeof statusBonusMonsterAtMultiPlay
          ][playerCount - 1]
    if (
      propGrowCurve.growCurve === undefined ||
      propGrowCurve.growCurve === 'GROW_CURVE_NONE' ||
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
