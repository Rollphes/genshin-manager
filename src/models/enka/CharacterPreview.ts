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
 * Class of the character preview obtained from EnkaNetwork
 */
export class CharacterPreview extends CharacterCostume {
  /**
   * Character level
   */
  public readonly level: number
  /**
   * Character element
   * @warn If this value is undefined, then it hasn't been updated with 5.0~, or the element is missing.
   */
  public readonly element: Element | undefined
  /**
   * Character collection level
   * @warn If isShowCharacterPreviewConstellation is false, then this value is 0.
   * @see {@link PlayerDetail.isShowCharacterPreviewConstellation}
   */
  public readonly collectionLevel: number | undefined
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
    this.element = data.energyType ? elementIdMap[data.energyType] : undefined
    this.collectionLevel = data.talentLevel ?? 0
    this.data = data
  }
}
