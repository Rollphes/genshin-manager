import { Client } from '@/application/client/Client'

/**
 * Contains character background story content and narrative elements
 */
export class CharacterStory {
  /**
   * fetter ID in the story
   */
  public readonly fetterId: number
  /**
   * Character ID
   */
  public readonly characterId: number
  /**
   * Story Title
   */
  public readonly title: string
  /**
   * Story Content
   */
  public readonly content: string
  /**
   * Story Tips
   */
  public readonly tips: string[]

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

  /**
   * Create a CharacterStories
   * @param fetterId - fetter ID in the story
   */
  constructor(fetterId: number) {
    this.fetterId = fetterId
    const fetterStoryJson = Client._findBy(
      'FetterStoryExcelConfigData',
      'fetterId',
      fetterId,
    )
    if (!fetterStoryJson) {
      throw new Error(
        `FetterStoryExcelConfigData not found for fetterId ${String(fetterId)}`,
      )
    }

    this.characterId = fetterStoryJson.avatarId
    const storyTitleTextMapHash = fetterStoryJson.storyTitleTextMapHash
    const storyTitle2TextMapHash = fetterStoryJson.storyTitle2TextMapHash
    const storyContextTextMapHash = fetterStoryJson.storyContextTextMapHash
    const storyContext2TextMapHash = fetterStoryJson.storyContext2TextMapHash
    this.title =
      Client._cachedTextMap.get(storyTitleTextMapHash) ??
      Client._cachedTextMap.get(storyTitle2TextMapHash) ??
      ''
    this.content =
      Client._cachedTextMap.get(storyContextTextMapHash) ??
      Client._cachedTextMap.get(storyContext2TextMapHash) ??
      ''
    this.tips = fetterStoryJson.tips
      .map((tip) => Client._cachedTextMap.get(tip))
      .filter((tip): tip is string => tip !== undefined)
  }

  /**
   * Get all Fetter IDs in the story
   * @returns all Fetter IDs in the story
   */
  public static get allFetterIds(): number[] {
    const fetterStoriesJson = Client._getAll('FetterStoryExcelConfigData')
    return fetterStoriesJson.map((story) => story.fetterId)
  }

  /**
   * Get all Fetter IDs in the character's story
   * @param characterId - character ID
   * @returns all fetter IDs in the character's story
   */
  public static getAllFetterIdsByCharacterId(characterId: number): number[] {
    const fetterStoriesJson = Client._getAll('FetterStoryExcelConfigData')
    return fetterStoriesJson
      .filter((story) => story.avatarId === characterId)
      .map((story) => story.fetterId)
  }
}
