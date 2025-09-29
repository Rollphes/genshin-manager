import { z } from 'zod'

import { Client } from '@/client/Client'
import { StatProperty } from '@/models/StatProperty'
import { FightPropType } from '@/types'
import { JsonObject } from '@/types/json'
import { ValidationHelper } from '@/utils/ValidationHelper'

/**
 * Handles character ascension data including promote levels, costs, and stat bonuses
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

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

  /**
   * Create a character ascension
   * @param characterId character ID
   * @param promoteLevel character promote level (0-6). Default: 0
   */
  constructor(characterId: number, promoteLevel = 0) {
    this.id = characterId
    this.promoteLevel = promoteLevel
    const maxPromoteLevel = CharacterAscension.getMaxPromoteLevelByCharacterId(
      this.id,
    )
    const promoteLevelSchema = z
      .number()
      .min(0, { message: 'promoteLevel must be at least 0' })
      .max(maxPromoteLevel, {
        message: `promoteLevel must be at most ${maxPromoteLevel.toString()}`,
      })
    void ValidationHelper.validate(promoteLevelSchema, this.promoteLevel, {
      propertyKey: 'promoteLevel',
    })
    const avatarJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarExcelConfigData',
      this.id,
    )
    const avatarPromoteJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarPromoteExcelConfigData',
      avatarJson.avatarPromoteId as number,
    )[this.promoteLevel] as JsonObject
    this.costItems = (avatarPromoteJson.costItems as JsonObject[])
      .filter(
        (costItem) => costItem.id !== undefined && costItem.count !== undefined,
      )
      .map((costItem) => {
        return {
          id: costItem.id as number,
          count: costItem.count as number,
        }
      })
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
   * @param characterId character ID
   * @returns max promote level
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
