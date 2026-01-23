import { z } from 'zod'

import { Client } from '@/application/client/Client'
import { toEnum } from '@/domain/typeGuards/toEnum'
import { FightProp } from '@/domain/types/enums'
import { CostItem } from '@/domain/types/types'
import { validate } from '@/domain/validation/validate'
import { AssetNotFoundError } from '@/infrastructure/errors/AssetNotFoundError'
import { StatProperty } from '@/interface/StatProperty'

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
   * @param characterId - character ID
   * @param promoteLevel - character promote level (0-6)
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
    const avatarJson = Client._findBy('AvatarExcelConfigData', 'id', this.id)
    if (!avatarJson)
      throw new AssetNotFoundError(String(this.id), 'AvatarExcelConfigData')

    const avatarPromoteJson = Client._filterBy(
      'AvatarPromoteExcelConfigData',
      'avatarPromoteId',
      avatarJson.avatarPromoteId,
    ).find((p) => p.promoteLevel === this.promoteLevel)
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
      (addProp, index) =>
        new StatProperty(
          toEnum(FightProp, addProp.propType, 'FightProp', {
            source: 'AvatarPromoteExcelConfigData',
            recordId: `${String(avatarJson.avatarPromoteId)}[${String(this.promoteLevel)}]`,
            path: `addProps[${String(index)}].propType`,
          }),
          addProp.value,
        ),
    )
    this.unlockMaxLevel = avatarPromoteJson.unlockMaxLevel
  }

  /**
   * Get max promote level by character ID
   * @param characterId - character ID
   * @returns max promote level
   * @throws {@link AssetNotFoundError} - When the avatar data is not found
   */
  public static getMaxPromoteLevelByCharacterId(characterId: number): number {
    const avatarJson = Client._findBy(
      'AvatarExcelConfigData',
      'id',
      characterId,
    )
    if (!avatarJson)
      throw new AssetNotFoundError(String(characterId), 'AvatarExcelConfigData')

    const avatarPromoteJson = Client._filterBy(
      'AvatarPromoteExcelConfigData',
      'avatarPromoteId',
      avatarJson.avatarPromoteId,
    )
    return Math.max(...avatarPromoteJson.map((promote) => promote.promoteLevel))
  }
}
