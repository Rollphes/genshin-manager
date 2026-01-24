import { ImageAssets } from '@/adapter/output/assets/ImageAssets'
import { StatProperty } from '@/adapter/output/StatProperty'
import { Client } from '@/application/client/Client'
import {
  monsterLevelSchema,
  playerCountSchema,
} from '@/domain/schemas/commonSchemas'
import { toEnum } from '@/domain/typeGuards/toEnum'
import { FightProp, GrowCurve, SubType } from '@/domain/types/enums'
import { validate } from '@/domain/validation/validate'
import { AssetNotFoundError } from '@/infrastructure/errors/AssetNotFoundError'

const statusBonusMonsterAtMultiPlay: Partial<
  Record<FightProp, readonly [number, number, number, number]>
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
   * @param monsterId - monster ID
   * @param level - monster level (1-100), defaults to 1
   * @param playerCount - number of players (1-4), defaults to 1
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
    this.level = validate(monsterLevelSchema, level, {
      propertyKey: 'level',
    })
    this.playerCount = validate(playerCountSchema, playerCount, {
      propertyKey: 'playerCount',
    })

    const monsterJson = Client._findBy('MonsterExcelConfigData', 'id', this.id)
    if (!monsterJson) {
      throw new AssetNotFoundError(
        `Monster ${String(this.id)}`,
        'MonsterExcelConfigData',
      )
    }
    this.internalName = monsterJson.monsterName
    const nameTextMapHash = monsterJson.nameTextMapHash
    this.name = Client._cachedTextMap.get(nameTextMapHash) ?? ''
    const describeId = +String(this.id).slice(1, 6)
    const monsterDescribeJson = Client._findBy(
      'MonsterDescribeExcelConfigData',
      'id',
      describeId,
    )
    if (monsterDescribeJson) {
      const nameTextMapHash = monsterDescribeJson.nameTextMapHash
      this.describeName = Client._cachedTextMap.get(nameTextMapHash) ?? ''
      this.icon = new ImageAssets(monsterDescribeJson.icon)
    }

    if (monsterJson.describeId) {
      const animalCodexJson = Client._findBy(
        'AnimalCodexExcelConfigData',
        'describeId',
        monsterJson.describeId,
      )
      if (animalCodexJson) {
        this.description =
          Client._cachedTextMap.get(animalCodexJson.descTextMapHash) ?? ''
        this.codexType = animalCodexJson.subType
      }
    }

    const enumContext = {
      source: 'MonsterExcelConfigData',
      recordId: monsterJson.id,
    } as const

    const hpBase = this.getStatValueByGrow(
      toEnum(FightProp, monsterJson.propGrowCurves[0].type, 'FightProp', {
        ...enumContext,
        path: 'propGrowCurves[0].type',
      }),
      monsterJson.propGrowCurves[0].growCurve,
      monsterJson.hpBase,
      playerCount,
    )
    const attackBase = this.getStatValueByGrow(
      toEnum(FightProp, monsterJson.propGrowCurves[1].type, 'FightProp', {
        ...enumContext,
        path: 'propGrowCurves[1].type',
      }),
      monsterJson.propGrowCurves[1].growCurve,
      monsterJson.attackBase,
      playerCount,
    )
    const defenseBase = this.getStatValueByGrow(
      toEnum(FightProp, monsterJson.propGrowCurves[2].type, 'FightProp', {
        ...enumContext,
        path: 'propGrowCurves[2].type',
      }),
      monsterJson.propGrowCurves[2].growCurve,
      monsterJson.defenseBase,
      playerCount,
    )
    this.stats = [
      new StatProperty(FightProp.FightPropBaseHP, hpBase),
      new StatProperty(FightProp.FightPropBaseAttack, attackBase),
      new StatProperty(FightProp.FightPropBaseDefense, defenseBase),
      new StatProperty(
        FightProp.FightPropPhysicalSubHurt,
        monsterJson.physicalSubHurt,
      ),
      new StatProperty(FightProp.FightPropElecSubHurt, monsterJson.elecSubHurt),
      new StatProperty(
        FightProp.FightPropWaterSubHurt,
        monsterJson.waterSubHurt,
      ),
      new StatProperty(
        FightProp.FightPropGrassSubHurt,
        monsterJson.grassSubHurt,
      ),
      new StatProperty(FightProp.FightPropWindSubHurt, monsterJson.windSubHurt),
      new StatProperty(FightProp.FightPropRockSubHurt, monsterJson.rockSubHurt),
      new StatProperty(FightProp.FightPropIceSubHurt, monsterJson.iceSubHurt),
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
    return Client._getAll('MonsterExcelConfigData').map((data) => data.id)
  }

  /**
   * Find monster ID by description ID
   * @param describeId - description ID
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

  private getStatValueByGrow(
    type: FightProp,
    growCurve: GrowCurve,
    initValue = 0,
    playerCount = 1,
  ): number {
    if (!statusBonusMonsterAtMultiPlay[type]) return initValue
    const bonusValue = statusBonusMonsterAtMultiPlay[type][playerCount - 1]
    if (
      growCurve === GrowCurve.GrowCurveNone ||
      growCurve === GrowCurve.GrowCurveDefending
    )
      return initValue * bonusValue
    const curveRecords = Client._filterBy(
      'MonsterCurveExcelConfigData',
      'level',
      this.level,
    )
    const curveInfo = curveRecords
      .flatMap((c) => c.curveInfos)
      .find((info) => (info.type as string) === (growCurve as string))
    if (!curveInfo) {
      throw new AssetNotFoundError(
        `MonsterCurve level ${String(this.level)} growCurve ${growCurve}`,
        'MonsterCurveExcelConfigData',
      )
    }
    const curveValue = curveInfo.value
    return initValue * curveValue * bonusValue
  }
}
