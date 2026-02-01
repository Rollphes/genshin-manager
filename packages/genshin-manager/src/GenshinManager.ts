import type { Language } from '@genshin-manager/core'
import {
  GeneralError,
  logger,
  LogLevel,
  PromiseEventEmitter,
  RestClient,
} from '@genshin-manager/core'
import {
  ExcelBinCache,
  ExcelBinOutputs,
  Location,
  TextMapIndex,
} from '@genshin-manager/data'
import { EnkaManager } from '@genshin-manager/enka'
import {
  ArtifactRepository,
  CharacterRepository,
  DailyFarmingRepository,
  MaterialRepository,
  MonsterRepository,
  ProfilePictureRepository,
  WeaponRepository,
} from '@genshin-manager/models'
import { NoticeManager } from '@genshin-manager/notice'
import type { GitLabApiRoutes } from '@genshin-manager/sync'
import {
  AssetDownloader,
  getTextMapFileNamesFromGitLab,
  VersionChecker,
} from '@genshin-manager/sync'
import fs from 'fs'
import type { ScheduledTask } from 'node-cron'
import cron from 'node-cron'
import { merge } from 'ts-deepmerge'

import type { ClientOption } from '@/types'
import type { GenshinManagerEventMap } from '@/types'
import { GenshinManagerEvents } from '@/types'

/**
 * Main facade for the Genshin Manager library.
 * Orchestrates asset caching, data loading, Enka integration, and notice tracking.
 */
export class GenshinManager extends PromiseEventEmitter<GenshinManagerEventMap> {
  private static readonly GITLAB_PROJECT_ID = 53216109
  private static readonly MAX_RETRY_COUNT = 3

  private static readonly defaultOption: ClientOption = {
    fetchOption: {
      headers: {
        'user-agent': 'genshin-manager',
      },
    },
    downloadLanguages: [
      'en' as Language,
      'ru' as Language,
      'vi' as Language,
      'th' as Language,
      'pt' as Language,
      'ko' as Language,
      'ja' as Language,
      'id' as Language,
      'fr' as Language,
      'es' as Language,
      'de' as Language,
      'zh-tw' as Language,
      'zh-cn' as Language,
    ],
    defaultImageBaseURL: 'https://gi.yatta.top/assets/UI',
    defaultAudioBaseURL: 'https://gi.yatta.top/assets/Audio',
    imageBaseURLByRegex: {
      'https://enka.network/ui': [
        /^UI_(AvatarIcon_Side|Costume)_/,
        /^UI_AvatarIcon_(.+)_Card$/,
        /^UI_AvatarIcon_(.+)_Circle/,
        /^UI_NameCardPic_(.+)_Alpha/,
        /^UI_EquipIcon_(.+)_Awaken/,
      ],
      'https://res.cloudinary.com/genshin/image/upload/sprites': [
        /^Eff_UI_Talent_/,
        /^UI_(TowerPic|TowerBlessing|GcgIcon|Gcg_Cardtable|Gcg_CardBack)_/,
      ],
      'https://gi.yatta.top/assets/UI/monster': [
        /^UI_(MonsterIcon|AnimalIcon)_/,
      ],
      'https://gi.yatta.top/assets/UI/gcg': [/^UI_Gcg_CardFace_/],
      'https://gi.yatta.top/assets/UI/reliquary': [/^UI_RelicIcon_/],
      'https://gi.yatta.top/assets/UI/namecard': [/^UI_NameCard/],
    },
    audioBaseURLByRegex: {},
    defaultLanguage: 'en' as Language,
    logLevel: LogLevel.NONE,
    autoFetchLatestAssetsByCron: '0 0 0 * * 3',
    autoCacheImage: true,
    autoCacheAudio: true,
    autoFixTextMap: true,
    autoFixExcelBin: true,
    assetCacheFolderPath: Location.defaultCacheFolderPath,
  }

  /**
   * Client options
   */
  public readonly option: ClientOption

  /**
   * Enka.Network manager
   */
  public readonly enka: EnkaManager

  /**
   * Notice manager
   */
  public readonly notices: NoticeManager

  private readonly gitlabApiClient: RestClient<GitLabApiRoutes>
  private readonly assetDownloader: AssetDownloader
  private readonly versionChecker: VersionChecker
  private readonly excelBinCache: ExcelBinCache
  private readonly textMapIndex: TextMapIndex
  private readonly characterRepository: CharacterRepository
  private readonly weaponRepository: WeaponRepository
  private readonly artifactRepository: ArtifactRepository
  private readonly materialRepository: MaterialRepository
  private readonly monsterRepository: MonsterRepository
  private readonly profilePictureRepository: ProfilePictureRepository
  private readonly dailyFarmingRepository: DailyFarmingRepository
  private textHashes = new Set<number>()
  private cronTask: ScheduledTask | undefined
  private isDestroyed = false

  /**
   * Create a GenshinManager
   * @param option - client option
   */
  constructor(option?: Partial<ClientOption>) {
    super()
    const baseOption = merge.withOptions(
      { mergeArrays: false },
      GenshinManager.defaultOption,
      option ?? {},
    ) as ClientOption

    const downloadLanguages = [
      ...new Set([baseOption.defaultLanguage, ...baseOption.downloadLanguages]),
    ]

    const autoFixTextMap = baseOption.autoFetchLatestAssetsByCron
      ? baseOption.autoFixTextMap
      : false
    const autoFixExcelBin = baseOption.autoFetchLatestAssetsByCron
      ? baseOption.autoFixExcelBin
      : false

    this.option = {
      ...baseOption,
      downloadLanguages,
      autoFixTextMap,
      autoFixExcelBin,
    }

    const logLevel = this.option.logLevel ?? LogLevel.NONE
    logger.configure({ level: logLevel })

    Location.deploy({ assetCacheFolderPath: this.option.assetCacheFolderPath })

    this.gitlabApiClient = new RestClient<GitLabApiRoutes>(
      'https://gitlab.com',
      {
        headers: this.option.fetchOption.headers,
        retry: 3,
        retryDelay: 100,
      },
    )

    this.assetDownloader = new AssetDownloader({
      restClient: this.gitlabApiClient,
      projectId: GenshinManager.GITLAB_PROJECT_ID,
    })

    this.versionChecker = new VersionChecker({
      projectId: GenshinManager.GITLAB_PROJECT_ID,
      restClient: this.gitlabApiClient,
    })

    this.excelBinCache = new ExcelBinCache({
      autoFix: this.option.autoFixExcelBin,
    })

    this.textMapIndex = new TextMapIndex({
      autoFix: this.option.autoFixTextMap,
    })

    const deps = {
      excelBinCache: this.excelBinCache,
      textMap: this.textMapIndex,
    }
    const imageBaseURL = this.option.defaultImageBaseURL

    this.characterRepository = new CharacterRepository(deps, imageBaseURL)
    this.weaponRepository = new WeaponRepository(deps, imageBaseURL)
    this.artifactRepository = new ArtifactRepository(deps, imageBaseURL)
    this.materialRepository = new MaterialRepository(deps, imageBaseURL)
    this.monsterRepository = new MonsterRepository(deps, imageBaseURL)
    this.profilePictureRepository = new ProfilePictureRepository(
      deps,
      imageBaseURL,
    )
    this.dailyFarmingRepository = new DailyFarmingRepository(deps)

    this.enka = new EnkaManager()
    this.notices = new NoticeManager(this.option.defaultLanguage)
  }

  /**
   * Cached game version
   * @returns cached game version
   */
  public get gameVersion(): string | undefined {
    return this.versionChecker.getGameVersion()
  }

  /**
   * Get current language
   * @returns Current language
   */
  public get currentLanguage(): Language {
    return this.textMapIndex.currentLanguage ?? this.option.defaultLanguage
  }

  /**
   * Get ExcelBin cache for direct access
   * @returns ExcelBinCache instance
   */
  public get excelBin(): ExcelBinCache {
    return this.excelBinCache
  }

  /**
   * Get TextMap index for direct access
   * @returns TextMapIndex instance
   */
  public get textMap(): TextMapIndex {
    return this.textMapIndex
  }

  /**
   * Character repository
   * @returns CharacterRepository instance
   */
  public get characters(): CharacterRepository {
    return this.characterRepository
  }

  /**
   * Weapon repository
   * @returns WeaponRepository instance
   */
  public get weapons(): WeaponRepository {
    return this.weaponRepository
  }

  /**
   * Artifact repository
   * @returns ArtifactRepository instance
   */
  public get artifacts(): ArtifactRepository {
    return this.artifactRepository
  }

  /**
   * Material repository
   * @returns MaterialRepository instance
   */
  public get materials(): MaterialRepository {
    return this.materialRepository
  }

  /**
   * Monster repository
   * @returns MonsterRepository instance
   */
  public get monsters(): MonsterRepository {
    return this.monsterRepository
  }

  /**
   * Profile picture repository
   * @returns ProfilePictureRepository instance
   */
  public get profilePictures(): ProfilePictureRepository {
    return this.profilePictureRepository
  }

  /**
   * Daily farming repository
   * @returns DailyFarmingRepository instance
   */
  public get dailyFarming(): DailyFarmingRepository {
    return this.dailyFarmingRepository
  }

  /**
   * Deploy assets to cache and update
   */
  public async deploy(): Promise<void> {
    await this.updateCache()
    if (this.option.autoFetchLatestAssetsByCron) {
      this.cronTask = cron.schedule(
        this.option.autoFetchLatestAssetsByCron,
        () => {
          void (async (): Promise<void> => {
            await this.updateCache()
          })()
        },
      )
    }
  }

  /**
   * Destroy the client and release all resources
   */
  public async destroy(): Promise<void> {
    if (this.isDestroyed) return

    this.cronTask?.stop()
    this.cronTask = undefined
    await this.textMapIndex.close()
    this.removeAllListeners()
    this.isDestroyed = true
  }

  /**
   * Change cached language
   * @param language - Target language
   */
  public async changeLanguage(language: Language): Promise<void> {
    await this.loadTextMapWithRetry(language)
  }

  /**
   * Update cache
   */
  private async updateCache(): Promise<void> {
    logger.info('GenshinManager: Start update cache.')

    this.ensureFolders()

    const newVersionText = await this.versionChecker.checkForUpdate()
    if (!this.gameVersion) return

    if (newVersionText && this.option.autoFetchLatestAssetsByCron) {
      await this.downloadNewAssets(newVersionText)
    } else {
      logger.info(
        `GenshinManager: No new Asset found. Set cache. GameVersion: ${this.gameVersion}`,
      )
    }

    await this.loadCache()
    logger.info('GenshinManager: Finish update cache and set cache.')
  }

  /**
   * Download new assets from GitLab
   * @param versionText - Version text
   */
  private async downloadNewAssets(versionText: string): Promise<void> {
    this.emit(GenshinManagerEvents.BeginUpdateAssets, versionText)
    logger.info(
      `GenshinManager: New Asset found. Update Assets. GameVersion: ${versionText}`,
    )

    await this.fetchAssetFolder(
      'ExcelBinOutput',
      Object.values(ExcelBinOutputs),
    )

    await this.loadExcelBinCacheWithRetry(ExcelBinCache.allKeys)
    this.textHashes = this.excelBinCache.extractTextHashes()

    const textMapFileNamesMap = await getTextMapFileNamesFromGitLab(
      this.option.downloadLanguages,
      {
        restClient: this.gitlabApiClient,
        projectId: GenshinManager.GITLAB_PROJECT_ID,
        commitId: this.versionChecker.commitId,
      },
    )
    const textMapFileNames = [...textMapFileNamesMap.values()].flat()

    await this.fetchAssetFolder('TextMap', textMapFileNames)

    this.emit(GenshinManagerEvents.EndUpdateAssets, versionText)
    logger.info('GenshinManager: Set cache.')
  }

  /**
   * Load cache from local files
   */
  private async loadCache(): Promise<void> {
    this.emit(GenshinManagerEvents.BeginUpdateCache, this.gameVersion ?? '')

    await this.loadExcelBinCacheWithRetry(ExcelBinCache.allKeys)
    this.textHashes = this.excelBinCache.extractTextHashes()

    await this.loadTextMapWithRetry(this.option.defaultLanguage)

    this.emit(GenshinManagerEvents.EndUpdateCache, this.gameVersion ?? '')
  }

  /**
   * Ensure cache folders exist
   */
  private ensureFolders(): void {
    const folders = [
      this.option.assetCacheFolderPath,
      Location.excelBinFolderPath,
      Location.textMapFolderPath,
    ]
    for (const folder of folders)
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true })
  }

  /**
   * Fetch asset folder from GitLab
   * @param gitFolderName - Git folder name ('ExcelBinOutput' or 'TextMap')
   * @param files - Files to download
   * @param isRetry - Whether this is a retry
   */
  private async fetchAssetFolder(
    gitFolderName: 'ExcelBinOutput' | 'TextMap',
    files: string[],
    isRetry = false,
  ): Promise<void> {
    this.assetDownloader.commitId = this.versionChecker.commitId
    this.assetDownloader.textHashes = this.textHashes

    await this.assetDownloader.downloadFolder(gitFolderName, files, isRetry)
  }

  /**
   * Load ExcelBin cache with automatic re-download on failure
   * @param keys - Keys to load
   * @throws {@link GeneralError} - If max retry count exceeded
   */
  private async loadExcelBinCacheWithRetry(
    keys: Set<keyof typeof ExcelBinOutputs>,
  ): Promise<void> {
    let result = await this.excelBinCache.load(keys)
    let retryCount = 0
    while (result.redownloadRequired) {
      if (retryCount >= GenshinManager.MAX_RETRY_COUNT) {
        throw new GeneralError(
          `ExcelBin load max retry count (${String(GenshinManager.MAX_RETRY_COUNT)}) exceeded`,
        )
      }

      await this.fetchAssetFolder(
        'ExcelBinOutput',
        Object.values(ExcelBinOutputs),
        true,
      )
      result = await this.excelBinCache.load(keys)
      retryCount++
    }
  }

  /**
   * Load TextMap with index build and preload
   * @param language - Target language
   * @throws {@link GeneralError} - If max retry count exceeded
   */
  private async loadTextMapWithRetry(language: Language): Promise<void> {
    let retryCount = 0

    while (retryCount < GenshinManager.MAX_RETRY_COUNT) {
      try {
        // Build index for the language
        await this.textMapIndex.buildIndex(language)

        // Preload all required text hashes into LRU cache
        await this.textMapIndex.batchLoad(this.textHashes, language)

        logger.debug(
          `GenshinManager: TextMap loaded for ${language} (${String(this.textHashes.size)} hashes)`,
        )
        return
      } catch {
        retryCount++
        if (retryCount >= GenshinManager.MAX_RETRY_COUNT) {
          throw new GeneralError(
            `TextMap load max retry count (${String(GenshinManager.MAX_RETRY_COUNT)}) exceeded`,
          )
        }

        // Re-download TextMap files
        const textMapFileNamesMap = await getTextMapFileNamesFromGitLab(
          [language],
          {
            restClient: this.gitlabApiClient,
            projectId: GenshinManager.GITLAB_PROJECT_ID,
            commitId: this.versionChecker.commitId,
          },
        )
        const textMapFileNames = textMapFileNamesMap.get(language) ?? []

        await this.fetchAssetFolder('TextMap', textMapFileNames, true)
      }
    }
  }
}
