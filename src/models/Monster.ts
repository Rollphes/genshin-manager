import { Client } from '@/client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { StatProperty } from '@/models/StatProperty'
import { monsterLevelSchema, playerCountSchema } from '@/schemas'
import { FightProps } from '@/types'
import { SubType } from '@/types/generated/AnimalCodexExcelConfigData'
import {
  GrowCurve,
  type PropGrowCurve,
  type PropGrowCurveType,
} from '@/types/generated/MonsterExcelConfigData'
import { ValidationHelper } from '@/utils/validation'

const statusBonusMonsterAtMultiPlay: Record<
  PropGrowCurveType,
  readonly [number, number, number, number]
> = {
  FIGHT_PROP_BASE_HP: [1.0, 1.5, 2.0, 2.5],
  FIGHT_PROP_BASE_ATTACK: [1.0, 1.1, 1.25, 1.4],
  FIGHT_PROP_BASE_DEFENSE: [1.0, 1.0, 1.0, 1.0],
  FIGHT_PROP_NONE: [1.0, 1.0, 1.0, 1.0],
}

/**
 * Represents a game monster with stats and properties
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
   * Player count for co-op scaling
   */
  public readonly playerCount: number
  /**
   * Monster Internal name
   */
  public readonly internalName: string
  /**
   * Monster name
   */
  public readonly name: string
  /**
   * Monster display name
   */
  public readonly describeName: string = ''
  /**
   * Monster description
   */
  public readonly description: string = ''
  /**
   * Monster display icon
   */
  public readonly icon: ImageAssets | undefined
  /**
   * Monster stats
   */
  public readonly stats: StatProperty[] = []
  /**
   * Monster type
   */
  public readonly codexType: SubType | undefined

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

  /**
   * Create a Monster
   * @param monsterId monster ID
   * @param level monster level (1-100), defaults to 1
   * @param playerCount number of players (1-4), defaults to 1
   * @example
   * ```typescript
   * // Create a level 50 monster for single player
   * const monster = new Monster(21010101, 50)
   *
   * // Create a level 80 monster for co-op (4 players)
   * const coopMonster = new Monster(21010101, 80, 4)
   * ```
   */

  /**
   * Creates a new Monster instance
   * @param monsterId - Monster ID
   * @param level - Monster level
   * @param playerCount - Number of players for co-op scaling
   */
  constructor(monsterId: number, level = 1, playerCount = 1) {
    this.id = monsterId
    this.level = ValidationHelper.validate(monsterLevelSchema, level, {
      propertyKey: 'level',
    })
    this.playerCount = ValidationHelper.validate(
      playerCountSchema,
      playerCount,
      {
        propertyKey: 'playerCount',
      },
    )

    const monsterJson = Client._getJsonFromCachedExcelBinOutput(
      'MonsterExcelConfigData',
      this.id,
    )
    this.internalName = monsterJson.monsterName
    const nameTextMapHash = monsterJson.nameTextMapHash
    this.name = Client._cachedTextMap.get(nameTextMapHash) ?? ''
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
      const nameTextMapHash = monsterDescribeJson.nameTextMapHash
      this.describeName = Client._cachedTextMap.get(nameTextMapHash) ?? ''
      this.icon = new ImageAssets(monsterDescribeJson.icon)
    }

    if (
      monsterJson.describeId &&
      Object.keys(
        Client._getCachedExcelBinOutputByName('AnimalCodexExcelConfigData'),
      ).includes(String(monsterJson.describeId))
    ) {
      const animalCodexJson = Client._getJsonFromCachedExcelBinOutput(
        'AnimalCodexExcelConfigData',
        monsterJson.describeId,
      )
      this.description =
        Client._cachedTextMap.get(animalCodexJson.descTextMapHash) ?? ''
      this.codexType = animalCodexJson.subType
    }

    const hpBase = this.getStatValueByJson(
      monsterJson.propGrowCurves[0],
      monsterJson.hpBase,
      playerCount,
    )
    const attackBase = this.getStatValueByJson(
      monsterJson.propGrowCurves[1],
      monsterJson.attackBase,
      playerCount,
    )
    const defenseBase = this.getStatValueByJson(
      monsterJson.propGrowCurves[2],
      monsterJson.defenseBase,
      playerCount,
    )
    this.stats = [
      new StatProperty(FightProps[1], hpBase),
      new StatProperty(FightProps[4], attackBase),
      new StatProperty(FightProps[7], defenseBase),
      new StatProperty(FightProps[29], monsterJson.physicalSubHurt),
      new StatProperty(FightProps[51], monsterJson.elecSubHurt),
      new StatProperty(FightProps[52], monsterJson.waterSubHurt),
      new StatProperty(FightProps[53], monsterJson.grassSubHurt),
      new StatProperty(FightProps[54], monsterJson.windSubHurt),
      new StatProperty(FightProps[55], monsterJson.rockSubHurt),
      new StatProperty(FightProps[56], monsterJson.iceSubHurt),
    ]
  }

  /**
   * Get all monster IDs
   * @returns all monster IDs
   * @example
   * ```typescript
   * const allIds = Monster.allMonsterIds
   * console.log(`Total monsters: ${allIds.length}`)
   * ```
   */
  public static get allMonsterIds(): number[] {
    return Object.keys(
      Client._getCachedExcelBinOutputByName('MonsterExcelConfigData'),
    ).map((id) => Number(id))
  }

  /**
   * Find monster ID by description ID
   * @param describeId description ID
   * @returns monster ID
   * @example
   * ```typescript
   * const monsterId = Monster.findMonsterIdByDescribeId(21104)
   * const monster = new Monster(monsterId)
   * ```
   */
  public static findMonsterIdByDescribeId(describeId: number): number {
    const convertId = describeId.toString().padStart(5, '0')
    // TODO: Maintenance-free implementation needed to avoid manual updates for each version
    const exceptionIds: Record<number, number> = {
      21104: 22110403,
      30604: 23060201,
      90903: 29090304,
      62081: 26208103,
      91220: 29122000,
      30801: 23080102,
      50001: 29122000,
      50002: 29122000,
      50003: 29122000,
    }
    return Object.keys(exceptionIds).includes(String(describeId))
      ? exceptionIds[describeId]
      : Number(`2${convertId}01`)
  }

  /**
   * Get monster's stat value by stat type
   * @param propGrowCurve monsterExcelConfigData.propGrowCurves
   * @param initValue initial value
   * @param playerCount number of players
   * @returns stat value
   */
  private getStatValueByJson(
    propGrowCurve: PropGrowCurve | undefined,
    initValue = 0,
    playerCount = 1,
  ): number {
    if (!propGrowCurve) return initValue
    const bonusValue =
      statusBonusMonsterAtMultiPlay[propGrowCurve.type][playerCount - 1]
    if (
      propGrowCurve.growCurve === GrowCurve.GrowCurveNone ||
      propGrowCurve.growCurve === GrowCurve.GrowCurveDefending
    )
      return initValue * bonusValue
    const curveValue = Client._getJsonFromCachedExcelBinOutput(
      'MonsterCurveExcelConfigData',
      propGrowCurve.growCurve,
    )[this.level]
    return initValue * curveValue * bonusValue
  }
}
