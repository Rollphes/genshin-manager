import fs from 'fs'
import * as fsPromises from 'fs/promises'
import path from 'path'
import { pipeline } from 'stream/promises'

import { AudioNotFoundError } from '@/errors'
import { CVType } from '@/types'
import { ClientOption } from '@/types'
import { ReadableStreamWrapper } from '@/utils/streams'

/**
 * Class for compiling information about audio
 */
export class AudioAssets {
  /**
   * Audio base URL of mihoyo
   */
  private static readonly AUDIO_BASE_URL_MIHOYO =
    'https://upload-os-bbs.mihoyo.com/game_record/genshin'

  /**
   * Fetch option
   */
  private static fetchOption: RequestInit
  /**
   * Audio base URL by regex
   */
  private static audioBaseURLByRegex: Record<string, RegExp[]>
  /**
   * Default audio base URL
   */
  private static defaultAudioBaseURL: string
  /**
   * Whether to cache the audio
   */
  private static autoCacheAudio: boolean
  /**
   * Audio folder path
   */
  private static audioFolderPath: string
  /**
   * Audio name
   */
  public readonly name: string
  /**
   * Audio base URL
   */
  public readonly audioBaseURL: string
  /**
   * Audio URL
   */
  public readonly url: string
  /**
   * Audio cv
   */
  public readonly cv?: CVType
  /**
   * Character ID
   */
  public readonly characterId?: number
  /**
   * Audio URL of mihoyo
   */
  public readonly mihoyoURL: string

  /**
   * Classes for handling audios
   * @param name audio name
   * @param cv audio cv
   * @param characterId character ID
   */
  constructor(name: string, cv?: CVType, characterId?: number) {
    this.name = name
    this.cv = cv
    this.characterId = characterId
    this.audioBaseURL =
      Object.keys(AudioAssets.audioBaseURLByRegex).find((url) =>
        AudioAssets.audioBaseURLByRegex[url].some((regex) => regex.test(name)),
      ) ?? AudioAssets.defaultAudioBaseURL

    const cvPath = cv === undefined ? '' : `/${cv}`
    const characterIdPath =
      characterId === undefined ? '' : `/${String(characterId)}`

    this.url =
      name === ''
        ? ''
        : `${this.audioBaseURL}${cvPath}${characterIdPath}/${name}.ogg`

    this.mihoyoURL =
      name === ''
        ? ''
        : `${AudioAssets.AUDIO_BASE_URL_MIHOYO}${cvPath}${characterIdPath}/${name}.ogg`
  }

  /**
   * Classes for handling audios
   * @param option client option
   */
  public static deploy(option: ClientOption): void {
    this.fetchOption = option.fetchOption
    this.audioBaseURLByRegex = option.audioBaseURLByRegex
    this.defaultAudioBaseURL = option.defaultAudioBaseURL
    this.autoCacheAudio = option.autoCacheAudio
    this.audioFolderPath = path.resolve(option.assetCacheFolderPath, 'Audios')
    if (!fs.existsSync(this.audioFolderPath)) fs.mkdirSync(this.audioFolderPath)
  }

  /**
   * Fetch audio buffer
   * @returns audio buffer
   */
  public async fetchBuffer(): Promise<Buffer> {
    if (!this.url) throw new AudioNotFoundError(this.name, { url: this.url })

    const cvPaths: string[] = []
    if (this.cv !== undefined) cvPaths.push(this.cv)
    if (this.characterId !== undefined) cvPaths.push(String(this.characterId))
    const audioCachePath = path.resolve(
      AudioAssets.audioFolderPath,
      ...cvPaths,
      `${this.name}.ogg`,
    )
    if (fs.existsSync(audioCachePath) && !this.isOGGCorrupted(audioCachePath)) {
      return await fsPromises.readFile(audioCachePath)
    } else {
      const res = await fetch(this.url, AudioAssets.fetchOption)
      if (!res.ok || !res.body)
        throw new AudioNotFoundError(this.name, { url: this.url })

      const arrayBuffer = await res.arrayBuffer()
      const data = Buffer.from(arrayBuffer)
      if (AudioAssets.autoCacheAudio) {
        fs.mkdirSync(path.dirname(audioCachePath), { recursive: true })
        await fsPromises.writeFile(audioCachePath, data, { flag: 'w' })
      }

      return data
    }
  }

  /**
   * Fetch audio stream
   * @param highWaterMark highWaterMark
   * @returns audio stream
   */
  public async fetchStream(highWaterMark?: number): Promise<fs.ReadStream> {
    if (!this.url) throw new AudioNotFoundError(this.name, { url: this.url })

    const cvPaths: string[] = []
    if (this.cv !== undefined) cvPaths.push(this.cv)
    if (this.characterId !== undefined) cvPaths.push(String(this.characterId))
    const audioCachePath = path.resolve(
      AudioAssets.audioFolderPath,
      ...cvPaths,
      `${this.name}.ogg`,
    )
    if (fs.existsSync(audioCachePath) && !this.isOGGCorrupted(audioCachePath)) {
      return fs.createReadStream(audioCachePath, {
        highWaterMark: highWaterMark,
      })
    } else {
      const res = await fetch(this.url, AudioAssets.fetchOption)
      if (!res.ok || !res.body)
        throw new AudioNotFoundError(this.name, { url: this.url })

      if (AudioAssets.autoCacheAudio) {
        fs.mkdirSync(path.dirname(audioCachePath), { recursive: true })
        const fsWriteStream = fs.createWriteStream(audioCachePath, {
          highWaterMark: highWaterMark,
        })
        await pipeline(
          new ReadableStreamWrapper(res.body.getReader()),
          fsWriteStream,
        )
      }
      return fs.createReadStream(audioCachePath, {
        highWaterMark: highWaterMark,
      })
    }
  }

  /**
   * Check if the OGG file is corrupted
   * @warning Limited corruption detection - only validates the final OggS header. May not catch all types of file corruption.
   * @param filePath file path
   * @returns is OGG file corrupted
   */
  private isOGGCorrupted(filePath: string): boolean {
    const data = fs.readFileSync(filePath)
    const lastIndex = data.lastIndexOf('OggS')

    if (lastIndex !== -1) {
      const headerType = data.readUInt8(lastIndex + 5)

      if (headerType === 4) return false
      else return true
    } else {
      return true
    }
  }
}
