import { merge } from 'ts-deepmerge'

import { EnkaManagerError } from '@/errors/EnkaManagerError'
import { EnkaNetworkError } from '@/errors/EnkaNetWorkError'
import { EnkaNetWorkStatusError } from '@/errors/EnkaNetWorkStatusError'
import { CharacterDetail } from '@/models/enka/CharacterDetail'
import { EnkaAccount } from '@/models/enka/EnkaAccount'
import { GenshinAccount } from '@/models/enka/GenshinAccount'
import { PlayerDetail } from '@/models/enka/PlayerDetail'
import {
  APIBuild,
  APIEnkaStatus,
  APIGameAccount,
  APIOwner,
} from '@/types/enkaNetwork'
import { APIEnkaData } from '@/types/enkaNetwork/EnkaTypes'
import { PromiseEventEmitter } from '@/utils/PromiseEventEmitter'

/**
 * cached EnkaData type
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
 * EnkaManager events
 * @see {@link EnkaManager}
 */
export enum EnkaManagerEvents {
  /**
   * When new data is added to the cache, fires
   * @event GET_NEW_ENKA_DATA
   * @listener
   * | param | type | description |
   * | --- | --- | --- |
   * | data | {@link EnkaData} | New data added to the cache |
   */
  GET_NEW_ENKA_DATA = 'GET_NEW_ENKA_DATA',
}

interface EnkaManagerEventMap {
  GET_NEW_ENKA_DATA: [data: EnkaData]
}

/**
 * Class for fetching EnkaData from enka.network
 */
export class EnkaManager extends PromiseEventEmitter<
  EnkaManagerEventMap,
  EnkaManagerEvents
> {
  /**
   * URL of enka.network
   */
  private static readonly ENKA_BASE_URL = 'https://enka.network'
  /**
   * URL of status.enka.network
   */
  private static readonly ENKA_STATUS_BASE_URL = 'http://status.enka.network'
  /**
   * Default fetch option
   */
  private static readonly defaultFetchOption: RequestInit = {
    headers: {
      'user-agent': `genshin-manager/${process.env.npm_package_version}`,
    },
  }

  /**
   * Cache of EnkaData
   * @key UID
   * @value Cached EnkaData
   */
  private readonly cache = new Map<number, EnkaData>()

  /**
   * Fetch All from enka.network
   * @description The data fetched by this method is stored as a temporary cache.
   *    The storage period depends on ttl.
   * @param uid UID
   * @param fetchOption Fetch option
   * @returns EnkaData
   */
  public async fetchAll(
    uid: number,
    fetchOption?: RequestInit,
  ): Promise<EnkaData> {
    const url = `${EnkaManager.ENKA_BASE_URL}/api/uid/${uid}`
    return await this.fetchUID(uid, url, fetchOption)
  }

  /**
   * Fetch PlayerDetail from enka.network
   * @description The data fetched by this method is stored as a temporary cache.
   *    The storage period depends on ttl.
   * @param uid UID
   * @param fetchOption Fetch option
   * @returns PlayerDetail
   */
  public async fetchPlayerDetail(
    uid: number,
    fetchOption?: RequestInit,
  ): Promise<PlayerDetail> {
    const url = `${EnkaManager.ENKA_BASE_URL}/api/uid/${uid}/?info`
    return (await this.fetchUID(uid, url, fetchOption)).playerDetail
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
   * @param username Enka Account Username
   * @param fetchOption Fetch option
   * @returns EnkaAccount
   */
  public async fetchEnkaAccount(
    username: string,
    fetchOption?: RequestInit,
  ): Promise<EnkaAccount> {
    const getOwnerURL = `${EnkaManager.ENKA_BASE_URL}/api/profile/${username}`
    const mergedFetchOption = merge.withOptions(
      { mergeArrays: false },
      EnkaManager.defaultFetchOption,
      fetchOption ?? {},
    )
    const ownerRes = await fetch(getOwnerURL, mergedFetchOption)
    if (!ownerRes.ok) throw new EnkaNetworkError(ownerRes)
    const owner = (await ownerRes.json()) as APIOwner
    return new EnkaAccount(owner, EnkaManager.ENKA_BASE_URL)
  }

  /**
   * Fetch GenshinAccounts from enka.network
   * @description Data fetched by this method is not stored as a temporary cache.
   * @param username Enka Account Username
   * @param fetchOption Fetch option
   * @returns GenshinAccounts
   */
  public async fetchGenshinAccounts(
    username: string,
    fetchOption?: RequestInit,
  ): Promise<GenshinAccount[]> {
    const getGameAccountsURL = `${EnkaManager.ENKA_BASE_URL}/api/profile/${username}/hoyos`
    const mergedFetchOption = merge.withOptions(
      { mergeArrays: false },
      EnkaManager.defaultFetchOption,
      fetchOption ?? {},
    )
    const gameAccountsRes = await fetch(getGameAccountsURL, mergedFetchOption)
    if (!gameAccountsRes.ok) throw new EnkaNetworkError(gameAccountsRes)
    const gameAccounts = (await gameAccountsRes.json()) as Record<
      string,
      APIGameAccount
    >
    return await Promise.all(
      Object.values(gameAccounts)
        .sort((a, b) => a.order - b.order)
        .filter((account) => account.hoyo_type === 0)
        .map(async (account) => {
          const getBuildsURL = `${EnkaManager.ENKA_BASE_URL}/api/profile/${username}/hoyos/${account.hash}/builds`
          const buildsRes = await fetch(getBuildsURL, mergedFetchOption)
          if (!buildsRes.ok) throw new EnkaNetworkError(buildsRes)
          const builds = (await buildsRes.json()) as Record<string, APIBuild[]>
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
   * @param fetchOption Fetch option
   * @returns Status from 1 hour ago to now
   */
  public async fetchAllStatus(
    fetchOption?: RequestInit,
  ): Promise<Record<string, APIEnkaStatus>> {
    const getStatusURL = `${EnkaManager.ENKA_STATUS_BASE_URL}/api/status`
    const mergedFetchOption = merge.withOptions(
      { mergeArrays: false },
      EnkaManager.defaultFetchOption,
      fetchOption ?? {},
    )
    const statusRes = await fetch(getStatusURL, mergedFetchOption)
    if (!statusRes.ok) throw new EnkaNetWorkStatusError(statusRes)

    return (await statusRes.json()) as Record<string, APIEnkaStatus>
  }

  /**
   * Fetch now Status
   * @param fetchOption Fetch option
   * @returns Now status
   */
  public async fetchNowStatus(
    fetchOption?: RequestInit,
  ): Promise<APIEnkaStatus> {
    const getStatusURL = `${EnkaManager.ENKA_STATUS_BASE_URL}/api/now`
    const mergedFetchOption = merge.withOptions(
      { mergeArrays: false },
      EnkaManager.defaultFetchOption,
      fetchOption ?? {},
    )
    const statusRes = await fetch(getStatusURL, mergedFetchOption)
    if (!statusRes.ok) throw new EnkaNetWorkStatusError(statusRes)

    return (await statusRes.json()) as APIEnkaStatus
  }

  /**
   * Fetch UIDEndPoint from URL
   * @param uid UID
   * @param url URL
   * @param fetchOption Fetch option
   * @returns EnkaData
   */
  private async fetchUID(
    uid: number,
    url: string,
    fetchOption?: RequestInit,
  ): Promise<EnkaData> {
    this.clearCacheOverNextShowCaseDate()
    if (!/1?\d{9}/.test(String(uid)))
      throw new EnkaManagerError(`The UID format is not correct(${uid})`)
    const cachedData = this.cache.get(uid)
    if (
      cachedData?.characterDetails &&
      new Date().getTime() < cachedData.nextShowCaseDate.getTime()
    )
      return cachedData

    const mergedFetchOption = merge.withOptions(
      { mergeArrays: false },
      EnkaManager.defaultFetchOption,
      fetchOption ?? {},
    )
    const res = await fetch(url, mergedFetchOption)
    if (!res.ok) throw new EnkaNetworkError(res)

    const result = (await res.json()) as APIEnkaData
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
      url: `${EnkaManager.ENKA_BASE_URL}/u/${uid}`,
    }
    this.cache.set(enkaData.uid, enkaData)
    this.emit(EnkaManagerEvents.GET_NEW_ENKA_DATA, enkaData)
    return enkaData
  }
}
