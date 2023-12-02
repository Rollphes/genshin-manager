import merge from 'ts-deepmerge'

import { EnkaManagerError } from '@/errors/EnkaManagerError'
import { EnkaNetworkError } from '@/errors/EnkaNetWorkError'
import { AvatarInfo } from '@/models/enka/AvatarInfo'
import { PlayerInfo } from '@/models/enka/PlayerInfo'
import { APIEnkaData } from '@/types/EnkaTypes'

/**
 *
 */
export interface EnkaData {
  /**
   *
   */
  uid: number
  /**
   *
   */
  playerInfo: PlayerInfo
  /**
   *
   */
  avatarInfoList: AvatarInfo[]
  /**
   *
   */
  nextShowCaseDate: Date
}

/**
 * Class for fetching EnkaData from enka.network
 */
export class EnkaManager {
  private readonly enkaUidURL = 'https://enka.network/api/uid/'
  private readonly defaultOption: RequestInit = {
    headers: {
      'user-agent': 'Mozilla/5.0',
    },
  }

  /**
   * Cache of EnkaData
   */
  private readonly cache: Map<number, EnkaData> = new Map()

  /**
   * Create a EnkaManager
   */
  constructor() {}

  /**
   * Fetch EnkaData from enka.network
   * @param uid genshin uid
   * @param fetchOption fetch option (default: { headers: { 'user-agent': 'Mozilla/5.0' } })
   * @returns
   * @example
   * ```ts
   * const client = new Client()
   * await client.deploy()
   * const enka = new EnkaManager()
   * const enkaData = await enka.fetch(123456789)
   * ```
   */
  async fetch(uid: number, fetchOption?: RequestInit) {
    this.clearCacheOverNextShowCaseDate()
    if (uid < 100000000 || uid > 999999999)
      throw new EnkaManagerError(`The UID format is not correct(${uid})`)
    const url = this.enkaUidURL + `${uid}`
    const previousData = this.cache.get(uid)
    if (
      previousData &&
      previousData.avatarInfoList &&
      new Date().getTime() < previousData.nextShowCaseDate.getTime()
    ) {
      return new Promise<EnkaData>((resolve) => {
        resolve(previousData)
      })
    }
    const mergedFetchOption = fetchOption
      ? merge.withOptions(
          { mergeArrays: false },
          this.defaultOption,
          fetchOption,
        )
      : this.defaultOption
    const res = await fetch(url, mergedFetchOption)
    if (!res.ok) throw new EnkaNetworkError(res)

    const result = (await res.json()) as APIEnkaData
    const enkaData: EnkaData = {
      uid: uid,
      playerInfo: new PlayerInfo(result.playerInfo),
      avatarInfoList:
        result.avatarInfoList?.map(
          (avatarInfo) => new AvatarInfo(avatarInfo),
        ) ?? [],
      nextShowCaseDate: new Date(
        new Date().getTime() + (result.ttl || 60) * 1000,
      ),
    }
    this.cache.set(enkaData.uid, enkaData)
    return enkaData
  }

  /**
   * Clear cache over nextShowCaseDate
   */
  public clearCacheOverNextShowCaseDate() {
    this.cache.forEach((value, key) => {
      if (new Date().getTime() > value.nextShowCaseDate.getTime())
        this.cache.delete(key)
    })
  }
}
