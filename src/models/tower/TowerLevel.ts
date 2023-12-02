import { Client } from '@/client/Client'
import { Monster } from '@/models/Monster'

/**
 * Class of Spiral Abyss Room.
 */
export class TowerLevel {
  /**
   * ID of the level
   */
  public readonly id: number
  /**
   * Group ID of the level
   */
  public readonly groupId: number
  /**
   * Index of the level
   */
  public readonly index: number
  /**
   * Monster level of the level
   */
  public readonly monsterLevel: number
  /**
   * First monster list of the level
   */
  public readonly firstMonsterList: Monster[]
  /**
   * Second monster list of the level
   */
  public readonly secondMonsterList: Monster[]

  /**
   * Create a TowerLevel
   * @param levelId ID of the level
   * @param floorIndex Index of the floor
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

    this.firstMonsterList = (towerLevelJson.firstMonsterList as number[]).map(
      (monsterDescribeId) =>
        new Monster(
          Monster.findMonsterIdByDescribeId(monsterDescribeId),
          this.monsterLevel,
          playerCount,
        ),
    )
    this.secondMonsterList = (towerLevelJson.secondMonsterList as number[]).map(
      (monsterDescribeId) =>
        new Monster(
          Monster.findMonsterIdByDescribeId(monsterDescribeId),
          this.monsterLevel,
          playerCount,
        ),
    )
  }

  /**
   * Get all tower level ids
   * @returns All tower level ids
   */
  public static getAllTowerLevelIds() {
    const towerLevelDatas = Object.values(
      Client._getCachedExcelBinOutputByName('TowerLevelExcelConfigData'),
    )
    return towerLevelDatas.map((t) => t.levelId as number)
  }

  /**
   * Find tower level id by group id and index
   * @param groupId LevelGroupId
   * @param index LevelIndex
   * @returns levelId
   */
  public static findTowerLevelIdByGroupIdAndIndex(
    groupId: number,
    index: number,
  ) {
    const towerLevelDatas = Object.values(
      Client._getCachedExcelBinOutputByName('TowerLevelExcelConfigData'),
    )
    const towerLevelData = towerLevelDatas.find(
      (t) => t.levelGroupId === groupId && t.levelIndex === index,
    )
    return towerLevelData ? (towerLevelData.levelId as number) : undefined
  }
}
