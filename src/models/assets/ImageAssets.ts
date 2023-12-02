import fs from 'fs'
import * as fsPromises from 'fs/promises'
import path from 'path'
import { pipeline } from 'stream/promises'

import { ImageNotFoundError } from '@/errors/ImageNotFoundError'
import { ClientOption } from '@/types'
import { ReadableStreamWrapper } from '@/utils/ReadableStreamWrapper'

const imageBaseUrlMihoyo =
  'https://upload-os-bbs.mihoyo.com/game_record/genshin'

const imageTypes: { [type: string]: RegExp[] } = {
  character_side_icon: [/^UI_AvatarIcon_Side_(.+)$/],
  character_icon: [/^UI_AvatarIcon_(.+)$/],
  equip: [/^UI_EquipIcon_(.+?)(_Awaken)?$/, /^UI_RelicIcon_(.+)$/],
}

/**
 * Class that summarizes information about an image.
 */
export class ImageAssets {
  /**
   * Fetch option
   */
  private static fetchOption: RequestInit
  /**
   * Image base url by regex
   */
  private static imageBaseUrlByRegex: { [url: string]: RegExp[] }
  /**
   * Default image base url
   */
  private static defaultImageBaseUrl: string
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
   * Image base url
   */
  public readonly imageBaseUrl: string
  /**
   * Image url
   */
  public readonly url: string
  /**
   * Image type
   */
  public readonly imageType: string | null
  /**
   * Image url of mihoyo
   */
  public readonly mihoyoUrl: string

  /**
   * Classes for handling images
   * @param name image name
   * @param url image url(Basically, no need to specify)
   */
  constructor(name: string, url?: string) {
    this.name = name
    this.imageBaseUrl =
      Object.keys(ImageAssets.imageBaseUrlByRegex).find((url) =>
        ImageAssets.imageBaseUrlByRegex[url].some((regex) => regex.test(name)),
      ) ?? ImageAssets.defaultImageBaseUrl

    this.url = url ? url : name === '' ? '' : `${this.imageBaseUrl}/${name}.png`

    this.imageType =
      Object.keys(imageTypes).find((type) =>
        imageTypes[type].some((regex) => regex.test(name)),
      ) ?? null

    this.mihoyoUrl =
      name === '' || !this.imageType ? '' : `${imageBaseUrlMihoyo}/${name}.png`
  }

  /**
   * Create an ImageAssets instance from the image url.
   * @param url image url
   * @returns ImageAssets instance
   */
  public static fromUrl(url: string): ImageAssets {
    const name = path.basename(url, '.png')
    return new ImageAssets(name, url)
  }

  /**
   * Classes for handling images
   * @param option Client option
   */
  public static deploy(option: ClientOption): void {
    this.fetchOption = option.fetchOption
    this.imageBaseUrlByRegex = option.imageBaseUrlByRegex
    this.defaultImageBaseUrl = option.defaultImageBaseUrl
    this.autoCacheImage = option.autoCacheImage
    this.imageFolderPath = path.resolve(option.assetCacheFolderPath, 'Images')
    if (!fs.existsSync(this.imageFolderPath)) fs.mkdirSync(this.imageFolderPath)
    ;[
      'UI_Gacha_AvatarImg_PlayerBoy.png',
      'UI_Gacha_AvatarImg_PlayerGirl.png',
    ].forEach((imgName) => {
      fs.copyFileSync(
        path.resolve(__dirname, '..', '..', '..', 'img', imgName),
        path.resolve(option.assetCacheFolderPath, 'Images', imgName),
      )
    })
  }

  /**
   * Fetch image buffer
   * @returns image buffer
   */
  public async fetchBuffer(): Promise<Buffer> {
    if (!this.url) throw new ImageNotFoundError(this.name, this.url)

    const imageCachePath = path.resolve(
      ImageAssets.imageFolderPath,
      `${this.name}.png`,
    )
    if (fs.existsSync(imageCachePath)) {
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
   * @param highWaterMark highWaterMark
   * @returns image stream
   */
  public async fetchStream(highWaterMark?: number): Promise<fs.ReadStream> {
    if (!this.url) throw new ImageNotFoundError(this.name, this.url)

    const imageCachePath = path.resolve(
      ImageAssets.imageFolderPath,
      `${this.name}.png`,
    )
    if (fs.existsSync(imageCachePath)) {
      return fs.createReadStream(imageCachePath, {
        highWaterMark: highWaterMark,
      })
    } else {
      const res = await fetch(this.url, ImageAssets.fetchOption)
      if (!res.ok || !res.body)
        throw new ImageNotFoundError(this.name, this.url)

      const fsStream = fs.createWriteStream(imageCachePath, {
        highWaterMark: highWaterMark,
      })
      if (ImageAssets.autoCacheImage) {
        await pipeline(
          new ReadableStreamWrapper(res.body.getReader()),
          fsStream,
        )
      }
      return fs.createReadStream(imageCachePath, {
        highWaterMark: highWaterMark,
      })
    }
  }
}
