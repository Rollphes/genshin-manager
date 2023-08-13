import { Client } from '@/client/Client'

interface CharacterVoice {
  CH: string
  JP: string
  EN: string
  KR: string
}

export type AssocType =
  | 'ASSOC_TYPE_FATUI'
  | 'ASSOC_TYPE_INAZUMA'
  | 'ASSOC_TYPE_LIYUE'
  | 'ASSOC_TYPE_MAINACTOR'
  | 'ASSOC_TYPE_MONDSTADT'
  | 'ASSOC_TYPE_RANGER'
  | 'ASSOC_TYPE_SUMERU'

export class Profile {
  public readonly characterId: number
  public readonly fetterId: number
  public readonly birthDate: Date | undefined
  public readonly native: string
  public readonly vision: string
  public readonly constellation: string
  public readonly title: string
  public readonly detail: string
  public readonly assocType: AssocType
  public readonly cv: CharacterVoice

  constructor(characterId: number) {
    this.characterId = characterId
    const fetterInfoJson = Client.cachedExcelBinOutputGetter(
      'FetterInfoExcelConfigData',
      this.characterId,
    )
    this.fetterId = fetterInfoJson.fetterId as number
    const birthMonth = fetterInfoJson.infoBirthMonth as number | undefined
    const birthDay = fetterInfoJson.infoBirthDay as number | undefined
    this.birthDate = birthMonth ? new Date(0, birthMonth, birthDay) : undefined
    this.native =
      Client.cachedTextMap.get(
        String(fetterInfoJson.avatarNativeTextMapHash),
      ) || ''
    this.vision =
      Client.cachedTextMap.get(
        String(fetterInfoJson.avatarVisionAfterTextMapHash),
      ) ||
      Client.cachedTextMap.get(
        String(fetterInfoJson.avatarVisionBeforTextMapHash),
      ) ||
      ''
    this.constellation =
      Client.cachedTextMap.get(
        String(fetterInfoJson.avatarConstellationAfterTextMapHash),
      ) ||
      Client.cachedTextMap.get(
        String(fetterInfoJson.avatarConstellationBeforTextMapHash),
      ) ||
      ''
    this.title =
      Client.cachedTextMap.get(String(fetterInfoJson.avatarTitleTextMapHash)) ||
      ''
    this.detail =
      Client.cachedTextMap.get(
        String(fetterInfoJson.avatarDetailTextMapHash),
      ) || ''
    this.assocType = fetterInfoJson.avatarAssocType as AssocType
    this.cv = {
      CH:
        Client.cachedTextMap.get(String(fetterInfoJson.cvChineseTextMapHash)) ||
        '',
      JP:
        Client.cachedTextMap.get(
          String(fetterInfoJson.cvJapaneseTextMapHash),
        ) || '',
      EN:
        Client.cachedTextMap.get(String(fetterInfoJson.cvEnglishTextMapHash)) ||
        '',
      KR:
        Client.cachedTextMap.get(String(fetterInfoJson.cvKoreanTextMapHash)) ||
        '',
    }
  }
}
