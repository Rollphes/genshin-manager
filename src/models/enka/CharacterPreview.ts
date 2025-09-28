import { CharacterCostume } from '@/models/character/CharacterCostume'
import { CharacterInfo } from '@/models/character/CharacterInfo'
import { Element } from '@/types'
import { APIShowAvatarInfo } from '@/types/enkaNetwork'

const elementIdMap: Record<number, Element> = {
  1: 'Pyro',
  2: 'Hydro',
  3: 'Dendro',
  4: 'Electro',
  5: 'Cryo',
  7: 'Anemo',
  8: 'Geo',
} as const

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
   * @see {@link PlayerDetail.isShowCharacterPreviewConstellation}
   */
  public readonly collectionLevel: number | undefined
  /**
   * Data from EnkaNetwork
   */
  public readonly data: APIShowAvatarInfo

  /**
   * Create a character preview
   * @param data data from EnkaNetwork
   */
  constructor(data: APIShowAvatarInfo) {
    const characterData = new CharacterInfo(data.avatarId)
    super(data.costumeId ?? characterData.defaultCostumeId)
    this.level = data.level
    this.element = data.energyType ? elementIdMap[data.energyType] : undefined
    this.collectionLevel = data.talentLevel ?? 0
    this.data = data
  }
}
