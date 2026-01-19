import { z } from 'zod'

import { Client } from '@/client/Client'
import { AssetNotFoundError } from '@/errors/assets/AssetNotFoundError'
import { StatProperty } from '@/models/StatProperty'
import { CostItem } from '@/types/types'
import { validate } from '@/utils/validation/validate'

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
  public readonly costItems: CostItem[]
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
   * @param promoteLevel character promote level (0-6)
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
    void validate(promoteLevelSchema, this.promoteLevel, {
      propertyKey: 'promoteLevel',
    })
    const avatarJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarExcelConfigData',
      this.id,
    )
    const avatarPromoteJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarPromoteExcelConfigData',
      avatarJson.avatarPromoteId,
    )[this.promoteLevel]
    if (!avatarPromoteJson) {
      throw new AssetNotFoundError(
        `promoteLevel ${String(this.promoteLevel)}`,
        'AvatarPromoteExcelConfigData',
      )
    }
    this.costItems = avatarPromoteJson.costItems
      .filter((costItem) => costItem.id !== 0 && costItem.count !== 0)
      .map((costItem) => {
        return {
          id: costItem.id,
          count: costItem.count,
        }
      })
    this.costMora = avatarPromoteJson.scoinCost
    this.addProps = avatarPromoteJson.addProps.map(
      (addProp) => new StatProperty(addProp.propType, addProp.value),
    )
    this.unlockMaxLevel = avatarPromoteJson.unlockMaxLevel
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
      avatarJson.avatarPromoteId,
    )
    return Math.max(
      ...Object.values(avatarPromoteJson).map((promote) =>
        promote ? promote.promoteLevel : 0,
      ),
    )
  }
}
