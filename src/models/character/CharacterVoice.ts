import { Client } from '@/client'
import { AudioAssets } from '@/models/assets/AudioAssets'
import { CVType } from '@/types'

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
  public readonly hideCostumeIds: number[] = []
  /**
   * Costume IDs to show this
   */
  public readonly showCostumeIds: number[] = []
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
    this.hideCostumeIds = fetterVoiceJson.hideCostumeIds as number[]
    this.showCostumeIds = fetterVoiceJson.showCostumeIds as number[]
    this.characterId = fetterVoiceJson.avatarId as number
    this.type = fetterVoiceJson.type as number
    const voiceTitleTextMapHash =
      fetterVoiceJson.voiceTitleTextMapHash as number
    const voiceFileTextMapHash = fetterVoiceJson.voiceFileTextMapHash as number

    this.title = Client._cachedTextMap.get(voiceTitleTextMapHash) ?? ''
    this.content = Client._cachedTextMap.get(voiceFileTextMapHash) ?? ''
    this.tips = (fetterVoiceJson.tips as number[])
      .map((tip) => Client._cachedTextMap.get(tip))
      .filter((tip): tip is string => tip !== undefined)
    this.audio = new AudioAssets(
      fetterVoiceJson.voiceFile as string,
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
    return fetterVoicesJson.map((voice) => voice.fetterId as number)
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
      .filter((voice) => voice.avatarId === characterId)
      .map((voice) => voice.fetterId as number)
  }
}
