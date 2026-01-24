import type { ShowAvatarInfoResponse } from '@/adapter/input/types/api/enkaNetwork/responses'
import { CharacterCostume } from '@/adapter/output/character/CharacterCostume'
import { CharacterInfo } from '@/adapter/output/character/CharacterInfo'
import { Element } from '@/domain/types/types'

/**
 * Provides summary character information for display from EnkaNetwork data
 */
export class CharacterPreview extends CharacterCostume {
  /**
   * Character level
   */
  public readonly level: number
  /**
   * Character element
   * @warning May be undefined if character data hasn't been updated since version 5.0+ or if element data is missing from API response.
   */
  public readonly element: Element | undefined
  /**
   * Character constellation level (0-6)
   * @warning Returns 0 when player has disabled constellation visibility in privacy settings.
   * @see PlayerDetail
   */
  public readonly collectionLevel: number | undefined
  /**
   * Data from EnkaNetwork
   */
  public readonly data: ShowAvatarInfoResponse

  /**
   * Create a character preview
   * @param data - data from EnkaNetwork
   */
  constructor(data: ShowAvatarInfoResponse) {
    const characterData = new CharacterInfo(data.avatarId)
    super(data.costumeId ?? characterData.defaultCostumeId)
    this.level = data.level
    this.element = characterData.element
    this.collectionLevel = data.talentLevel ?? 0
    this.data = data
  }
}
