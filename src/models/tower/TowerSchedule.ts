import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { TowerFloor } from '@/models/tower/TowerFloor'
import { convertCSTtoUTC } from '@/utils/convertCSTtoUTC'
import { JsonObject } from '@/utils/JsonParser'

/**
 * Class of Spiral Abyss Schedule.
 */
export class TowerSchedule {
  /**
   * ID of the Spiral Abyss
   */
  public readonly id: number
  /**
   * Open date of the Spiral Abyss
   */
  public readonly openDate: Date
  /**
   * Close date of the Spiral Abyss
   */
  public readonly closeDate: Date
  /**
   * Description of the Spiral Abyss
   */
  public readonly description: string
  /**
   * Icon of the Spiral Abyss
   */
  public readonly icon: ImageAssets
  /**
   * Floors of the Spiral Abyss
   */
  public readonly floors: TowerFloor[]
  /**
   * Blessing of the Abyssal Moon name
   */
  public readonly buffName: string
  /**
   * Blessing of the Abyssal Moon description
   */
  public readonly buffDescription: string

  /**
   * Create a TowerSchedule
   * @param scheduleId ID of the Spiral Abyss Schedule
   */
  constructor(scheduleId: number) {
    this.id = scheduleId
    const towerScheduleJson = Client.cachedExcelBinOutputGetter(
      'TowerScheduleExcelConfigData',
      this.id,
    )
    const schedules = towerScheduleJson.schedules as JsonObject[]
    this.openDate = convertCSTtoUTC(schedules[0].openTime as string)
    this.closeDate = convertCSTtoUTC(towerScheduleJson.closeTime as string)
    this.description =
      Client.cachedTextMap.get(String(towerScheduleJson.descTextMapHash)) || ''
    this.icon = new ImageAssets(towerScheduleJson.icon as string)
    this.floors = (schedules[0].floorList as number[]).map(
      (floorId) => new TowerFloor(floorId),
    )
    const dungeonLevelEntityJson = Client.cachedExcelBinOutputGetter(
      'DungeonLevelEntityConfigData',
      towerScheduleJson.monthlyLevelConfigId as number,
    )
    this.buffName =
      Client.cachedTextMap.get(String(towerScheduleJson.buffnameTextMapHash)) ||
      ''
    this.buffDescription =
      Client.cachedTextMap.get(
        String(dungeonLevelEntityJson.descTextMapHash),
      ) || ''
  }

  /**
   * Get all TowerSchedule ids
   * @returns All TowerSchedule ids
   */
  public static getAllTowerScheduleIds(): number[] {
    const towerSchedules = Object.values(
      Client.cachedExcelBinOutput
        .get('TowerScheduleExcelConfigData')
        ?.get() as JsonObject,
    ) as JsonObject[]
    return towerSchedules.map((t) => t.scheduleId as number)
  }
}
