import { describe, expect, it } from 'vitest'

import { AudioAssets } from '@/assets/AudioAssets'

describe('AudioAssets', () => {
  it('should construct URL with cv and characterId', () => {
    const audio = new AudioAssets({
      name: 'VO_hutao_hello',
      audioBaseURL: 'https://audio.example.com',
      cv: 'Japanese',
      characterId: 10000046,
    })

    expect(audio.name).toBe('VO_hutao_hello')
    expect(audio.url).toBe(
      'https://audio.example.com/Japanese/10000046/VO_hutao_hello.ogg',
    )
    expect(audio.mihoyoURL).toBe(
      'https://upload-os-bbs.mihoyo.com/game_record/genshin/Japanese/10000046/VO_hutao_hello.ogg',
    )
  })

  it('should construct URL without cv and characterId', () => {
    const audio = new AudioAssets({
      name: 'VO_general',
      audioBaseURL: 'https://audio.example.com',
      cv: undefined,
      characterId: undefined,
    })

    expect(audio.url).toBe('https://audio.example.com/VO_general.ogg')
  })

  it('should return empty URL for empty name', () => {
    const audio = new AudioAssets({
      name: '',
      audioBaseURL: 'https://audio.example.com',
      cv: 'Japanese',
      characterId: 10000046,
    })

    expect(audio.url).toBe('')
    expect(audio.mihoyoURL).toBe('')
  })
})
