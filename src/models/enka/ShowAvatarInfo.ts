import { CharacterCostume } from '@/models/character/CharacterCostume'
import { CharacterInfo } from '@/models/character/CharacterInfo'
import { APIShowAvatarInfo } from '@/types/EnkaTypes'

/**
 * Class of the character preview obtained from EnkaNetwork
 */
export class ShowAvatarInfo extends CharacterCostume {
  /**
   * Character level
   */
  public readonly level: number

  /**
   * Create a ShowAvatarInfo
   * @param data Data from EnkaNetwork
   */
  constructor(data: APIShowAvatarInfo) {
    const characterData = new CharacterInfo(data.avatarId)
    super(data.costumeId ?? characterData.defaultCostumeId)
    this.level = data.level
  }
}
