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
  FileLocation,
  TextMapIndex,
} from '@genshin-manager/data'
import { EnkaManager } from '@genshin-manager/enka'
import type {
  Artifact,
  CharacterAscension,
  CharacterBaseStats,
  CharacterConstellation,
  CharacterCostume,
  CharacterInfo,
  CharacterInherentSkill,
  CharacterProfile,
  CharacterSkill,
  CharacterSkillAscension,
  CharacterStory,
  CharacterVoice,
  CVType,
  DailyFarming,
  Material,
  Monster,
  ProfilePicture,
  SetBonus,
  WeaponAscension,
  WeaponInfo,
  WeaponRefinement,
} from '@genshin-manager/models'
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
    assetCacheFolderPath: FileLocation.defaultCacheFolder().resolve(),
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

    FileLocation.deploy({
      assetCacheFolderPath: this.option.assetCacheFolderPath,
    })

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

  // ============================================================
  // Character API
  // ============================================================

  /**
   * Fetch CharacterInfo DTO
   * @param characterId - Character ID
   * @param skillDepotId - Skill depot ID (for travelers)
   * @returns CharacterInfo DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async fetchCharacterInfo(
    characterId: number,
    skillDepotId?: number,
  ): Promise<CharacterInfo> {
    return this.characterRepository.getCharacterInfo(characterId, skillDepotId)
  }

  /**
   * Fetch CharacterBaseStats DTO
   * @param characterId - Character ID
   * @param level - Character level (1-90)
   * @param isAscended - Whether character is ascended
   * @returns CharacterBaseStats DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async fetchCharacterBaseStats(
    characterId: number,
    level: number,
    isAscended: boolean,
  ): Promise<CharacterBaseStats> {
    return this.characterRepository.getCharacterBaseStats(
      characterId,
      level,
      isAscended,
    )
  }

  /**
   * Fetch CharacterAscension DTO
   * @param characterId - Character ID
   * @param promoteLevel - Promote level (0-6)
   * @returns CharacterAscension DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async fetchCharacterAscension(
    characterId: number,
    promoteLevel: number,
  ): Promise<CharacterAscension> {
    return this.characterRepository.getCharacterAscension(
      characterId,
      promoteLevel,
    )
  }

  /**
   * Fetch all character IDs
   * @returns Array of character IDs
   */
  public async fetchAllCharacterIds(): Promise<number[]> {
    return this.characterRepository.getAllCharacterIds()
  }

  /**
   * Fetch CharacterConstellation DTOs for a character
   * @param characterId - Character ID
   * @param constellationLevel - Unlocked constellation level (0-6)
   * @param skillDepotId - Skill depot ID (for travelers)
   * @returns Array of CharacterConstellation DTOs
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async fetchCharacterConstellations(
    characterId: number,
    constellationLevel = 0,
    skillDepotId?: number,
  ): Promise<readonly CharacterConstellation[]> {
    const info = await this.characterRepository.getCharacterInfo(
      characterId,
      skillDepotId,
    )
    return this.characterRepository.getConstellations(
      info.constellationIds,
      constellationLevel,
    )
  }

  /**
   * Fetch CharacterInherentSkill DTOs for a character
   * @param characterId - Character ID
   * @param skillDepotId - Skill depot ID (for travelers)
   * @returns Array of CharacterInherentSkill DTOs
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async fetchCharacterInherentSkills(
    characterId: number,
    skillDepotId?: number,
  ): Promise<readonly CharacterInherentSkill[]> {
    const info = await this.characterRepository.getCharacterInfo(
      characterId,
      skillDepotId,
    )
    return this.characterRepository.getInherentSkills(info.inherentSkillOrder)
  }

  /**
   * Fetch CharacterProfile DTO for a character
   * @param characterId - Character ID
   * @returns CharacterProfile DTO or undefined
   */
  public async fetchCharacterProfile(
    characterId: number,
  ): Promise<CharacterProfile | undefined> {
    return this.characterRepository.getCharacterProfile(characterId)
  }

  /**
   * Fetch CharacterStory DTOs for a character
   * @param characterId - Character ID
   * @returns Array of CharacterStory DTOs
   */
  public async fetchCharacterStories(
    characterId: number,
  ): Promise<readonly CharacterStory[]> {
    return this.characterRepository.getCharacterStories(characterId)
  }

  /**
   * Fetch CharacterCostume DTOs for a character
   * @param characterId - Character ID
   * @returns Array of CharacterCostume DTOs
   */
  public async fetchCharacterCostumes(
    characterId: number,
  ): Promise<readonly CharacterCostume[]> {
    return this.characterRepository.getCharacterCostumes(characterId)
  }

  /**
   * Fetch CharacterSkill DTO
   * @param skillId - Skill ID
   * @param level - Skill level (default: 1)
   * @param extraLevel - Extra levels from constellations (default: 0)
   * @returns CharacterSkill DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async fetchCharacterSkill(
    skillId: number,
    level = 1,
    extraLevel = 0,
  ): Promise<CharacterSkill> {
    return this.characterRepository.getCharacterSkill(
      skillId,
      level,
      extraLevel,
    )
  }

  /**
   * Fetch CharacterSkillAscension DTO (skill level-up costs)
   * @param proudSkillGroupId - Proud skill group ID (from CharacterInfo.proudMap)
   * @param level - Target skill level
   * @returns CharacterSkillAscension DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async fetchCharacterSkillAscension(
    proudSkillGroupId: number,
    level: number,
  ): Promise<CharacterSkillAscension> {
    return this.characterRepository.getCharacterSkillAscension(
      proudSkillGroupId,
      level,
    )
  }

  /**
   * Fetch CharacterVoice DTOs for a character
   * @param characterId - Character ID
   * @param cv - CV language type (e.g., 'ja', 'en', 'zh-cn', 'ko')
   * @returns Array of CharacterVoice DTOs
   */
  public async fetchCharacterVoices(
    characterId: number,
    cv: CVType,
  ): Promise<readonly CharacterVoice[]> {
    return this.characterRepository.getCharacterVoices(characterId, cv)
  }

  /**
   * Fetch character IDs by name (partial match)
   * @param name - Character name to search
   * @returns Array of matching character IDs
   */
  public async fetchCharacterIdsByName(name: string): Promise<number[]> {
    return this.characterRepository.getCharacterIdsByName(name)
  }

  /**
   * Fetch available skill depot IDs for a traveler
   * @param characterId - Traveler character ID (10000005 or 10000007)
   * @returns Array of skill depot IDs
   */
  public async fetchTravelerSkillDepotIds(
    characterId: number,
  ): Promise<number[]> {
    return this.characterRepository.getTravelerSkillDepotIds(characterId)
  }

  // ============================================================
  // Weapon API
  // ============================================================

  /**
   * Fetch WeaponInfo DTO
   * @param weaponId - Weapon ID
   * @param level - Weapon level (1-90)
   * @param isAscended - Whether weapon is ascended
   * @param refinementRank - Refinement rank (1-5)
   * @returns WeaponInfo DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async fetchWeaponInfo(
    weaponId: number,
    level = 1,
    isAscended = false,
    refinementRank = 1,
  ): Promise<WeaponInfo> {
    return this.weaponRepository.getWeaponInfo(
      weaponId,
      level,
      isAscended,
      refinementRank,
    )
  }

  /**
   * Fetch WeaponAscension DTO
   * @param weaponId - Weapon ID
   * @param promoteLevel - Promote level (0-6)
   * @returns WeaponAscension DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async fetchWeaponAscension(
    weaponId: number,
    promoteLevel: number,
  ): Promise<WeaponAscension> {
    return this.weaponRepository.getWeaponAscension(weaponId, promoteLevel)
  }

  /**
   * Fetch WeaponRefinement DTO
   * @param weaponId - Weapon ID
   * @param refinementRank - Refinement rank (1-5)
   * @returns WeaponRefinement DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async fetchWeaponRefinement(
    weaponId: number,
    refinementRank: number,
  ): Promise<WeaponRefinement> {
    return this.weaponRepository.getWeaponRefinement(weaponId, refinementRank)
  }

  /**
   * Fetch all weapon IDs
   * @returns Array of weapon IDs
   */
  public async fetchAllWeaponIds(): Promise<number[]> {
    return this.weaponRepository.getAllWeaponIds()
  }

  // ============================================================
  // Artifact API
  // ============================================================

  /**
   * Fetch Artifact DTO
   * @param artifactId - Artifact ID
   * @param mainPropId - Main stat ID from ReliquaryMainPropExcelConfigData
   * @param level - Artifact level (0-20)
   * @param appendPropIds - Sub-stat append prop IDs
   * @returns Artifact DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async fetchArtifact(
    artifactId: number,
    mainPropId = 10001,
    level = 0,
    appendPropIds: readonly number[] = [],
  ): Promise<Artifact> {
    return this.artifactRepository.getArtifact(
      artifactId,
      mainPropId,
      level,
      appendPropIds,
    )
  }

  /**
   * Fetch all obtainable artifact IDs
   * @returns Array of artifact IDs
   */
  public async fetchAllArtifactIds(): Promise<number[]> {
    return this.artifactRepository.getAllArtifactIds()
  }

  /**
   * Build SetBonus from equipped artifacts
   * @param artifacts - Array of equipped Artifact DTOs
   * @returns SetBonus DTO
   */
  public buildSetBonus(artifacts: readonly Artifact[]): SetBonus {
    return this.artifactRepository.buildSetBonus(artifacts)
  }

  /**
   * Get max level for an artifact by rarity
   * @param rarity - Artifact rarity (1-5)
   * @returns Max level
   */
  public getArtifactMaxLevel(rarity: number): number {
    return this.artifactRepository.getMaxLevel(rarity)
  }

  // ============================================================
  // Material API
  // ============================================================

  /**
   * Fetch Material DTO
   * @param materialId - Material ID
   * @returns Material DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async fetchMaterial(materialId: number): Promise<Material> {
    return this.materialRepository.getMaterial(materialId)
  }

  /**
   * Fetch all material IDs
   * @returns Array of material IDs
   */
  public async fetchAllMaterialIds(): Promise<number[]> {
    return this.materialRepository.getAllMaterialIds()
  }

  // ============================================================
  // Monster API
  // ============================================================

  /**
   * Fetch Monster DTO
   * @param monsterId - Monster ID
   * @param level - Monster level
   * @param playerCount - Player count (1-4)
   * @returns Monster DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async fetchMonster(
    monsterId: number,
    level = 1,
    playerCount = 1,
  ): Promise<Monster> {
    return this.monsterRepository.getMonster(monsterId, level, playerCount)
  }

  /**
   * Fetch all monster IDs
   * @returns Array of monster IDs
   */
  public async fetchAllMonsterIds(): Promise<number[]> {
    return this.monsterRepository.getAllMonsterIds()
  }

  // ============================================================
  // ProfilePicture API
  // ============================================================

  /**
   * Fetch ProfilePicture DTO
   * @param profilePictureId - Profile picture ID
   * @returns ProfilePicture DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async fetchProfilePicture(
    profilePictureId: number,
  ): Promise<ProfilePicture> {
    return this.profilePictureRepository.getProfilePicture(profilePictureId)
  }

  /**
   * Fetch all profile picture IDs
   * @returns Array of profile picture IDs
   */
  public async fetchAllProfilePictureIds(): Promise<number[]> {
    return this.profilePictureRepository.getAllProfilePictureIds()
  }

  // ============================================================
  // DailyFarming API
  // ============================================================

  /**
   * Fetch DailyFarming DTO
   * @param dayOfWeek - Day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
   * @returns DailyFarming DTO
   */
  public async fetchDailyFarming(dayOfWeek: number): Promise<DailyFarming> {
    return this.dailyFarmingRepository.getDailyFarming(dayOfWeek)
  }

  // ============================================================
  // Lifecycle
  // ============================================================

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
            try {
              await this.updateCache()
            } catch (error) {
              logger.error(
                'GenshinManager: Cron task failed',
                error instanceof Error ? error : new Error(String(error)),
              )
            }
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
      FileLocation.excelBinFolder().resolve(),
      FileLocation.textMapFolder().resolve(),
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
