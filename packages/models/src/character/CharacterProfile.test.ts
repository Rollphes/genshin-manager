import { describe, expect, it } from 'vitest'

import { CharacterProfile } from '@/character/CharacterProfile'

describe('CharacterProfile', () => {
  it('should create with all properties', () => {
    const birthDate = new Date(2000, 6, 15)
    const profile = new CharacterProfile({
      characterId: 10000046,
      fetterId: 1046,
      birthDate,
      native: 'Liyue',
      vision: 'Pyro',
      constellation: 'Papilio Charontis',
      title: '77th Director of the Wangsheng Funeral Parlor',
      detail: 'Hu Tao is the 77th Director...',
      assocType: 'ASSOC_TYPE_LIYUE',
      cv: {
        JP: 'Rie Takahashi',
        CN: '陶典',
        EN: 'Brianna Knickerbocker',
        KR: '김하루',
      },
    })

    expect(profile.characterId).toBe(10000046)
    expect(profile.fetterId).toBe(1046)
    expect(profile.birthDate).toBe(birthDate)
    expect(profile.native).toBe('Liyue')
    expect(profile.vision).toBe('Pyro')
    expect(profile.constellation).toBe('Papilio Charontis')
    expect(profile.title).toContain('77th Director')
    expect(profile.detail).toContain('Hu Tao')
    expect(profile.assocType).toBe('ASSOC_TYPE_LIYUE')
    expect(profile.cv.JP).toBe('Rie Takahashi')
    expect(profile.cv.CN).toBe('陶典')
    expect(profile.cv.EN).toBe('Brianna Knickerbocker')
    expect(profile.cv.KR).toBe('김하루')
  })

  it('should handle undefined birthDate', () => {
    const profile = new CharacterProfile({
      characterId: 10000005,
      fetterId: 1005,
      birthDate: undefined,
      native: 'Unknown',
      vision: '',
      constellation: 'Viator',
      title: 'Traveler',
      detail: '',
      assocType: '',
      cv: { JP: '', CN: '', EN: '', KR: '' },
    })

    expect(profile.birthDate).toBeUndefined()
  })

  it('should handle different characters', () => {
    const amberProfile = new CharacterProfile({
      characterId: 10000021,
      fetterId: 1021,
      birthDate: new Date(2000, 7, 10),
      native: 'Mondstadt',
      vision: 'Pyro',
      constellation: 'Lepus',
      title: 'Outrider',
      detail: 'A member of the Knights of Favonius',
      assocType: 'ASSOC_TYPE_MONDSTADT',
      cv: {
        JP: 'Manaka Iwami',
        CN: '蔡书瑾',
        EN: 'Kelly Baskin',
        KR: '김연우',
      },
    })

    expect(amberProfile.characterId).toBe(10000021)
    expect(amberProfile.native).toBe('Mondstadt')
  })
})
