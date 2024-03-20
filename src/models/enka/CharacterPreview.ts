import { CharacterCostume } from '@/models/character/CharacterCostume'
import { CharacterInfo } from '@/models/character/CharacterInfo'
import { APIShowAvatarInfo } from '@/types/enkaNetwork'

/**
 * Class of the character preview obtained from EnkaNetwork
 */
export class CharacterPreview extends CharacterCostume {
  /**
   * Character level
   */
  public readonly level: number
  /**
   * Data from EnkaNetwork
   */
  public readonly data: APIShowAvatarInfo

  /**
   * Create a character preview
   * @param data Data from EnkaNetwork
   */
  constructor(data: APIShowAvatarInfo) {
    const characterData = new CharacterInfo(data.avatarId)
    super(data.costumeId ?? characterData.defaultCostumeId)
    this.level = data.level
    this.data = data
  }
}
