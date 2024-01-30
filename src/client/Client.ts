import cron from 'node-cron'
import path from 'path'
import { merge } from 'ts-deepmerge'

import { AssetCacheManager } from '@/client/AssetCacheManager'
import { AudioAssets } from '@/models/assets/AudioAssets'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { ClientOption, TextMapLanguage } from '@/types'

/**
 * Class of the client
 * @description This is the main body of `Genshin-Manager` where cache information is stored
 */
export class Client extends AssetCacheManager {
  /**
   * Default option
   */
  private static readonly defaultOption: ClientOption = {
    fetchOption: {
      headers: {
        'user-agent': `genshin-manager/${process.env.npm_package_version}`,
      },
    },
    downloadLanguages: [
      'EN',
      'RU',
      'VI',
      'TH',
      'PT',
      'KR',
      'JP',
      'ID',
      'FR',
      'ES',
      'DE',
      'CHT',
      'CHS',
    ],
    defaultImageBaseURL: 'https://api.ambr.top/assets/UI',
    defaultAudioBaseURL: 'https://api.ambr.top/assets/Audio',
    imageBaseURLByRegex: {
      'https://enka.network/ui': [
        /^UI_(EquipIcon|NameCardPic|RelicIcon|AvatarIcon_Side|NameCardIcon|Costume)_/,
        /^UI_AvatarIcon_(.+)_Card$/,
        /^UI_AvatarIcon_(.+)_Circle/,
      ],
      'https://res.cloudinary.com/genshin/image/upload/sprites': [
        /^Eff_UI_Talent_/,
        /^UI_(TowerPic|TowerBlessing|GcgIcon|Gcg_Cardtable|Gcg_CardBack)_/,
      ],
      'https://api.ambr.top/assets/UI/monster': [
        /^UI_(MonsterIcon|AnimalIcon)_/,
      ],
      'https://api.ambr.top/assets/UI/gcg': [/^UI_Gcg_CardFace_/],
    },
    audioBaseURLByRegex: {},
    defaultLanguage: 'EN',
    showFetchCacheLog: true,
    autoFetchLatestAssetsByCron: '0 0 0 * * 3', //Every Wednesday 00:00:00
    autoCacheImage: true,
    autoCacheAudio: true,
    autoFixTextMap: true,
    autoFixExcelBin: true,
    assetCacheFolderPath: path.resolve(__dirname, '..', '..', 'cache'),
  }
  public readonly option: ClientOption

  /**
   * Create a Client
   * @param option Client option
   */
  constructor(option?: Partial<ClientOption>) {
    const mergeOption = merge.withOptions(
      { mergeArrays: false },
      Client.defaultOption,
      option ?? {},
    ) as ClientOption

    mergeOption.downloadLanguages = [
      ...new Set([
        mergeOption.defaultLanguage,
        ...mergeOption.downloadLanguages,
      ]),
    ]

    if (!mergeOption.autoFetchLatestAssetsByCron) {
      mergeOption.autoFixTextMap = false
      mergeOption.autoFixExcelBin = false
    }

    if (!module.parent) throw new Error('module.parent is undefined.')

    super(mergeOption, module.parent.children)
    this.option = mergeOption
  }

  /**
   * Change cached languages
   * @param language Country code
   * @example
   * ```ts
   * const client = new Client()
   * await client.deploy()
   * await client.changeLanguage('JP')
   * ```
   */
  public async changeLanguage(
    language: keyof typeof TextMapLanguage,
  ): Promise<void> {
    if (await Client.setTextMapToCache(language)) {
      this.option.autoFixTextMap = false
      await Client.setTextMapToCache(language)
      this.option.autoFixTextMap = true
    }
  }

  /**
   * Deploy assets to cache & Update assets
   * @example
   * ```ts
   * const client = new Client()
   * await client.deploy()
   * ```
   */
  public async deploy(): Promise<void> {
    await Client.updateCache()
    if (this.option.autoFetchLatestAssetsByCron) {
      cron.schedule(this.option.autoFetchLatestAssetsByCron, () => {
        void Client.updateCache()
      })
    }
    await Promise.all([
      ImageAssets.deploy(this.option),
      AudioAssets.deploy(this.option),
    ])
  }
}
