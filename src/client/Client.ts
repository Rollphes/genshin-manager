import { merge } from 'lodash'
import path from 'path'

import { AssetCacheManager } from '@/client/AssetCacheManager'
import { AssetsNotFoundError } from '@/errors/AssetsNotFoundError'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { ClientOption, ExcelBinOutputs, TextMapLanguage } from '@/types'
import { JsonObject } from '@/utils/JsonParser'

export class Client extends AssetCacheManager {
  public readonly option: ClientOption

  constructor(option?: Partial<ClientOption>) {
    super()
    const defaultOption: ClientOption = {
      enkaNetwork: {
        url: 'https://enka.network',
        timeout: 3000,
        userAgent: 'Mozilla/5.0',
      },
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
      autoFetchLatestExcelBinOutput: true,
      autoCacheImage: true,
      assetCacheFolderPath: path.resolve(__dirname, '..', '..', 'cache'),
    }

    this.option = option
      ? merge<ClientOption, Partial<ClientOption>>(defaultOption, option)
      : defaultOption
  }

  public async deploy() {
    if (!module.parent) {
      throw new Error('module.parent is undefined.')
    }
    await Client.deploy(this, module.parent.children)
    ImageAssets.deploy(this)
  }

  public async changeLanguage(language: keyof typeof TextMapLanguage) {
    await Client.setTextMapToCache(language)
  /**
   * Deploy assets to cache & Update assets
   * @example
   * ```ts
   * const client = new Client()
   * await client.deploy()
   * ```
   */
  }

  public static cachedExcelBinOutputGetter(
    key: keyof typeof ExcelBinOutputs,
    id: string | number,
  ) {
    const excelBinOutput = Client.cachedExcelBinOutput.get(key)
    if (!excelBinOutput) {
      throw new AssetsNotFoundError(key)
    }
    const json = excelBinOutput.get(String(id)) as JsonObject | undefined
    if (!json) {
      throw new AssetsNotFoundError(key, id)
    }
    return json
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
  }
}
