import { Client } from '@/client/Client'
import { AudioAssets } from '@/models/assets/AudioAssets'
import { CVType } from '@/types'

/**
 * Class of character's voice
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

  /**
   * Create a CharacterVoice
   * @param fetterId Fetter ID in the voice
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
    this.title =
      Client.cachedTextMap.get(String(fetterVoiceJson.voiceTitleTextMapHash)) ||
      ''
    this.content =
      Client.cachedTextMap.get(
        String(fetterVoiceJson.voiceFileTextTextMapHash),
      ) || ''
    this.tips = (fetterVoiceJson.tips as number[])
      .map((tip) => Client.cachedTextMap.get(String(tip)))
      .filter((tip): tip is string => tip !== undefined)
    this.audio = new AudioAssets(
      fetterVoiceJson.voiceFile as string,
      cv,
      this.characterId,
    )
  }

  /**
   * Get all Fetter IDs in the voice
   * @returns All Fetter IDs in the voice
   */
  public static get allFetterIds(): number[] {
    const fetterVoicesJson = Object.values(
      Client._getCachedExcelBinOutputByName('FettersExcelConfigData'),
    )
    return fetterVoicesJson.map((voice) => voice.fetterId as number)
  }

  /**
   * Get all Fetter IDs in the character's voice
   * @param characterId Character ID
   * @returns All Fetter IDs in the character's voice
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
