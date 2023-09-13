import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { TowerLevel } from '@/models/tower/TowerLevel'
import { JsonObject } from '@/utils/JsonParser'

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
   * Ley Line Disorder description
   */
  public readonly buffDescription: string

  constructor(floorId: number) {
    this.id = floorId

    const towerFloorJson = Client.cachedExcelBinOutputGetter(
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
    const dungeonLevelEntityJson = Client.cachedExcelBinOutputGetter(
      'DungeonLevelEntityConfigData',
      towerFloorJson.floorLevelConfigId as number,
    )
    this.buffDescription =
      Client.cachedTextMap.get(
        String(dungeonLevelEntityJson.descTextMapHash),
      ) || ''
  }

  /**
   * Get all tower floor ids
   * @returns All tower floor ids
   */
  public static getAllTowerFloorIds() {
    const towerFloorDatas = Object.values(
      Client.cachedExcelBinOutput
        .get('TowerFloorExcelConfigData')
        ?.get() as JsonObject,
    ) as JsonObject[]
    return towerFloorDatas.map((t) => t.floorId as number)
  }
}
