import type { CVType } from '@/types/types'

/**
 * Constructor data for AudioAssets
 */
export interface AudioAssetsData {
  /** Audio name */
  readonly name: string
  /** Audio base URL */
  readonly audioBaseURL: string
  /** CV type */
  readonly cv: CVType | undefined
  /** Character ID */
  readonly characterId: number | undefined
}

/**
 * Audio asset reference with URL construction.
 * Pure DTO — does not perform any I/O.
 */
export class AudioAssets {
  private static readonly AUDIO_BASE_URL_MIHOYO =
    'https://upload-os-bbs.mihoyo.com/game_record/genshin'

  /** Audio name */
  public readonly name: string
  /** Audio base URL */
  public readonly audioBaseURL: string
  /** CV type */
  public readonly cv: CVType | undefined
  /** Character ID */
  public readonly characterId: number | undefined
  /** Full audio URL */
  public readonly url: string
  /** Mihoyo CDN URL */
  public readonly mihoyoURL: string

  /**
   * Create an AudioAssets reference
   * @param data - Audio asset data
   */
  constructor(data: AudioAssetsData) {
    this.name = data.name
    this.audioBaseURL = data.audioBaseURL
    this.cv = data.cv
    this.characterId = data.characterId

    const cvPath = data.cv === undefined ? '' : `/${data.cv}`
    const characterIdPath =
      data.characterId === undefined ? '' : `/${String(data.characterId)}`

    this.url =
      data.name === ''
        ? ''
        : `${data.audioBaseURL}${cvPath}${characterIdPath}/${data.name}.ogg`

    this.mihoyoURL =
      data.name === ''
        ? ''
        : `${AudioAssets.AUDIO_BASE_URL_MIHOYO}${cvPath}${characterIdPath}/${data.name}.ogg`
  }
}
