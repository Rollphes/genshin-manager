import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { TowerFloor } from '@/models/tower/TowerFloor'
import { convertToUTC } from '@/utils/convertToUTC'
import { JsonObject } from '@/utils/JsonParser'

/**
 * Class of Spiral Abyss Schedule
 */
export class TowerSchedule {
  /**
   * Spiral Abyss Schedule ID
   */
  public readonly id: number
  /**
   * Spiral Abyss Open date
   */
  public readonly openDate: Date
  /**
   * Spiral Abyss Close date
   */
  public readonly closeDate: Date
  /**
   * Spiral Abyss description
   */
  public readonly description: string
  /**
   * Blessing of the Abyssal Moon icon
   */
  public readonly icon: ImageAssets
  /**
   * Spiral Abyss Floors
   */
  public readonly floors: TowerFloor[]
  /**
   * Blessing of the Abyssal Moon name
   */
  public readonly buffName: string
  /**
   * Blessing of the Abyssal Moon descriptions
   */
  public readonly buffDescriptions: string[]

  /**
   * Create a TowerSchedule
   * @param scheduleId Spiral Abyss Schedule ID
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
    this.buffName =
      Client.cachedTextMap.get(String(towerScheduleJson.buffnameTextMapHash)) ||
      ''

    const dungeonLevelEntity = Client._getCachedExcelBinOutputByName(
      'DungeonLevelEntityConfigData',
    )
    this.buffDescriptions = Object.values(dungeonLevelEntity)
      .filter(
        (dungeonLevelEntityJson) =>
          dungeonLevelEntityJson.id === towerScheduleJson.monthlyLevelConfigId,
      )
      .map(
        (dungeonLevelEntityJson) =>
          Client.cachedTextMap.get(
            String(dungeonLevelEntityJson.descTextMapHash),
          ) || '',
      )
  }

  /**
   * Get all TowerSchedule IDs
   * @returns All TowerSchedule IDs
   */
  public static getAllTowerScheduleIds(): number[] {
    const towerSchedules = Object.values(
      Client._getCachedExcelBinOutputByName('TowerScheduleExcelConfigData'),
    )
    return towerSchedules.map((t) => t.scheduleId as number)
  }

  /**
   * Get all TowerSchedule IDs that are currently open
   * @returns All TowerSchedule IDs that are currently open
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
