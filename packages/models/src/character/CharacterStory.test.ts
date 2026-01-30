import { describe, expect, it } from 'vitest'

import { CharacterStory } from '@/character/CharacterStory'

describe('CharacterStory', () => {
  it('should create with all properties', () => {
    const story = new CharacterStory({
      fetterId: 10461,
      characterId: 10000046,
      title: 'Character Details',
      content: 'Hu Tao is the 77th Director of the Wangsheng Funeral Parlor.',
      tips: [],
    })

    expect(story.fetterId).toBe(10461)
    expect(story.characterId).toBe(10000046)
    expect(story.title).toBe('Character Details')
    expect(story.content).toContain('Hu Tao')
    expect(story.tips).toHaveLength(0)
  })

  it('should handle story with tips', () => {
    const story = new CharacterStory({
      fetterId: 10462,
      characterId: 10000046,
      title: 'Story 1',
      content: 'A story about Hu Tao.',
      tips: ['Tip 1', 'Tip 2'],
    })

    expect(story.tips).toHaveLength(2)
    expect(story.tips[0]).toBe('Tip 1')
  })

  it('should handle different characters', () => {
    const amberStory = new CharacterStory({
      fetterId: 20211,
      characterId: 10000021,
      title: 'Character Details',
      content: 'Amber is a member of the Knights of Favonius.',
      tips: [],
    })

    expect(amberStory.characterId).toBe(10000021)
    expect(amberStory.content).toContain('Amber')
  })
})
