import cron from 'node-cron'
import path from 'path'
import merge from 'ts-deepmerge'

import { AssetCacheManager } from '@/client/AssetCacheManager'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { ClientOption, TextMapLanguage } from '@/types'

/**
 * Class of the client
 * This is the main body of `Genshin-Manager` where cache information is stored
 */
export class Client extends AssetCacheManager {
  public readonly option: ClientOption

  /**
   * Create a client
   * @param option Client option
   */
  constructor(option?: Partial<ClientOption>) {
    const defaultOption: ClientOption = {
      fetchOption: {
        headers: {
          'user-agent': 'Mozilla/5.0',
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
      defaultImageBaseUrl: 'https://api.ambr.top/assets/UI',
      imageBaseUrlByRegex: {
        'https://enka.network/ui': [
          /^UI_(EquipIcon|NameCardPic|RelicIcon|AvatarIcon_Side|NameCardIcon|Costume)_/,
          /^UI_AvatarIcon_(.+)_Card$/, //TODO: Add Card Icon
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
      defaultLanguage: 'EN',
      showFetchCacheLog: true,
      autoFetchLatestAssetsByCron: '0 0 0 * * 3', //Every Wednesday 00:00:00
      autoCacheImage: true,
      autoFixTextMap: true,
      assetCacheFolderPath: path.resolve(__dirname, '..', '..', 'cache'),
    }
    const mergeOption = option
      ? (merge.withOptions(
          { mergeArrays: false },
          defaultOption,
          option,
        ) as ClientOption)
      : defaultOption

    if (!mergeOption.downloadLanguages.includes(mergeOption.defaultLanguage)) {
      mergeOption.downloadLanguages = [
        mergeOption.defaultLanguage,
        ...mergeOption.downloadLanguages,
      ]
    }

    if (!mergeOption.autoFetchLatestAssetsByCron)
      mergeOption.autoFixTextMap = false

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
   * await Client.changeLanguage('JP')
   * ```
   */
  public static async changeLanguage(
    language: keyof typeof TextMapLanguage,
  ): Promise<void> {
    await Client.setTextMapToCache(language)
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
    ImageAssets.deploy(this.option)
  }
}
