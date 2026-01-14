import { Client } from '@/client/Client'
import { AudioAssets } from '@/models/assets/AudioAssets'
import { CVType } from '@/types/types'

/**
 * Handles character voice lines and audio assets in different languages
 */
export class CharacterVoice {
  /**
   * fetter ID in the voice
   */
  public readonly fetterId: number
  /**
   * CV language
   */
  public readonly cv: CVType
  /**
   * Costume IDs to hide this
   */
  public readonly hideCostumeList: number[] = []
  /**
   * Costume IDs to show this
   */
  public readonly showCostumeList: number[] = []
  /**
   * Character ID
   */
  public readonly characterId: number
  /**
   * Voice Type
   * @description 1: non-Fighting 2: Fighting
   */
  public readonly type: number
  /**
   * Voice Title
   */
  public readonly title: string
  /**
   * Voice Content
   */
  public readonly content: string
  /**
   * Voice Tips
   */
  public readonly tips: string[]
  /**
   * Voice Audio
   */
  public readonly audio: AudioAssets

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

  /**
   * Create a CharacterVoice
   * @param fetterId fetter ID in the voice
   * @param cv CV language
   */
  constructor(fetterId: number, cv: CVType) {
    this.fetterId = fetterId
    this.cv = cv
    const fetterVoiceJson = Client._getJsonFromCachedExcelBinOutput(
      'FettersExcelConfigData',
      fetterId,
    )
    this.hideCostumeList = fetterVoiceJson.hideCostumeList
    this.showCostumeList = fetterVoiceJson.showCostumeList
    this.characterId = fetterVoiceJson.avatarId
    this.type = fetterVoiceJson.type
    const voiceTitleTextMapHash = fetterVoiceJson.voiceTitleTextMapHash
    const voiceFileTextMapHash = fetterVoiceJson.voiceTitleTextMapHash

    this.title = Client._cachedTextMap.get(voiceTitleTextMapHash) ?? ''
    this.content = Client._cachedTextMap.get(voiceFileTextMapHash) ?? ''
    this.tips = fetterVoiceJson.tips
      .map((tip) => Client._cachedTextMap.get(tip))
      .filter((tip): tip is string => tip !== undefined)
    this.audio = new AudioAssets(
      fetterVoiceJson.voiceFile,
      cv,
      this.characterId,
    )
  }

  /**
   * Get all Fetter IDs in the voice
   * @returns all Fetter IDs in the voice
   */
  public static get allFetterIds(): number[] {
    const fetterVoicesJson = Object.values(
      Client._getCachedExcelBinOutputByName('FettersExcelConfigData'),
    )
    return fetterVoicesJson
      .filter(
        (voice): voice is NonNullable<typeof voice> =>
          voice?.fetterId !== undefined,
      )
      .map((voice) => voice.fetterId)
  }

  /**
   * Get all Fetter IDs in the character's voice
   * @param characterId character ID
   * @returns all Fetter IDs in the character's voice
   */
  public static getAllFetterIdsByCharacterId(characterId: number): number[] {
    const fetterVoicesJson = Object.values(
      Client._getCachedExcelBinOutputByName('FettersExcelConfigData'),
    )
    return fetterVoicesJson
      .filter(
        (voice): voice is NonNullable<typeof voice> =>
          voice !== undefined && voice.avatarId === characterId,
      )
      .map((voice) => voice.fetterId)
  }
}
