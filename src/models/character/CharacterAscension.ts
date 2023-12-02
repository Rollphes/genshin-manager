import { Client } from '@/client/Client'
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
    const avatarJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarExcelConfigData',
      this.id,
    )
    const avatarPromoteJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarPromoteExcelConfigData',
      avatarJson.avatarPromoteId as number,
    )[this.promoteLevel] as JsonObject
    this.costItems = (avatarPromoteJson.costItems as JsonObject[]).map(
      (costItem) => {
        return {
          id: costItem.id as number,
          count: costItem.count as number,
        }
      },
    )
    this.costMora = avatarPromoteJson.scoinCost as number
    this.addProps = (avatarPromoteJson.addProps as JsonObject[]).map(
      (addProp) =>
        new StatProperty(
          addProp.propType as FightPropType,
          (addProp.value ?? 0) as number,
        ),
    )
    this.unlockMaxLevel = avatarPromoteJson.unlockMaxLevel as number
  }
}
