import { Client } from '@/client/Client'
import type { CVType } from '@/types/types'

/**
 * Represents character profile information including basic details and associations
 */
export class CharacterProfile {
  /**
   * Character ID
   */
  public readonly characterId: number
  /**
   * Fetter ID
   */
  public readonly fetterId: number
  /**
   * Birth date
   */
  public readonly birthDate: Date | undefined
  /**
   * Affiliation
   */
  public readonly native: string
  /**
   * Character Vision
   */
  public readonly vision: string
  /**
   * Character Constellation
   */
  public readonly constellation: string
  /**
   * Profile Title
   */
  public readonly title: string
  /**
   * Profile Detail
   */
  public readonly detail: string
  /**
   * Association
   */
  public readonly assocType: string // TODO: なんでstringになってんだ？
  /**
   * Character Voice
   * @key Language code
   * @value Voice actor name
   */
  public readonly cv: Record<CVType, string>

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

  /**
   * Create a Profile
   * @param characterId - character ID
   */
  constructor(characterId: number) {
    this.characterId = characterId
    const fetterInfoJson = Client._findBy(
      'FetterInfoExcelConfigData',
      'avatarId',
      this.characterId,
    )
    if (!fetterInfoJson) {
      throw new Error(
        `FetterInfoExcelConfigData not found for characterId ${String(this.characterId)}`,
      )
    }

    this.fetterId = fetterInfoJson.fetterId
    const birthMonth = fetterInfoJson.infoBirthMonth as number | undefined
    const birthDay = fetterInfoJson.infoBirthDay as number | undefined
    this.birthDate = birthMonth
      ? new Date(0, birthMonth - 1, birthDay)
      : undefined
    const avatarNativeTextMapHash = fetterInfoJson.avatarNativeTextMapHash
    const avatarVisionAfterTextMapHash =
      fetterInfoJson.avatarVisionAfterTextMapHash
    const avatarVisionBeforeTextMapHash =
      fetterInfoJson.avatarVisionBeforTextMapHash
    this.native = Client._cachedTextMap.get(avatarNativeTextMapHash) ?? ''
    this.vision =
      Client._cachedTextMap.get(avatarVisionAfterTextMapHash) ??
      Client._cachedTextMap.get(avatarVisionBeforeTextMapHash) ??
      ''
    const avatarConstellationAfterTextMapHash =
      fetterInfoJson.avatarConstellationAfterTextMapHash
    const avatarConstellationBeforeTextMapHash =
      fetterInfoJson.avatarConstellationBeforTextMapHash
    this.constellation =
      Client._cachedTextMap.get(avatarConstellationAfterTextMapHash) ??
      Client._cachedTextMap.get(avatarConstellationBeforeTextMapHash) ??
      ''

    const avatarTitleTextMapHash = fetterInfoJson.avatarTitleTextMapHash
    const avatarDetailTextMapHash = fetterInfoJson.avatarDetailTextMapHash
    this.title = Client._cachedTextMap.get(avatarTitleTextMapHash) ?? ''
    this.detail = Client._cachedTextMap.get(avatarDetailTextMapHash) ?? ''
    this.assocType = fetterInfoJson.avatarAssocType // TODO: なんでstringになってんだ？

    const cvChineseTextMapHash = fetterInfoJson.cvChineseTextMapHash
    const cvJapaneseTextMapHash = fetterInfoJson.cvJapaneseTextMapHash
    const cvEnglishTextMapHash = fetterInfoJson.cvEnglishTextMapHash
    const cvKoreanTextMapHash = fetterInfoJson.cvKoreanTextMapHash
    this.cv = {
      'zh-cn': Client._cachedTextMap.get(cvChineseTextMapHash) ?? '',
      ja: Client._cachedTextMap.get(cvJapaneseTextMapHash) ?? '',
      en: Client._cachedTextMap.get(cvEnglishTextMapHash) ?? '',
      ko: Client._cachedTextMap.get(cvKoreanTextMapHash) ?? '',
    }
  }

  /**
   * Get all character IDs
   * @returns all character IDs
   */
  public static get allCharacterIds(): number[] {
    const profileDatas = Client._getAll('FetterInfoExcelConfigData')
    return profileDatas.map((data) => data.avatarId)
  }
}
