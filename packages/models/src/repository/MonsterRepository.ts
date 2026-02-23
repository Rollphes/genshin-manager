import { GeneralError } from '@genshin-manager/core'
import type { ExcelBinCache, TextMapIndex } from '@genshin-manager/data'

import { ImageAssets } from '@/assets/ImageAssets'
import { StatProperty } from '@/common/StatProperty'
import { Monster } from '@/monster/Monster'
import { FightProp, GrowCurve, SubType } from '@/types/enums'
import type { RepositoryDependencies } from '@/types/RepositoryDependencies'
import { toFightProp } from '@/utils/toFightProp'

/**
 * Co-op stat scaling multipliers per player count
 */
const statusBonusMonsterAtMultiPlay: Partial<
  Record<FightProp, readonly [number, number, number, number]>
> = {
  FIGHT_PROP_BASE_HP: [1.0, 1.5, 2.0, 2.5],
  FIGHT_PROP_BASE_ATTACK: [1.0, 1.1, 1.25, 1.4],
  FIGHT_PROP_BASE_DEFENSE: [1.0, 1.0, 1.0, 1.0],
  FIGHT_PROP_NONE: [1.0, 1.0, 1.0, 1.0],
}

/**
 * Repository for building Monster DTOs from ExcelBin and TextMap data.
 */
export class MonsterRepository {
  private readonly excelBinCache: ExcelBinCache
  private readonly textMap: TextMapIndex
  private readonly imageBaseURL: string

  /**
   * Create a MonsterRepository
   * @param deps - Repository dependencies
   * @param imageBaseURL - Base URL for image assets
   */
  constructor(deps: RepositoryDependencies, imageBaseURL: string) {
    this.excelBinCache = deps.excelBinCache
    this.textMap = deps.textMap
    this.imageBaseURL = imageBaseURL
  }

  /**
   * Build a Monster DTO
   * @param monsterId - Monster ID
   * @param level - Monster level (1-100)
   * @param playerCount - Number of players for co-op scaling (1-4)
   * @returns Monster DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async getMonster(
    monsterId: number,
    level = 1,
    playerCount = 1,
  ): Promise<Monster> {
    const result = await this.excelBinCache
      .fromWithTextMap('MonsterExcelConfigData', this.textMap)
      .select([
        'id',
        'nameTextMapHash',
        'monsterName',
        'describeId',
        'hpBase',
        'attackBase',
        'defenseBase',
        'physicalSubHurt',
        'elecSubHurt',
        'waterSubHurt',
        'grassSubHurt',
        'windSubHurt',
        'rockSubHurt',
        'iceSubHurt',
        'propGrowCurves',
      ])
      .where('id', '=', monsterId)
      .executeTakeFirstOrThrow()

    const name = result.nameTextMapHash.toText()

    // Describe info
    const describeId = +String(monsterId).slice(1, 6)
    const describeResult = await this.excelBinCache
      .fromWithTextMap('MonsterDescribeExcelConfigData', this.textMap)
      .select(['id', 'nameTextMapHash', 'icon'])
      .where('id', '=', describeId)
      .executeTakeFirst()

    let describeName = ''
    let icon: ImageAssets | undefined

    if (describeResult) {
      describeName = describeResult.nameTextMapHash.toText()
      icon = new ImageAssets({
        name: describeResult.icon.value,
        imageBaseURL: this.imageBaseURL,
      })
    }

    // Codex info
    let description = ''
    let codexType: SubType | undefined
    const describeIdValue = result.describeId.value

    if (describeIdValue) {
      const codexResults = await this.excelBinCache
        .fromWithTextMap('AnimalCodexExcelConfigData', this.textMap)
        .select(['describeId', 'descTextMapHash', 'subType'])
        .execute()

      const codexFound = codexResults.find(
        (r) => r.describeId.value === describeIdValue,
      )
      if (codexFound) {
        description = codexFound.descTextMapHash.toText()
        codexType = codexFound.subType.toEnum(SubType)
      }
    }

    // Stats calculation - use raw propGrowCurves array
    const propGrowCurves = result.propGrowCurves.map((pgc) => ({
      type: pgc.type.value,
      growCurve: pgc.growCurve.value,
    }))

    const stats = await this.buildMonsterStats(
      {
        hpBase: result.hpBase.value,
        attackBase: result.attackBase.value,
        defenseBase: result.defenseBase.value,
        physicalSubHurt: result.physicalSubHurt.value,
        elecSubHurt: result.elecSubHurt.value,
        waterSubHurt: result.waterSubHurt.value,
        grassSubHurt: result.grassSubHurt.value,
        windSubHurt: result.windSubHurt.value,
        rockSubHurt: result.rockSubHurt.value,
        iceSubHurt: result.iceSubHurt.value,
      },
      propGrowCurves,
      level,
      playerCount,
    )

    return new Monster({
      id: monsterId,
      level,
      playerCount,
      internalName: result.monsterName.value,
      name,
      describeName,
      description,
      icon,
      stats,
      codexType: codexType,
    })
  }

  /**
   * Get all monster IDs
   * @returns Array of monster IDs
   */
  public async getAllMonsterIds(): Promise<number[]> {
    const results = await this.excelBinCache
      .from('MonsterExcelConfigData')
      .select(['id'])
      .execute()

    return results.map((r) => r.id.value)
  }

  /**
   * Build monster stats with growth curve and co-op scaling
   * @param monsterData - Monster stat data including base stats and resistances
   * @param monsterData.hpBase - Base HP value
   * @param monsterData.attackBase - Base attack value
   * @param monsterData.defenseBase - Base defense value
   * @param monsterData.physicalSubHurt - Physical resistance
   * @param monsterData.elecSubHurt - Electro resistance
   * @param monsterData.waterSubHurt - Hydro resistance
   * @param monsterData.grassSubHurt - Dendro resistance
   * @param monsterData.windSubHurt - Anemo resistance
   * @param monsterData.rockSubHurt - Geo resistance
   * @param monsterData.iceSubHurt - Cryo resistance
   * @param propGrowCurves - Growth curve definitions
   * @param level - Monster level
   * @param playerCount - Number of players
   * @returns Array of StatProperty
   * @throws {@link GeneralError} - If propGrowCurves has less than 3 elements
   */
  private async buildMonsterStats(
    monsterData: {
      hpBase: number
      attackBase: number
      defenseBase: number
      physicalSubHurt: number
      elecSubHurt: number
      waterSubHurt: number
      grassSubHurt: number
      windSubHurt: number
      rockSubHurt: number
      iceSubHurt: number
    },
    propGrowCurves: { type: string; growCurve: string }[],
    level: number,
    playerCount: number,
  ): Promise<StatProperty[]> {
    if (propGrowCurves.length < 3) {
      throw new GeneralError(
        'Invalid propGrowCurves: expected at least 3 elements',
      )
    }

    const curve0 = propGrowCurves[0]
    const curve1 = propGrowCurves[1]
    const curve2 = propGrowCurves[2]

    const hpBase = await this.getStatValueByGrow(
      toFightProp(curve0.type),
      curve0.growCurve,
      monsterData.hpBase,
      level,
      playerCount,
    )
    const attackBase = await this.getStatValueByGrow(
      toFightProp(curve1.type),
      curve1.growCurve,
      monsterData.attackBase,
      level,
      playerCount,
    )
    const defenseBase = await this.getStatValueByGrow(
      toFightProp(curve2.type),
      curve2.growCurve,
      monsterData.defenseBase,
      level,
      playerCount,
    )

    return [
      new StatProperty({
        type: FightProp.FightPropBaseHP,
        name: FightProp.FightPropBaseHP.toString(),
        value: hpBase,
      }),
      new StatProperty({
        type: FightProp.FightPropBaseAttack,
        name: FightProp.FightPropBaseAttack.toString(),
        value: attackBase,
      }),
      new StatProperty({
        type: FightProp.FightPropBaseDefense,
        name: FightProp.FightPropBaseDefense.toString(),
        value: defenseBase,
      }),
      new StatProperty({
        type: FightProp.FightPropPhysicalSubHurt,
        name: FightProp.FightPropPhysicalSubHurt.toString(),
        value: monsterData.physicalSubHurt,
      }),
      new StatProperty({
        type: FightProp.FightPropElecSubHurt,
        name: FightProp.FightPropElecSubHurt.toString(),
        value: monsterData.elecSubHurt,
      }),
      new StatProperty({
        type: FightProp.FightPropWaterSubHurt,
        name: FightProp.FightPropWaterSubHurt.toString(),
        value: monsterData.waterSubHurt,
      }),
      new StatProperty({
        type: FightProp.FightPropGrassSubHurt,
        name: FightProp.FightPropGrassSubHurt.toString(),
        value: monsterData.grassSubHurt,
      }),
      new StatProperty({
        type: FightProp.FightPropWindSubHurt,
        name: FightProp.FightPropWindSubHurt.toString(),
        value: monsterData.windSubHurt,
      }),
      new StatProperty({
        type: FightProp.FightPropRockSubHurt,
        name: FightProp.FightPropRockSubHurt.toString(),
        value: monsterData.rockSubHurt,
      }),
      new StatProperty({
        type: FightProp.FightPropIceSubHurt,
        name: FightProp.FightPropIceSubHurt.toString(),
        value: monsterData.iceSubHurt,
      }),
    ]
  }

  /**
   * Calculate stat value with growth curve and co-op scaling
   * @param type - FightProp type
   * @param growCurveStr - Growth curve string value
   * @param initValue - Base value
   * @param level - Monster level
   * @param playerCount - Number of players
   * @returns Calculated stat value
   */
  private async getStatValueByGrow(
    type: FightProp,
    growCurveStr: string,
    initValue: number,
    level: number,
    playerCount: number,
  ): Promise<number> {
    const bonusValues = statusBonusMonsterAtMultiPlay[type]
    if (!bonusValues) return initValue
    const bonusValue = bonusValues[playerCount - 1]

    const curve = this.toGrowCurve(growCurveStr)

    if (
      curve === GrowCurve.GrowCurveNone ||
      curve === GrowCurve.GrowCurveDefending
    )
      return initValue * bonusValue

    const curveResult = await this.excelBinCache
      .from('MonsterCurveExcelConfigData')
      .select(['level', 'curveInfos'])
      .where('level', '=', level)
      .executeTakeFirstOrThrow()

    const curveInfos: { type: string; value: number }[] =
      curveResult.curveInfos.map((info) => ({
        type: info.type.value,
        value: info.value.value,
      }))
    const curveInfo = curveInfos.find((info) => info.type === growCurveStr)

    return initValue * (curveInfo?.value ?? 1) * bonusValue
  }

  /**
   * Convert string to GrowCurve enum
   * @param value - String value
   * @returns GrowCurve enum value
   * @throws {@link GeneralError} - If value is not a valid GrowCurve
   */
  private toGrowCurve(value: string): GrowCurve {
    const entries = Object.entries(GrowCurve)
    const found = entries.find(([, v]) => {
      const vStr: string = v
      return vStr === value
    })
    if (!found) throw new GeneralError(`Invalid GrowCurve value: ${value}`)

    return found[1]
  }
}
