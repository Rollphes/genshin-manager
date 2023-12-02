import { Client } from '@/client/Client'

/**
 * Class of character's stories
 */
export class CharacterStories {
  /**
   * Character ID
   */
  public readonly characterId: number
  /**
   * Stories
   */
  public readonly stories: {
    /**
     * Story ID
     */
    title: string
    /**
     * Content
     */
    content: string
    /**
     * Tips
     */
    tips: string[]
    /**
     * fetter ID
     */
    fetterId: number
  }[]

  /**
   * Create a CharacterStories
   * @param characterId Character ID
   */
  constructor(characterId: number) {
    this.characterId = characterId
    const fetterStoriesJson = Object.values(
      Client._getCachedExcelBinOutputByName('FetterStoryExcelConfigData'),
    ).filter((story) => story.avatarId === characterId)
    this.stories = fetterStoriesJson.map((story) => ({
      title:
        Client.cachedTextMap.get(String(story.storyTitleTextMapHash)) ||
        Client.cachedTextMap.get(String(story.storyTitle2TextMapHash)) ||
        '',
      content:
        Client.cachedTextMap.get(String(story.storyContextTextMapHash)) ||
        Client.cachedTextMap.get(String(story.storyContext2TextMapHash)) ||
        '',
      tips: (story.tips as number[])
        .map((tip) => Client.cachedTextMap.get(String(tip)))
        .filter((tip): tip is string => tip !== undefined),
      fetterId: story.fetterId as number,
    }))
  }
}
