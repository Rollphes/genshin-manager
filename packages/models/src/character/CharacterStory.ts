/**
 * Constructor data for CharacterStory
 */
export interface CharacterStoryData {
  /** Fetter ID */
  readonly fetterId: number
  /** Character ID */
  readonly characterId: number
  /** Story title */
  readonly title: string
  /** Story content */
  readonly content: string
  /** Story tips */
  readonly tips: readonly string[]
}

/**
 * Character story entry.
 * Pure DTO.
 */
export class CharacterStory {
  /** Fetter ID */
  public readonly fetterId: number
  /** Character ID */
  public readonly characterId: number
  /** Story title */
  public readonly title: string
  /** Story content */
  public readonly content: string
  /** Story tips */
  public readonly tips: readonly string[]

  /**
   * Create a CharacterStory
   * @param data - Pre-resolved story data
   */
  constructor(data: CharacterStoryData) {
    this.fetterId = data.fetterId
    this.characterId = data.characterId
    this.title = data.title
    this.content = data.content
    this.tips = data.tips
  }
}
