import cron from 'node-cron'
import path from 'path'
import merge from 'ts-deepmerge'

import { AssetCacheManager } from '@/client/AssetCacheManager'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { ClientOption, TextMapLanguage } from '@/types'

export class Client extends AssetCacheManager {
  public readonly option: ClientOption

  constructor(option?: Partial<ClientOption>) {
    const defaultOption: ClientOption = {
      fetchOption: {
        timeout: 3000,
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
          /^UI_(Costume|NameCardIcon|NameCardPic|RelicIcon|AvatarIcon_Side)_/,
          /^UI_AvatarIcon_(.+)_Card$/,
          /^UI_EquipIcon_(.+)_Awaken$/,
        ],
        'https://res.cloudinary.com/genshin/image/upload/sprites': [
          /^Eff_UI_Talent_/,
        ],
      },
      defaultLanguage: 'EN',
      showFetchCacheLog: true,
      autoFetchLatestAssetsByCron: '0 0 0 * * 3',
      beginAutoFetchLatestAssetsFunction: () => {},
      endAutoFetchLatestAssetsFunction: () => {},
      autoCacheImage: true,
      autoFixTextMap: true,
      assetCacheFolderPath: path.resolve(__dirname, '..', '..', 'cache'), //TODO:別のフォルダーの時を未実装
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

    if (!module.parent) {
      throw new Error('module.parent is undefined.')
    }
    super(mergeOption, module.parent.children)
    this.option = mergeOption
  }

  /**
   * Deploy assets to cache & Update assets
   * @example
   * ```ts
   * const client = new Client()
   * await client.deploy()
   * ```
   */
  public async deploy() {
    await Client.updateCache()
    if (
      this.option.autoFetchLatestAssetsByCron &&
      this.option.assetCacheFolderPath ==
        path.resolve(__dirname, '..', '..', 'cache')
    ) {
      void Client.updateCache()
      cron.schedule(this.option.autoFetchLatestAssetsByCron, () => {
        void Client.updateCache()
      })
    }
    ImageAssets.deploy(this.option)
  }

  /**
   * Change cached languages.
   * @param language Country code
   * @example
   * ```ts
   * const client = new Client()
   * await client.deploy()
   * await Client.changeLanguage('JP')
   * ```
   */
  public static async changeLanguage(language: keyof typeof TextMapLanguage) {
    await Client.setTextMapToCache(language)
  }
}
