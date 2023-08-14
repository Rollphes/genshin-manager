import fetch from 'node-fetch'

import { EnkaManagerError } from '@/errors/EnkaManagerError'
import { EnkaNetworkError } from '@/errors/EnkaNetWorkError'
import { AvatarInfo } from '@/models/enka/AvatarInfo'
import { PlayerInfo } from '@/models/enka/PlayerInfo'
import { APIEnkaData } from '@/types/EnkaTypes'
interface EnkaData {
  uid: number
  playerInfo: PlayerInfo
  avatarInfoList: AvatarInfo[]
  nextShowCaseDate: Date
}
export class EnkaManager {
  private readonly enkaUidURL = 'https://enka.network/api/uid/'
  private readonly cache: Map<number, EnkaData> = new Map()
  private httpStatusMessages: { [statusCode: number]: string } = {
    400: 'Wrong UID format',
    404: 'Player does not exist (MHY server said that)',
    424: 'Game maintenance / everything is broken after the game update',
    429: 'Rate-limited (either by my server or by MHY server)',
    500: 'General server error',
    503: 'I screwed up massively',
  }

  constructor() {}

  async fetch(uid: number) {
    if (uid < 100000000 || uid > 999999999)
      throw new EnkaManagerError(`The UID format is not correct(${uid})`)
    const url = this.enkaUidURL + `${uid}`
    const previousData = this.cache.get(uid)
    const res = await fetch(url)
    if (!res.ok) {
      throw new EnkaNetworkError(
        this.httpStatusMessages[res.status] ?? 'Unknown error',
        res.status,
        res.statusText,
      )
    }
    if (
      previousData &&
      previousData.avatarInfoList &&
      new Date().getTime() < previousData.nextShowCaseDate.getTime()
    )
      return new Promise<EnkaData>((resolve) => {
        resolve(previousData)
      })
    const result = (await res.json()) as APIEnkaData
    const enkaData: EnkaData = {
      uid: uid,
      playerInfo: new PlayerInfo(result.playerInfo),
      avatarInfoList:
        result.avatarInfoList?.map(
          (avatarInfo) => new AvatarInfo(avatarInfo),
        ) ?? [],
      nextShowCaseDate: new Date(new Date().getTime() + result.ttl * 1000),
    }
    this.cache.set(enkaData.uid, enkaData)
    return enkaData
  }
}
