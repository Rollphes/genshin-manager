import fs from 'fs'
import * as fsPromises from 'fs/promises'
import fetch from 'node-fetch'
import path from 'path'
import { pipeline } from 'stream/promises'

import { ImageNotFoundError } from '@/errors/ImageNotFoundError'
import { ClientOption } from '@/types'

const imageBaseUrlMihoyo =
  'https://upload-os-bbs.mihoyo.com/game_record/genshin'

const imageTypes: { [type: string]: RegExp[] } = {
  character_side_icon: [/^UI_AvatarIcon_Side_(.+)$/],
  character_icon: [/^UI_AvatarIcon_(.+)$/],
  equip: [/^UI_EquipIcon_(.+?)(_Awaken)?$/, /^UI_RelicIcon_(.+)$/],
}

export class ImageAssets {
  private static imageBaseUrlByRegex: { [url: string]: RegExp[] }
  private static defaultImageBaseUrl: string
  private static autoCacheImage: boolean
  private static imageFolderPath: string
  public readonly name: string
  public readonly imageBaseUrl: string
  public readonly url: string
  public readonly imageType: string | null
  public readonly mihoyoUrl: string

  /**
   * Classes for handling images
   * @param name image name
   */
  constructor(name: string) {
    this.name = name
    this.imageBaseUrl =
      Object.keys(ImageAssets.imageBaseUrlByRegex).find((url) =>
        ImageAssets.imageBaseUrlByRegex[url].some((regex) => regex.test(name)),
      ) ?? ImageAssets.defaultImageBaseUrl

    this.url = name === '' ? '' : `${this.imageBaseUrl}/${name}.png`

    this.imageType =
      Object.keys(imageTypes).find((type) =>
        imageTypes[type].some((regex) => regex.test(name)),
      ) ?? null

    this.mihoyoUrl =
      name === '' || !this.imageType ? '' : `${imageBaseUrlMihoyo}/${name}.png`
  }

  /**
   * Classes for handling images
   * @param option
   */
  public static deploy(option: ClientOption) {
    this.imageBaseUrlByRegex = option.imageBaseUrlByRegex
    this.defaultImageBaseUrl = option.defaultImageBaseUrl
    this.autoCacheImage = option.autoCacheImage
    this.imageFolderPath = path.resolve(option.assetCacheFolderPath, 'Images')
    if (!fs.existsSync(this.imageFolderPath)) fs.mkdirSync(this.imageFolderPath)
    if (
      option.assetCacheFolderPath ==
      path.resolve(__dirname, '..', '..', '..', 'cache')
    ) {
      ;[
        'UI_Gacha_AvatarImg_PlayerBoy.png',
        'UI_Gacha_AvatarImg_PlayerGirl.png',
      ].forEach((imgName) => {
        fs.copyFileSync(
          path.resolve(__dirname, '..', '..', '..', 'img', imgName),
          path.resolve(__dirname, '..', '..', '..', 'cache', 'Images', imgName),
        )
      })
    }
  }

  /**
   * Fetch image buffer
   * @returns
   */
  public async fetchBuffer() {
    if (!this.url) {
      throw new ImageNotFoundError(this.name, this.url)
    }
    const imageCachePath = path.resolve(
      ImageAssets.imageFolderPath,
      `${this.name}.png`,
    )
    if (fs.existsSync(imageCachePath)) {
      return await fsPromises.readFile(imageCachePath)
    } else {
      const res = await fetch(this.url)
      if (!res.ok || !res.body) {
        throw new ImageNotFoundError(this.name, this.url)
      }
      const arrayBuffer = await res.arrayBuffer()
      const data = Buffer.from(arrayBuffer)
      if (ImageAssets.autoCacheImage) {
        await fsPromises.writeFile(imageCachePath, data, { flag: 'w' })
      }
      return data
    }
  }

  /**
   * Fetch image stream
   * @param highWaterMark
   * @returns
   */
  public async fetchStream(highWaterMark?: number) {
    if (!this.url) {
      throw new ImageNotFoundError(this.name, this.url)
    }
    const imageCachePath = path.resolve(
      ImageAssets.imageFolderPath,
      `${this.name}.png`,
    )
    if (fs.existsSync(imageCachePath)) {
      return fs.createReadStream(imageCachePath, {
        highWaterMark: highWaterMark,
      })
    } else {
      const res = await fetch(this.url)
      if (!res.ok || !res.body) {
        throw new ImageNotFoundError(this.name, this.url)
      }
      const fsStream = fs.createWriteStream(imageCachePath, {
        highWaterMark: highWaterMark,
      })
      if (ImageAssets.autoCacheImage) {
        await pipeline(res.body, fsStream)
      }
      return fs.createReadStream(imageCachePath, {
        highWaterMark: highWaterMark,
      })
    }
  }
}
