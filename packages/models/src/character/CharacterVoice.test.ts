import { describe, expect, it } from 'vitest'

import { CharacterVoice } from '@/character/CharacterVoice'

describe('CharacterVoice', () => {
  it('should create with all properties', () => {
    const voice = new CharacterVoice({
      fetterId: 30461,
      cv: 'JP',
      hideCostumeList: [],
      showCostumeList: [],
      characterId: 10000046,
      type: 1,
      title: 'Hello',
      content: "Hey there! I'm Hu Tao!",
      tips: [],
      audioFileName: 'VO_hutao_hello',
    })

    expect(voice.fetterId).toBe(30461)
    expect(voice.cv).toBe('JP')
    expect(voice.hideCostumeList).toHaveLength(0)
    expect(voice.showCostumeList).toHaveLength(0)
    expect(voice.characterId).toBe(10000046)
    expect(voice.type).toBe(1)
    expect(voice.title).toBe('Hello')
    expect(voice.content).toContain('Hu Tao')
    expect(voice.tips).toHaveLength(0)
    expect(voice.audioFileName).toBe('VO_hutao_hello')
  })

  it('should handle fighting type voice', () => {
    const voice = new CharacterVoice({
      fetterId: 30462,
      cv: 'EN',
      hideCostumeList: [],
      showCostumeList: [],
      characterId: 10000046,
      type: 2,
      title: 'Elemental Skill',
      content: 'Cross over!',
      tips: [],
      audioFileName: 'VO_hutao_skill',
    })

    expect(voice.type).toBe(2)
    expect(voice.cv).toBe('EN')
  })

  it('should handle costume-specific voices', () => {
    const voice = new CharacterVoice({
      fetterId: 30463,
      cv: 'CN',
      hideCostumeList: [204601],
      showCostumeList: [204602],
      characterId: 10000046,
      type: 1,
      title: 'Greeting',
      content: 'Special greeting',
      tips: ['Only available with specific costume'],
      audioFileName: 'VO_hutao_greeting_costume',
    })

    expect(voice.hideCostumeList).toHaveLength(1)
    expect(voice.hideCostumeList[0]).toBe(204601)
    expect(voice.showCostumeList).toHaveLength(1)
    expect(voice.showCostumeList[0]).toBe(204602)
    expect(voice.tips).toHaveLength(1)
  })
})
