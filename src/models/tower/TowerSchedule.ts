import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { TowerFloor } from '@/models/tower/TowerFloor'
import { convertToUTC } from '@/utils/convertToUTC'
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
    const towerScheduleJson = Client._getJsonFromCachedExcelBinOutput(
      'TowerScheduleExcelConfigData',
      this.id,
    )
    const schedules = towerScheduleJson.schedules as JsonObject[]
    this.openDate = convertToUTC(schedules[0].openTime as string, 'os_cht')
    this.closeDate = convertToUTC(
      towerScheduleJson.closeTime as string,
      'os_cht',
    )
    this.description =
      Client.cachedTextMap.get(String(towerScheduleJson.descTextMapHash)) || ''
    this.icon = new ImageAssets(towerScheduleJson.icon as string)
    this.floors = (schedules[0].floorList as number[]).map(
      (floorId) => new TowerFloor(floorId),
    )
    const dungeonLevelEntityJson = Client._getJsonFromCachedExcelBinOutput(
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
      Client._getCachedExcelBinOutputByName('TowerScheduleExcelConfigData'),
    )
    return towerSchedules.map((t) => t.scheduleId as number)
  }

  /**
   * Get all TowerSchedule ids that are currently open
   * @returns All TowerSchedule ids that are currently open
   */
  public static getNowTowerScheduleIds(): number[] {
    const towerSchedules = Object.values(
      Client._getCachedExcelBinOutputByName('TowerScheduleExcelConfigData'),
    )
    const now = new Date()
    return towerSchedules
      .filter(
        (t) =>
          now.getTime() >=
            convertToUTC(
              (t.schedules as JsonObject[])[0].openTime as string,
              'os_cht',
            ).getTime() &&
          now.getTime() <=
            convertToUTC(t.closeTime as string, 'os_cht').getTime(),
      )
      .map((t) => t.scheduleId as number)
  }
}
