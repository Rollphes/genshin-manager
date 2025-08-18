import fs from 'fs'
import * as fsPromises from 'fs/promises'
import path from 'path'
import { pipeline } from 'stream/promises'

import { ImageNotFoundError } from '@/errors/ImageNotFoundError'
import { ClientOption } from '@/types'
import { ReadableStreamWrapper } from '@/utils/ReadableStreamWrapper'

/**
 * Class for compiling information about image
 */
export class ImageAssets {
  /**
   * Image base URL of mihoyo
   */
  private static readonly IMAGE_BASE_URL_MIHOYO =
    'https://upload-os-bbs.mihoyo.com/game_record/genshin'
  /**
   * Image types
   */
  private static readonly imageTypes: Record<string, RegExp[]> = {
    character_side_icon: [/^UI_AvatarIcon_Side_(.+)$/],
    character_icon: [/^UI_AvatarIcon_(.+)$/],
    equip: [/^UI_EquipIcon_(.+?)(_Awaken)?$/, /^UI_RelicIcon_(.+)$/],
  }

  /**
   * Fetch option
   */
  private static fetchOption: RequestInit
  /**
   * Image base URL by regex
   */
  private static imageBaseURLByRegex: Record<string, RegExp[]>
  /**
   * Default image base URL
   */
  private static defaultImageBaseURL: string
  /**
   * Whether to cache the image
   */
  private static autoCacheImage: boolean
  /**
   * Image folder path
   */
  private static imageFolderPath: string
  /**
   * Image name
   */
  public readonly name: string
  /**
   * Image base URL
   */
  public readonly imageBaseURL: string
  /**
   * Image URL
   */
  public readonly url: string
  /**
   * Image type
   */
  public readonly imageType: string | null
  /**
   * Image URL of mihoyo
   */
  public readonly mihoyoURL: string

  /**
   * Classes for handling images
   * @param name Image name
   * @param url Image URL(Basically, no need to specify)
   */
  constructor(name: string, url?: string) {
    this.name = name
    this.imageBaseURL =
      Object.keys(ImageAssets.imageBaseURLByRegex).find((url) =>
        ImageAssets.imageBaseURLByRegex[url].some((regex) => regex.test(name)),
      ) ?? ImageAssets.defaultImageBaseURL

    this.url = url ?? (name === '' ? '' : `${this.imageBaseURL}/${name}.png`)

    this.imageType =
      Object.keys(ImageAssets.imageTypes).find((type) =>
        ImageAssets.imageTypes[type].some((regex) => regex.test(name)),
      ) ?? null

    this.mihoyoURL =
      name === '' || !this.imageType
        ? ''
        : `${ImageAssets.IMAGE_BASE_URL_MIHOYO}/${name}.png`
  }

  /**
   * Create a ImageAssets instance from the image URL
   * @param url Image URL
   * @returns ImageAssets instance
   */
  public static fromURL(url: string): ImageAssets {
    const name = path.basename(url, '.png')
    return new ImageAssets(name, url)
  }

  /**
   * Classes for handling images
   * @param option Client option
   */
  public static deploy(option: ClientOption): void {
    this.fetchOption = option.fetchOption
    this.imageBaseURLByRegex = option.imageBaseURLByRegex
    this.defaultImageBaseURL = option.defaultImageBaseURL
    this.autoCacheImage = option.autoCacheImage
    this.imageFolderPath = path.resolve(option.assetCacheFolderPath, 'Images')
    if (!fs.existsSync(this.imageFolderPath)) fs.mkdirSync(this.imageFolderPath)
    let packageImgDir: string
    try {
      packageImgDir = path.resolve(
        path.dirname(require.resolve('genshin-manager/package.json')),
        'img',
      )
    } catch {
      packageImgDir = path.resolve(__dirname, '..', '..', '..', 'img')
    }

    ;[
      'UI_Gacha_AvatarImg_PlayerBoy.png',
      'UI_Gacha_AvatarImg_PlayerGirl.png',
    ].forEach((imgName) => {
      const sourcePath = path.resolve(packageImgDir, imgName)
      const destinationPath = path.resolve(
        option.assetCacheFolderPath,
        'Images',
        imgName,
      )

      if (!fs.existsSync(destinationPath)) {
        try {
          fs.copyFileSync(sourcePath, destinationPath)
        } catch (error) {
          if (!fs.existsSync(destinationPath)) throw error
        }
      }
    })
  }

  /**
   * Fetch image buffer
   * @returns Image buffer
   */
  public async fetchBuffer(): Promise<Buffer> {
    if (!this.url) throw new ImageNotFoundError(this.name, this.url)

    const imageCachePath = path.resolve(
      ImageAssets.imageFolderPath,
      `${this.name}.png`,
    )
    if (fs.existsSync(imageCachePath) && !this.isPNGCorrupted(imageCachePath)) {
      return await fsPromises.readFile(imageCachePath)
    } else {
      const res = await fetch(this.url, ImageAssets.fetchOption)
      if (!res.ok || !res.body)
        throw new ImageNotFoundError(this.name, this.url)

      const arrayBuffer = await res.arrayBuffer()
      const data = Buffer.from(arrayBuffer)
      if (ImageAssets.autoCacheImage)
        await fsPromises.writeFile(imageCachePath, data, { flag: 'w' })

      return data
    }
  }

  /**
   * Fetch image stream
   * @param highWaterMark HighWaterMark
   * @returns Image stream
   */
  public async fetchStream(highWaterMark?: number): Promise<fs.ReadStream> {
    if (!this.url) throw new ImageNotFoundError(this.name, this.url)

    const imageCachePath = path.resolve(
      ImageAssets.imageFolderPath,
      `${this.name}.png`,
    )
    if (fs.existsSync(imageCachePath) && !this.isPNGCorrupted(imageCachePath)) {
      return fs.createReadStream(imageCachePath, {
        highWaterMark: highWaterMark,
      })
    } else {
      const res = await fetch(this.url, ImageAssets.fetchOption)
      if (!res.ok || !res.body)
        throw new ImageNotFoundError(this.name, this.url)

      if (ImageAssets.autoCacheImage) {
        const fsWriteStream = fs.createWriteStream(imageCachePath, {
          highWaterMark: highWaterMark,
        })
        await pipeline(
          new ReadableStreamWrapper(res.body.getReader()),
          fsWriteStream,
        )
      }
      return fs.createReadStream(imageCachePath, {
        highWaterMark: highWaterMark,
      })
    }
  }

  /**
   * Check if the PNG file is corrupted
   * @warning This function is not perfect, so it may not be able to detect all corrupted files. because it only checks the PNG signature and IEnd chunk.
   * @param filePath File path
   * @returns is PNG file corrupted
   */
  private isPNGCorrupted(filePath: string): boolean {
    try {
      const stats = fs.statSync(filePath)
      const fileSize = stats.size

      const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]) // PNG signature
      const pngIEndSignature = Buffer.from([73, 69, 78, 68]) // PNG IEnd Chunk Type

      const signatureBuffer = Buffer.alloc(pngSignature.length) // PNG signature
      const iEndBuffer = Buffer.alloc(8) // PNG IEnd Chunk Type and CRC

      if (fileSize < signatureBuffer.length + iEndBuffer.length) return true

      const fd = fs.openSync(filePath, 'r')

      fs.readSync(fd, signatureBuffer, 0, signatureBuffer.length, 0)

      fs.readSync(
        fd,
        iEndBuffer,
        0,
        iEndBuffer.length,
        fileSize - iEndBuffer.length,
      )
      const iEndSignatureBuffer = iEndBuffer.slice(0, pngIEndSignature.length)

      fs.closeSync(fd)

      if (
        !pngSignature.equals(signatureBuffer) ||
        !pngIEndSignature.equals(iEndSignatureBuffer)
      )
        return true
      return false
    } catch {
      return true
    }
  }
}
