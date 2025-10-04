import { Client } from '@/client'

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
   * @param fetterId fetter ID in the story
   */
  constructor(fetterId: number) {
    this.fetterId = fetterId
    const fetterStoryJson = Client._getJsonFromCachedExcelBinOutput(
      'FetterStoryExcelConfigData',
      fetterId,
    )
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
    const fetterStoriesJson = Object.values(
      Client._getCachedExcelBinOutputByName('FetterStoryExcelConfigData'),
    )
    return fetterStoriesJson
      .filter(
        (story): story is NonNullable<typeof story> =>
          story?.fetterId !== undefined,
      )
      .map((story) => story.fetterId)
  }

  /**
   * Get all Fetter IDs in the character's story
   * @param characterId character ID
   * @returns all fetter IDs in the character's story
   */
  public static getAllFetterIdsByCharacterId(characterId: number): number[] {
    const fetterStoriesJson = Object.values(
      Client._getCachedExcelBinOutputByName('FetterStoryExcelConfigData'),
    )
    return fetterStoriesJson
      .filter(
        (story): story is NonNullable<typeof story> =>
          story !== undefined && story.avatarId === characterId,
      )
      .map((story) => story.fetterId)
  }
}
