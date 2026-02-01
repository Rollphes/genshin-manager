import {
  enkaUidSchema,
  PromiseEventEmitter,
  RestClient,
  validate,
} from '@genshin-manager/core'
import { LRUCache } from 'lru-cache'

import { EnkaAccount } from '@/dto/EnkaAccount'
import { PlayerDetail } from '@/dto/PlayerDetail'
import type {
  AvatarInfoResponse,
  EnkaStatusResponse,
} from '@/types/api/responses'
import type { EnkaApiRoutes, EnkaStatusApiRoutes } from '@/types/api/routes'
import type { EnkaManagerEventMap } from '@/types/events'
import { EnkaManagerEvents } from '@/types/events'

/**
 * Cached EnkaData type
 */
export interface EnkaData {
  /** UID */
  readonly uid: number
  /** Player detail */
  readonly playerDetail: PlayerDetail
  /** Avatar info list (raw API data for downstream building) */
  readonly avatarInfoList: readonly AvatarInfoResponse[]
  /** UID owner Enka Account */
  readonly owner?: EnkaAccount
  /** NextShowCaseDate */
  readonly nextShowCaseDate: Date
  /** EnkaNetwork URL */
  readonly url: string
}

/**
 * Class for fetching EnkaData from enka.network
 */
export class EnkaManager extends PromiseEventEmitter<EnkaManagerEventMap> {
  private static readonly ENKA_BASE_URL = 'https://enka.network'

  private static readonly DEFAULT_MAX_CACHE_SIZE = 100

  private readonly enkaClient: RestClient<EnkaApiRoutes>
  private readonly statusClient: RestClient<EnkaStatusApiRoutes>
  private readonly cache: LRUCache<number, EnkaData>

  /**
   * Create an EnkaManager
   * @param maxCacheSize - Maximum number of cached entries (default: 100)
   */
  constructor(maxCacheSize: number = EnkaManager.DEFAULT_MAX_CACHE_SIZE) {
    super()
    const headers: HeadersInit = {
      'user-agent': 'genshin-manager',
    }
    this.enkaClient = new RestClient<EnkaApiRoutes>(EnkaManager.ENKA_BASE_URL, {
      headers,
    })
    this.statusClient = new RestClient<EnkaStatusApiRoutes>(
      'http://status.enka.network',
      { headers },
    )
    this.cache = new LRUCache<number, EnkaData>({ max: maxCacheSize })
  }

  /**
   * Fetch All from enka.network
   * @param uid - UID
   * @param fetchOptions - fetch options
   * @returns enka data
   * @throws {@link ValidationError} - If UID format is invalid
   */
  public async fetchAll(
    uid: number,
    fetchOptions?: RequestInit,
  ): Promise<EnkaData> {
    return this.fetchUID(uid, false, fetchOptions)
  }

  /**
   * Fetch PlayerDetail from enka.network
   * @param uid - UID
   * @param fetchOptions - fetch options
   * @returns player detail
   * @throws {@link ValidationError} - If UID format is invalid
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
   * @param username - enka account username
   * @param fetchOptions - fetch options
   * @returns enka account
   */
  public async fetchEnkaAccount(
    username: string,
    fetchOptions?: RequestInit,
  ): Promise<EnkaAccount> {
    const owner = await this.enkaClient.fetch('/api/profile/:username', {
      params: { username },
      fetchOptions,
    })
    return EnkaAccount.fromResponse(owner, EnkaManager.ENKA_BASE_URL)
  }

  /**
   * Fetch Status from 1 hour ago to now
   * @param fetchOptions - fetch options
   * @returns status from 1 hour ago to now
   */
  public async fetchAllStatus(
    fetchOptions?: RequestInit,
  ): Promise<Record<string, EnkaStatusResponse>> {
    return await this.statusClient.fetch('/api/status', { fetchOptions })
  }

  /**
   * Fetch now Status
   * @param fetchOptions - fetch options
   * @returns now status
   */
  public async fetchNowStatus(
    fetchOptions?: RequestInit,
  ): Promise<EnkaStatusResponse> {
    return await this.statusClient.fetch('/api/now', { fetchOptions })
  }

  /**
   * Fetch UID data from enka.network
   * @param uid - UID
   * @param infoOnly - fetch info only
   * @param fetchOptions - fetch options
   * @returns enka data
   * @throws {@link ValidationError} - If UID format is invalid
   */
  private async fetchUID(
    uid: number,
    infoOnly: boolean,
    fetchOptions?: RequestInit,
  ): Promise<EnkaData> {
    this.clearCacheOverNextShowCaseDate()
    validate(enkaUidSchema, uid)

    const cachedData = this.cache.get(uid)
    if (
      cachedData &&
      cachedData.avatarInfoList.length > 0 &&
      new Date().getTime() < cachedData.nextShowCaseDate.getTime()
    )
      return cachedData

    const result = infoOnly
      ? await this.enkaClient.fetch('/api/uid/:uid/?info', {
          params: { uid },
          fetchOptions,
        })
      : await this.enkaClient.fetch('/api/uid/:uid', {
          params: { uid },
          fetchOptions,
        })

    const enkaData: EnkaData = {
      uid,
      playerDetail: PlayerDetail.fromResponse(result.playerInfo),
      avatarInfoList: result.avatarInfoList ?? [],
      owner: result.owner
        ? EnkaAccount.fromResponse(result.owner, EnkaManager.ENKA_BASE_URL)
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
