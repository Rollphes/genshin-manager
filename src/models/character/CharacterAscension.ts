import { Client } from '@/client/Client'
import { OutOfRangeError } from '@/errors/OutOfRangeError'
import { FightPropType, StatProperty } from '@/models/StatProperty'
import { JsonObject } from '@/utils/JsonParser'

/**
 * Class of character ascension
 */
export class CharacterAscension {
  /**
   * Character ID
   */
  public readonly id: number
  /**
   * Character promote level
   */
  public readonly promoteLevel: number
  /**
   * Character ascension costItems
   */
  public readonly costItems: {
    /**
     * Cost item ID(material ID)
     */
    id: number
    /**
     * Cost item count
     */
    count: number
  }[]
  /**
   * Character ascension costMora
   */
  public readonly costMora: number
  /**
   * Character ascension addProps
   */
  public readonly addProps: StatProperty[]
  /**
   * Character ascension unlockMaxLevel
   */
  public readonly unlockMaxLevel: number

  /**
   * Create a character ascension
   * @param characterId Character ID
   * @param promoteLevel Character promote level (0-6). Default: 0
   */
  constructor(characterId: number, promoteLevel: number = 0) {
    this.id = characterId
    this.promoteLevel = promoteLevel
    const maxPromoteLevel = CharacterAscension.getMaxPromoteLevelByCharacterId(
      this.id,
    )
    if (this.promoteLevel < 0 || this.promoteLevel > maxPromoteLevel) {
      throw new OutOfRangeError(
        'promoteLevel',
        this.promoteLevel,
        0,
        maxPromoteLevel,
      )
    }
    const avatarJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarExcelConfigData',
      this.id,
    )
    const avatarPromoteJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarPromoteExcelConfigData',
      avatarJson.avatarPromoteId as number,
    )[this.promoteLevel] as JsonObject
    this.costItems = (avatarPromoteJson.costItems as JsonObject[])
      .map((costItem) => {
        return {
          id: costItem.id as number,
          count: costItem.count as number,
        }
      })
      .filter(
        (costItem) => costItem.id !== undefined && costItem.count !== undefined,
      )
    this.costMora = (avatarPromoteJson.scoinCost as number | undefined) ?? 0
    this.addProps = (avatarPromoteJson.addProps as JsonObject[]).map(
      (addProp) =>
        new StatProperty(
          addProp.propType as FightPropType,
          (addProp.value ?? 0) as number,
        ),
    )
    this.unlockMaxLevel = avatarPromoteJson.unlockMaxLevel as number
  }

  /**
   * Get max promote level by character ID
   * @param characterId Character ID
   * @returns Max promote level
   */
  public static getMaxPromoteLevelByCharacterId(characterId: number): number {
    const avatarJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarExcelConfigData',
      characterId,
    )
    const avatarPromoteJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarPromoteExcelConfigData',
      avatarJson.avatarPromoteId as number,
    )
    return Math.max(
      ...(Object.values(avatarPromoteJson) as JsonObject[]).map(
        (promote) => (promote.promoteLevel ?? 0) as number,
      ),
    )
  }
}
