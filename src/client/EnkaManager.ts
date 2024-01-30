import { merge } from 'ts-deepmerge'

import { EnkaManagerError } from '@/errors/EnkaManagerError'
import { EnkaNetworkError } from '@/errors/EnkaNetWorkError'
import { CharacterDetail } from '@/models/enka/CharacterDetail'
import { EnkaAccount } from '@/models/enka/EnkaAccount'
import { GenshinAccount } from '@/models/enka/GenshinAccount'
import { PlayerDetail } from '@/models/enka/PlayerDetail'
import { APIBuild, APIGameAccount } from '@/types/EnkaAccountTypes'
import { APIEnkaData, APIOwner } from '@/types/EnkaTypes'

/**
 * cached EnkaData type
 */
export interface EnkaData {
  /**
   * uid
   */
  uid: number
  /**
   * player detail
   */
  playerDetail: PlayerDetail
  /**
   * character details
   */
  characterDetails: CharacterDetail[]
  /**
   * uid owner Enka Account
   */
  owner?: EnkaAccount
  /**
   * nextShowCaseDate
   */
  nextShowCaseDate: Date
  /**
   * enkaNetwork URL
   */
  url: string
}

/**
 * Class for fetching EnkaData from enka.network
 */
export class EnkaManager {
  /**
   * URL of enka.network
   */
  private static readonly enkaBaseURL = 'https://enka.network'
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
   * @key uid
   * @value cached EnkaData
   */
  private readonly cache: Map<number, EnkaData> = new Map()

  /**
   * Create a EnkaManager
   */
  constructor() {}
  /**
   * Fetch All from enka.network
   * @description The data fetched by this method is stored as a temporary cache.
   *    The storage period depends on ttl.
   * @param uid UID
   * @param fetchOption fetch option
   * @returns EnkaData
   */
  public async fetchAll(
    uid: number,
    fetchOption?: RequestInit,
  ): Promise<EnkaData> {
    const url = `${EnkaManager.enkaBaseURL}/api/uid/${uid}`
    return await this.fetchUID(uid, url, fetchOption)
  }

  /**
   * Fetch PlayerDetail from enka.network
   * @description The data fetched by this method is stored as a temporary cache.
   *    The storage period depends on ttl.
   * @param uid UID
   * @param fetchOption fetch option
   * @returns PlayerDetail
   */
  public async fetchPlayerDetail(
    uid: number,
    fetchOption?: RequestInit,
  ): Promise<PlayerDetail> {
    const url = `${EnkaManager.enkaBaseURL}/api/uid/${uid}/?info`
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
   * @param username username
   * @param fetchOption fetch option
   * @returns EnkaAccount
   */
  public async fetchEnkaAccount(
    username: string,
    fetchOption?: RequestInit,
  ): Promise<EnkaAccount> {
    const getOwnerUrl = `${EnkaManager.enkaBaseURL}/api/profile/${username}`
    const mergedFetchOption = merge.withOptions(
      { mergeArrays: false },
      EnkaManager.defaultFetchOption,
      fetchOption ?? {},
    )
    const ownerRes = await fetch(getOwnerUrl, mergedFetchOption)
    if (!ownerRes.ok) throw new EnkaNetworkError(ownerRes)
    const owner = (await ownerRes.json()) as APIOwner
    return new EnkaAccount(owner, EnkaManager.enkaBaseURL)
  }

  /**
   * Fetch GenshinAccounts from enka.network
   * @description Data fetched by this method is not stored as a temporary cache.
   * @param username username
   * @param fetchOption fetch option
   * @returns GenshinAccounts
   */
  public async fetchGenshinAccounts(
    username: string,
    fetchOption?: RequestInit,
  ): Promise<GenshinAccount[]> {
    const getGameAccountsUrl = `${EnkaManager.enkaBaseURL}/api/profile/${username}/hoyos`
    const mergedFetchOption = merge.withOptions(
      { mergeArrays: false },
      EnkaManager.defaultFetchOption,
      fetchOption ?? {},
    )
    const gameAccountsRes = await fetch(getGameAccountsUrl, mergedFetchOption)
    if (!gameAccountsRes.ok) throw new EnkaNetworkError(gameAccountsRes)
    const gameAccounts = (await gameAccountsRes.json()) as {
      [hash: string]: APIGameAccount
    }
    return await Promise.all(
      Object.values(gameAccounts)
        .sort((a, b) => a.order - b.order)
        .filter((account) => account.hoyo_type === 0)
        .map(async (account) => {
          const getBuildsUrl = `${EnkaManager.enkaBaseURL}/api/profile/${username}/hoyos/${account.hash}/builds`
          const buildsRes = await fetch(getBuildsUrl, mergedFetchOption)
          if (!buildsRes.ok) throw new EnkaNetworkError(buildsRes)
          const builds = (await buildsRes.json()) as {
            [characterId: string]: APIBuild[]
          }
          return new GenshinAccount(
            account,
            builds,
            username,
            EnkaManager.enkaBaseURL,
          )
        }),
    )
  }

  /**
   * Fetch UIDEndPoint from URL
   * @param uid UID
   * @param url URL
   * @param fetchOption fetch option
   * @returns EnkaData
   */
  private async fetchUID(
    uid: number,
    url: string,
    fetchOption?: RequestInit,
  ): Promise<EnkaData> {
    this.clearCacheOverNextShowCaseDate()
    if (uid < 100000000 || uid > 999999999)
      throw new EnkaManagerError(`The UID format is not correct(${uid})`)
    const cachedData = this.cache.get(uid)
    if (
      cachedData &&
      cachedData.characterDetails &&
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
        ? new EnkaAccount(result.owner, EnkaManager.enkaBaseURL)
        : undefined,
      nextShowCaseDate: new Date(
        new Date().getTime() + (result.ttl ?? 60) * 1000,
      ),
      url: `${EnkaManager.enkaBaseURL}/u/${uid}`,
    }
    this.cache.set(enkaData.uid, enkaData)
    return enkaData
  }
}
