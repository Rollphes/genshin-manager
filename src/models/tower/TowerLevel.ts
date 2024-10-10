import { Client } from '@/client/Client'
import { OutOfRangeError } from '@/errors/OutOfRangeError'
import { Monster } from '@/models/Monster'

/**
 * Class of Spiral Abyss Room
 */
export class TowerLevel {
  /**
   * Spiral Abyss Level ID
   */
  public readonly id: number
  /**
   * Group ID
   */
  public readonly groupId: number
  /**
   * Spiral Abyss Level Index
   */
  public readonly index: number
  /**
   * Monster level
   */
  public readonly monsterLevel: number
  /**
   * First monsters this level
   */
  public readonly firstMonsters: Monster[]
  /**
   * Second monsters this level
   */
  public readonly secondMonsters: Monster[]

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

  /**
   * Create a TowerLevel
   * @param levelId Spiral Abyss Level ID
   * @param floorIndex Spiral Abyss Floor index (1-12)
   */
  constructor(levelId: number, floorIndex: number) {
    this.id = levelId

    const towerLevelJson = Client._getJsonFromCachedExcelBinOutput(
      'TowerLevelExcelConfigData',
      this.id,
    )
    this.index = towerLevelJson.levelIndex as number
    this.groupId = towerLevelJson.levelGroupId as number
    this.monsterLevel = (towerLevelJson.monsterLevel as number) + 1

    let playerCount = 1
    if (floorIndex <= 2) playerCount = 1
    else if (floorIndex <= 7) playerCount = 2
    else if (floorIndex <= 11) playerCount = 3
    else if (floorIndex === 12) playerCount = 4
    else throw new OutOfRangeError('floorIndex', floorIndex, 1, 12)

    this.firstMonsters = (towerLevelJson.firstMonsterList as number[]).map(
      (monsterDescribeId) =>
        new Monster(
          Monster.findMonsterIdByDescribeId(monsterDescribeId),
          this.monsterLevel,
          playerCount,
        ),
    )
    this.secondMonsters = (towerLevelJson.secondMonsterList as number[]).map(
      (monsterDescribeId) =>
        new Monster(
          Monster.findMonsterIdByDescribeId(monsterDescribeId),
          this.monsterLevel,
          playerCount,
        ),
    )
  }

  /**
   * Get all tower level IDs
   * @returns All tower level IDs
   */
  public static get allTowerLevelIds(): number[] {
    const towerLevelDatas = Object.values(
      Client._getCachedExcelBinOutputByName('TowerLevelExcelConfigData'),
    )
    return towerLevelDatas.map((t) => t.levelId as number)
  }

  /**
   * Find tower level ID by group ID and index
   * @param groupId LevelGroup ID
   * @param index LevelIndex (1-3)
   * @returns level ID
   */
  public static findTowerLevelIdByGroupIdAndIndex(
    groupId: number,
    index: number,
  ): number | undefined {
    if (index < 1 || index > 3) throw new OutOfRangeError('index', index, 1, 3)
    const towerLevelDatas = Object.values(
      Client._getCachedExcelBinOutputByName('TowerLevelExcelConfigData'),
    )
    const towerLevelData = towerLevelDatas.find(
      (t) => t.levelGroupId === groupId && t.levelIndex === index,
    )
    return towerLevelData ? (towerLevelData.levelId as number) : undefined
  }
}
