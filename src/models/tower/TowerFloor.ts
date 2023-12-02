import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { TowerLevel } from '@/models/tower/TowerLevel'

/**
 * Class of Spiral Abyss Floor.
 */
export class TowerFloor {
  /**
   * ID of the floor
   */
  public readonly id: number
  /**
   * Team number of the floor
   */
  public readonly teamNum: number
  /**
   * Background image of the floor
   */
  public readonly bgImage: ImageAssets
  /**
   * Index of the floor
   */
  public readonly index: number
  /**
   * Rooms of the floor
   */
  public readonly levels: TowerLevel[] = []
  /**
   * Ley Line Disorder descriptions
   */
  public readonly buffDescriptions: string[]

  /**
   * Create a TowerFloor
   * @param floorId ID of the floor
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
   * Get all tower floor ids
   * @returns All tower floor ids
   */
  public static getAllTowerFloorIds(): number[] {
    const towerFloorDatas = Object.values(
      Client._getCachedExcelBinOutputByName('TowerFloorExcelConfigData'),
    )
    return towerFloorDatas.map((t) => t.floorId as number)
  }
}
