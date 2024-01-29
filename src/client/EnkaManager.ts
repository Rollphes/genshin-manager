import { merge } from 'ts-deepmerge'

import { EnkaManagerError } from '@/errors/EnkaManagerError'
import { EnkaNetworkError } from '@/errors/EnkaNetWorkError'
import { CharacterDetail } from '@/models/enka/CharacterDetail'
import { PlayerDetail } from '@/models/enka/PlayerDetail'
import { APIEnkaData } from '@/types/EnkaTypes'

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
   * nextShowCaseDate
   */
  nextShowCaseDate: Date
}

/**
 * Class for fetching EnkaData from enka.network
 */
export class EnkaManager {
  /**
   * URL of enka.network
   */
  private static readonly enkaUidURL = 'https://enka.network/api/uid/'
  /**
   * Default fetch option
   */
  private static readonly defaultFetchOption: RequestInit = {
    headers: {
      'user-agent': 'Mozilla/5.0',
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
   * Fetch EnkaData from enka.network
   * @param uid genshin uid
   * @param fetchOption fetch option (default: { headers: { 'user-agent': 'Mozilla/5.0' } })
   * @returns cached EnkaData
   * @example
   * ```ts
   * const client = new Client()
   * await client.deploy()
   * const enka = new EnkaManager()
   * const enkaData = await enka.fetch(123456789)
   * ```
   */
  public async fetch(
    uid: number,
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
    const url = EnkaManager.enkaUidURL + `${uid}`
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
      nextShowCaseDate: new Date(
        new Date().getTime() + (result.ttl ?? 60) * 1000,
      ),
    }
    this.cache.set(enkaData.uid, enkaData)
    return enkaData
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
}
