import { merge } from 'lodash'
import path from 'path'

import { AssetCacheManager } from '@/client/AssetCacheManager'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { ClientOption, TextMapLanguage } from '@/types'

export class Client extends AssetCacheManager {
  public readonly option: ClientOption

  constructor(option?: Partial<ClientOption>) {
    const defaultOption: ClientOption = {
      // enkaNetwork: {
      //   url: 'https://enka.network',
      //   timeout: 3000,
      //   userAgent: 'Mozilla/5.0',
      // },
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
      showFetchCacheLog: true, //TODO:未実装
      autoFetchLatestAssets: true,
      autoCacheImage: true,
      assetCacheFolderPath: path.resolve(__dirname, '..', '..', 'cache'), //TODO:別のフォルダーの時を未実装
    }
    const mergeOption = option
      ? merge<ClientOption, Partial<ClientOption>>(defaultOption, option)
      : defaultOption

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
      this.option.autoFetchLatestAssets &&
      this.option.assetCacheFolderPath ==
        path.resolve(__dirname, '..', '..', 'cache')
    ) {
      void Client.startFetchLatestAssetsTimeout()
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
    //TODO:TextHashListが0の時のエラー処理
    await Client.setTextMapToCache(language)
  }
}
