import { Character } from '@/models/character/Character'
import { Costume } from '@/models/character/Costume'
import { APIShowAvatarInfo } from '@/types/EnkaTypes'

export class ShowAvatarInfo extends Costume {
  /**
   * Level of the character.
   */
  readonly level: number

  constructor(data: APIShowAvatarInfo) {
    const characterData = new Character(data.avatarId)
    super(data.costumeId ?? characterData.defaultCostumeId)
    this.level = data.level
  }
}
