import { LRUCache } from 'lru-cache'

import { CharacterDetail } from '@/adapter/output/enka/CharacterDetail'
import { EnkaAccount } from '@/adapter/output/enka/EnkaAccount'
import { GenshinAccount } from '@/adapter/output/enka/GenshinAccount'
import { PlayerDetail } from '@/adapter/output/enka/PlayerDetail'
import { RestClient } from '@/application/client/RestClient'
import { GeneralError } from '@/application/errors/GeneralError'
import {
  EnkaManagerEventMap,
  EnkaManagerEvents,
} from '@/application/types/events/enka'
import { PromiseEventEmitter } from '@/infrastructure/events/PromiseEventEmitter'
import type { EnkaStatusResponse } from '@/infrastructure/types/api/enkaNetwork/responses'
import {
  EnkaApiRoutes,
  EnkaStatusApiRoutes,
} from '@/infrastructure/types/api/enkaNetwork/routes'

/**
 * Cached EnkaData type
 */
export interface EnkaData {
  /**
   * UID
   */
  readonly uid: number
  /**
   * Player detail
   */
  readonly playerDetail: PlayerDetail
  /**
   * Character details
   */
  readonly characterDetails: CharacterDetail[]
  /**
   * UID owner Enka Account
   */
  readonly owner?: EnkaAccount
  /**
   * NextShowCaseDate
   */
  readonly nextShowCaseDate: Date
  /**
   * EnkaNetwork URL
   */
  readonly url: string
}

/**
 * Class for fetching EnkaData from enka.network
 */
export class EnkaManager extends PromiseEventEmitter<EnkaManagerEventMap> {
  /**
   * URL of enka.network
   */
  private static readonly ENKA_BASE_URL = 'https://enka.network'

  /**
   * Default headers
   */
  private static readonly defaultHeaders: HeadersInit = {
    'user-agent': `genshin-manager/${process.env.npm_package_version ?? 'unknown'}`,
  }

  /**
   * Enka API client
   */
  private static readonly enkaClient = new RestClient<EnkaApiRoutes>(
    EnkaManager.ENKA_BASE_URL,
    { headers: EnkaManager.defaultHeaders },
  )

  /**
   * Enka Status API client
   */
  private static readonly statusClient = new RestClient<EnkaStatusApiRoutes>(
    'http://status.enka.network',
    { headers: EnkaManager.defaultHeaders },
  )

  /**
   * Default maximum cache size
   */
  private static readonly DEFAULT_MAX_CACHE_SIZE = 100

  /**
   * Cache of EnkaData with LRU eviction
   * @key UID
   * @value Cached EnkaData
   */
  private readonly cache: LRUCache<number, EnkaData>

  /**
   * Create an EnkaManager
   * @param maxCacheSize - Maximum number of cached entries (default: 100)
   * @example
   * ```ts
   * const enkaManager = new EnkaManager()
   * const enkaManagerWithCustomSize = new EnkaManager(50)
   * ```
   */
  constructor(maxCacheSize: number = EnkaManager.DEFAULT_MAX_CACHE_SIZE) {
    super()
    this.cache = new LRUCache<number, EnkaData>({
      max: maxCacheSize,
    })
  }

  /**
   * Fetch All from enka.network
   * @description The data fetched by this method is stored as a temporary cache.
   *    The storage period depends on ttl.
   * @param uid - UID
   * @param fetchOptions - fetch options
   * @returns enka data
   * @example
   * ```ts
   * const enkaManager = new EnkaManager()
   * const data = await enkaManager.fetchAll(123456789)
   * console.log(data.playerDetail.nickname)
   * ```
   */
  public async fetchAll(
    uid: number,
    fetchOptions?: RequestInit,
  ): Promise<EnkaData> {
    return this.fetchUID(uid, false, fetchOptions)
  }

  /**
   * Fetch PlayerDetail from enka.network
   * @description The data fetched by this method is stored as a temporary cache.
   *    The storage period depends on ttl.
   * @param uid - UID
   * @param fetchOptions - fetch options
   * @returns player detail
   * @example
   * ```ts
   * const enkaManager = new EnkaManager()
   * const playerDetail = await enkaManager.fetchPlayerDetail(123456789)
   * console.log(playerDetail.nickname)
   * ```
   */
  public async fetchPlayerDetail(
    uid: number,
    fetchOptions?: RequestInit,
  ): Promise<PlayerDetail> {
    return (await this.fetchUID(uid, true, fetchOptions)).playerDetail
  }

  /**
   * Clear cache over nextShowCaseDate
   */
  public clearCacheOverNextShowCaseDate(): void {
    this.cache.forEach((value, key) => {
      if (new Date().getTime() > value.nextShowCaseDate.getTime())
        this.cache.delete(key)
    })
  }

  /**
   * Fetch EnkaAccount from enka.network
   * @description Data fetched by this method is not stored as a temporary cache.
   * @param username - enka account username
   * @param fetchOptions - fetch options
   * @returns enka account
   * @example
   * ```ts
   * const enkaManager = new EnkaManager()
   * const account = await enkaManager.fetchEnkaAccount('username')
   * console.log(account.nickname)
   * ```
   */
  public async fetchEnkaAccount(
    username: string,
    fetchOptions?: RequestInit,
  ): Promise<EnkaAccount> {
    const owner = await EnkaManager.enkaClient.fetch('/api/profile/:username', {
      params: { username },
      fetchOptions,
    })
    return new EnkaAccount(owner, EnkaManager.ENKA_BASE_URL)
  }

  /**
   * Fetch GenshinAccounts from enka.network
   * @description Data fetched by this method is not stored as a temporary cache.
   * @param username - enka account username
   * @param fetchOptions - fetch options
   * @returns genshin accounts
   * @example
   * ```ts
   * const enkaManager = new EnkaManager()
   * const accounts = await enkaManager.fetchGenshinAccounts('username')
   * console.log(accounts[0].uid)
   * ```
   */
  public async fetchGenshinAccounts(
    username: string,
    fetchOptions?: RequestInit,
  ): Promise<GenshinAccount[]> {
    const gameAccounts = await EnkaManager.enkaClient.fetch(
      '/api/profile/:username/hoyos',
      { params: { username }, fetchOptions },
    )

    return await Promise.all(
      Object.values(gameAccounts)
        .sort((a, b) => a.order - b.order)
        .filter((account) => account.hoyo_type === 0)
        .map(async (account) => {
          const builds = await EnkaManager.enkaClient.fetch(
            '/api/profile/:username/hoyos/:hash/builds',
            { params: { username, hash: account.hash }, fetchOptions },
          )
          return new GenshinAccount(
            account,
            builds,
            username,
            EnkaManager.ENKA_BASE_URL,
          )
        }),
    )
  }

  /**
   * Fetch Status from 1 hour ago to now
   * @param fetchOptions - fetch options
   * @returns status from 1 hour ago to now
   */
  public async fetchAllStatus(
    fetchOptions?: RequestInit,
  ): Promise<Record<string, EnkaStatusResponse>> {
    return await EnkaManager.statusClient.fetch('/api/status', {
      fetchOptions,
    })
  }

  /**
   * Fetch now Status
   * @param fetchOptions - fetch options
   * @returns now status
   */
  public async fetchNowStatus(
    fetchOptions?: RequestInit,
  ): Promise<EnkaStatusResponse> {
    return await EnkaManager.statusClient.fetch('/api/now', { fetchOptions })
  }

  /**
   * Fetch UID data from enka.network
   * @param uid - UID
   * @param infoOnly - fetch info only
   * @param fetchOptions - fetch options
   * @returns enka data
   */
  private async fetchUID(
    uid: number,
    infoOnly: boolean,
    fetchOptions?: RequestInit,
  ): Promise<EnkaData> {
    this.clearCacheOverNextShowCaseDate()
    if (!/1?\d{9}/.test(String(uid)))
      throw new GeneralError(`The UID format is not correct(${String(uid)})`)

    const cachedData = this.cache.get(uid)
    if (
      cachedData?.characterDetails &&
      new Date().getTime() < cachedData.nextShowCaseDate.getTime()
    )
      return cachedData

    const result = infoOnly
      ? await EnkaManager.enkaClient.fetch('/api/uid/:uid/?info', {
          params: { uid },
          fetchOptions,
        })
      : await EnkaManager.enkaClient.fetch('/api/uid/:uid', {
          params: { uid },
          fetchOptions,
        })

    const enkaData: EnkaData = {
      uid: uid,
      playerDetail: new PlayerDetail(result.playerInfo),
      characterDetails:
        result.avatarInfoList?.map(
          (avatarInfo) => new CharacterDetail(avatarInfo),
        ) ?? [],
      owner: result.owner
        ? new EnkaAccount(result.owner, EnkaManager.ENKA_BASE_URL)
        : undefined,
      nextShowCaseDate: new Date(
        new Date().getTime() + (result.ttl ?? 60) * 1000,
      ),
      url: `${EnkaManager.ENKA_BASE_URL}/u/${String(uid)}`,
    }
    this.cache.set(enkaData.uid, enkaData)
    this.emit(EnkaManagerEvents.GetNewEnkaData, enkaData)
    return enkaData
  }
}
