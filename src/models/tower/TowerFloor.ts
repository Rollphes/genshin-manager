import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { TowerLevel } from '@/models/tower/TowerLevel'

/**
 * Class of Spiral Abyss Floor
 */
export class TowerFloor {
  /**
   * Spiral Abyss Floor ID
   */
  public readonly id: number
  /**
   * Number of teams
   */
  public readonly teamNum: number
  /**
   * Spiral Abyss background image
   */
  public readonly bgImage: ImageAssets
  /**
   * Spiral Abyss Floor Index
   */
  public readonly index: number
  /**
   * Spiral Abyss Floor Rooms
   */
  public readonly levels: TowerLevel[] = []
  /**
   * Ley Line Disorder descriptions
   */
  public readonly buffDescriptions: string[]

  /**
   * Create a TowerFloor
   * @param floorId Spiral Abyss Floor ID
   */
  constructor(floorId: number) {
    this.id = floorId

    const towerFloorJson = Client._getJsonFromCachedExcelBinOutput(
      'TowerFloorExcelConfigData',
      this.id,
    )
    this.teamNum = towerFloorJson.teamNum as number
    this.bgImage = new ImageAssets(towerFloorJson.bgImage as string)
    this.index = towerFloorJson.floorIndex as number
    for (let i = 1; i <= 3; i++) {
      const levelId = TowerLevel.findTowerLevelIdByGroupIdAndIndex(
        towerFloorJson.levelGroupId as number,
        i,
      )
      if (levelId) this.levels.push(new TowerLevel(levelId, this.index))
    }
    const dungeonLevelEntity = Client._getCachedExcelBinOutputByName(
      'DungeonLevelEntityConfigData',
    )
    this.buffDescriptions = Object.values(dungeonLevelEntity)
      .filter(
        (dungeonLevelEntityJson) =>
          dungeonLevelEntityJson.id === towerFloorJson.floorLevelConfigId,
      )
      .map(
        (dungeonLevelEntityJson) =>
          Client.cachedTextMap.get(
            String(dungeonLevelEntityJson.descTextMapHash),
          ) || '',
      )
  }

  /**
   * Get all tower floor IDs
   * @returns All tower floor IDs
   */
  public static getAllTowerFloorIds(): number[] {
    const towerFloorDatas = Object.values(
      Client._getCachedExcelBinOutputByName('TowerFloorExcelConfigData'),
    )
    return towerFloorDatas.map((t) => t.floorId as number)
  }
}
