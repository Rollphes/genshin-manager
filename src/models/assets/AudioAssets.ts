import fs from 'fs'
import * as fsPromises from 'fs/promises'
import path from 'path'
import { pipeline } from 'stream/promises'

import { AudioNotFoundError } from '@/errors/AudioNotFoundError'
import { CVType } from '@/types'
import { ClientOption } from '@/types'
import { ReadableStreamWrapper } from '@/utils/ReadableStreamWrapper'

/**
 * Class that summarizes information about an audio
 */
export class AudioAssets {
  /**
   * Audio base url of mihoyo
   */
  private static readonly audioBaseUrlMihoyo =
    'https://upload-os-bbs.mihoyo.com/game_record/genshin'

  /**
   * Fetch option
   */
  private static fetchOption: RequestInit
  /**
   * Audio base url by regex
   */
  private static audioBaseUrlByRegex: { [url: string]: RegExp[] }
  /**
   * Default audio base url
   */
  private static defaultAudioBaseUrl: string
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
   * Audio base url
   */
  public readonly audioBaseUrl: string
  /**
   * Audio url
   */
  public readonly url: string
  /**
   * Audio cv
   */
  public readonly cv?: CVType
  /**
   * Character id
   */
  public readonly characterId?: number
  /**
   * Audio url of mihoyo
   */
  public readonly mihoyoUrl: string

  /**
   * Classes for handling audios
   * @param name audio name
   * @param cv audio cv
   * @param characterId character id
   */
  constructor(name: string, cv?: CVType, characterId?: number) {
    this.name = name
    this.cv = cv
    this.characterId = characterId
    this.audioBaseUrl =
      Object.keys(AudioAssets.audioBaseUrlByRegex).find((url) =>
        AudioAssets.audioBaseUrlByRegex[url].some((regex) => regex.test(name)),
      ) ?? AudioAssets.defaultAudioBaseUrl

    const cvPath = cv === undefined ? '' : `/${cv}`
    const characterIdPath = characterId === undefined ? '' : `/${characterId}`

    this.url =
      name === ''
        ? ''
        : `${this.audioBaseUrl}${cvPath}${characterIdPath}/${name}.ogg`

    this.mihoyoUrl =
      name === ''
        ? ''
        : `${AudioAssets.audioBaseUrlMihoyo}${cvPath}${characterIdPath}/${name}.ogg`
  }

  /**
   * Classes for handling audios
   * @param option Client option
   */
  public static deploy(option: ClientOption): void {
    this.fetchOption = option.fetchOption
    this.audioBaseUrlByRegex = option.audioBaseUrlByRegex
    this.defaultAudioBaseUrl = option.defaultAudioBaseUrl
    this.autoCacheAudio = option.autoCacheAudio
    this.audioFolderPath = path.resolve(option.assetCacheFolderPath, 'Audios')
    if (!fs.existsSync(this.audioFolderPath)) fs.mkdirSync(this.audioFolderPath)
  }

  /**
   * Fetch audio buffer
   * @returns audio buffer
   */
  public async fetchBuffer(): Promise<Buffer> {
    if (!this.url) throw new AudioNotFoundError(this.name, this.url)

    const cvPaths: string[] = []
    if (this.cv !== undefined) cvPaths.push(this.cv)
    if (this.characterId !== undefined) cvPaths.push(`${this.characterId}`)
    const audioCachePath = path.resolve(
      AudioAssets.audioFolderPath,
      ...cvPaths,
      `${this.name}.ogg`,
    )
    if (fs.existsSync(audioCachePath)) {
      return await fsPromises.readFile(audioCachePath)
    } else {
      const res = await fetch(this.url, AudioAssets.fetchOption)
      if (!res.ok || !res.body)
        throw new AudioNotFoundError(this.name, this.url)

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
    if (!this.url) throw new AudioNotFoundError(this.name, this.url)

    const cvPaths: string[] = []
    if (this.cv !== undefined) cvPaths.push(this.cv)
    if (this.characterId !== undefined) cvPaths.push(`${this.characterId}`)
    const audioCachePath = path.resolve(
      AudioAssets.audioFolderPath,
      ...cvPaths,
      `${this.name}.ogg`,
    )
    if (fs.existsSync(audioCachePath)) {
      return fs.createReadStream(audioCachePath, {
        highWaterMark: highWaterMark,
      })
    } else {
      const res = await fetch(this.url, AudioAssets.fetchOption)
      if (!res.ok || !res.body)
        throw new AudioNotFoundError(this.name, this.url)

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
}
