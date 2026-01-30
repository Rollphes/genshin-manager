import type { CVType } from '@/types/types'

/**
 * Constructor data for CharacterVoice
 */
export interface CharacterVoiceData {
  /** Fetter ID */
  readonly fetterId: number
  /** CV language */
  readonly cv: CVType
  /** Costume IDs that hide this voice */
  readonly hideCostumeList: readonly number[]
  /** Costume IDs that show this voice */
  readonly showCostumeList: readonly number[]
  /** Character ID */
  readonly characterId: number
  /** Voice type (1: non-fighting, 2: fighting) */
  readonly type: number
  /** Voice title */
  readonly title: string
  /** Voice content */
  readonly content: string
  /** Voice tips */
  readonly tips: readonly string[]
  /** Audio file name */
  readonly audioFileName: string
}

/**
 * Character voice entry.
 * Pure DTO.
 */
export class CharacterVoice {
  /** Fetter ID */
  public readonly fetterId: number
  /** CV language */
  public readonly cv: CVType
  /** Costume IDs that hide this voice */
  public readonly hideCostumeList: readonly number[]
  /** Costume IDs that show this voice */
  public readonly showCostumeList: readonly number[]
  /** Character ID */
  public readonly characterId: number
  /** Voice type (1: non-fighting, 2: fighting) */
  public readonly type: number
  /** Voice title */
  public readonly title: string
  /** Voice content */
  public readonly content: string
  /** Voice tips */
  public readonly tips: readonly string[]
  /** Audio file name */
  public readonly audioFileName: string

  /**
   * Create a CharacterVoice
   * @param data - Pre-resolved voice data
   */
  constructor(data: CharacterVoiceData) {
    this.fetterId = data.fetterId
    this.cv = data.cv
    this.hideCostumeList = data.hideCostumeList
    this.showCostumeList = data.showCostumeList
    this.characterId = data.characterId
    this.type = data.type
    this.title = data.title
    this.content = data.content
    this.tips = data.tips
    this.audioFileName = data.audioFileName
  }
}
