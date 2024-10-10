import { Client } from '@/client/Client'

/**
 * Class of character's story
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
   * @param fetterId Fetter ID in the story
   */
  constructor(fetterId: number) {
    this.fetterId = fetterId
    const fetterStoryJson = Client._getJsonFromCachedExcelBinOutput(
      'FetterStoryExcelConfigData',
      fetterId,
    )
    this.characterId = fetterStoryJson.avatarId as number
    this.title =
      Client._cachedTextMap.get(
        String(fetterStoryJson.storyTitleTextMapHash),
      ) ||
      Client._cachedTextMap.get(
        String(fetterStoryJson.storyTitle2TextMapHash),
      ) ||
      ''
    this.content =
      Client._cachedTextMap.get(
        String(fetterStoryJson.storyContextTextMapHash),
      ) ||
      Client._cachedTextMap.get(
        String(fetterStoryJson.storyContext2TextMapHash),
      ) ||
      ''
    this.tips = (fetterStoryJson.tips as number[])
      .map((tip) => Client._cachedTextMap.get(String(tip)))
      .filter((tip): tip is string => tip !== undefined)
  }

  /**
   * Get all Fetter IDs in the story
   * @returns All Fetter IDs in the story
   */
  public static get allFetterIds(): number[] {
    const fetterStoriesJson = Object.values(
      Client._getCachedExcelBinOutputByName('FetterStoryExcelConfigData'),
    )
    return fetterStoriesJson.map((story) => story.fetterId as number)
  }

  /**
   * Get all Fetter IDs in the character's story
   * @param characterId Character ID
   * @returns All fetter IDs in the character's story
   */
  public static getAllFetterIdsByCharacterId(characterId: number): number[] {
    const fetterStoriesJson = Object.values(
      Client._getCachedExcelBinOutputByName('FetterStoryExcelConfigData'),
    )
    return fetterStoriesJson
      .filter((story) => story.avatarId === characterId)
      .map((story) => story.fetterId as number)
  }
}
