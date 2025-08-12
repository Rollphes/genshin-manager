import { Client } from '@/client/Client'
import { AssocType, CVType } from '@/types'

/**
 * Class of character's profile
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
  public readonly assocType: AssocType
  /**
   * Character Voice
   */
  public readonly cv: Record<CVType, string>

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

  /**
   * Create a Profile
   * @param characterId Character ID
   */
  constructor(characterId: number) {
    this.characterId = characterId
    const fetterInfoJson = Client._getJsonFromCachedExcelBinOutput(
      'FetterInfoExcelConfigData',
      this.characterId,
    )
    this.fetterId = fetterInfoJson.fetterId as number
    const birthMonth = fetterInfoJson.infoBirthMonth as number | undefined
    const birthDay = fetterInfoJson.infoBirthDay as number | undefined
    this.birthDate = birthMonth
      ? new Date(0, birthMonth - 1, birthDay)
      : undefined
    const avatarNativeTextMapHash =
      fetterInfoJson.avatarNativeTextMapHash as number
    const avatarVisionAfterTextMapHash =
      fetterInfoJson.avatarVisionAfterTextMapHash as number
    const avatarVisionBeforeTextMapHash =
      fetterInfoJson.avatarVisionBeforTextMapHash as number
    this.native =
      Client._cachedTextMap.get(String(avatarNativeTextMapHash)) ?? ''
    this.vision =
      Client._cachedTextMap.get(String(avatarVisionAfterTextMapHash)) ??
      Client._cachedTextMap.get(String(avatarVisionBeforeTextMapHash)) ??
      ''
    const avatarConstellationAfterTextMapHash =
      fetterInfoJson.avatarConstellationAfterTextMapHash as number
    const avatarConstellationBeforeTextMapHash =
      fetterInfoJson.avatarConstellationBeforTextMapHash as number
    this.constellation =
      Client._cachedTextMap.get(String(avatarConstellationAfterTextMapHash)) ??
      Client._cachedTextMap.get(String(avatarConstellationBeforeTextMapHash)) ??
      ''

    const avatarTitleTextMapHash =
      fetterInfoJson.avatarTitleTextMapHash as number
    const avatarDetailTextMapHash =
      fetterInfoJson.avatarDetailTextMapHash as number
    this.title = Client._cachedTextMap.get(String(avatarTitleTextMapHash)) ?? ''
    this.detail =
      Client._cachedTextMap.get(String(avatarDetailTextMapHash)) ?? ''
    this.assocType = fetterInfoJson.avatarAssocType as AssocType

    const cvChineseTextMapHash = fetterInfoJson.cvChineseTextMapHash as number
    const cvJapaneseTextMapHash = fetterInfoJson.cvJapaneseTextMapHash as number
    const cvEnglishTextMapHash = fetterInfoJson.cvEnglishTextMapHash as number
    const cvKoreanTextMapHash = fetterInfoJson.cvKoreanTextMapHash as number
    this.cv = {
      CHS: Client._cachedTextMap.get(String(cvChineseTextMapHash)) ?? '',
      JP: Client._cachedTextMap.get(String(cvJapaneseTextMapHash)) ?? '',
      EN: Client._cachedTextMap.get(String(cvEnglishTextMapHash)) ?? '',
      KR: Client._cachedTextMap.get(String(cvKoreanTextMapHash)) ?? '',
    }
  }

  /**
   * Get all character IDs
   * @returns All character IDs
   */
  public static get allCharacterIds(): number[] {
    const profileDatas = Object.values(
      Client._getCachedExcelBinOutputByName('FetterInfoExcelConfigData'),
    )
    return profileDatas.map((data) => data.avatarId as number)
  }
}
