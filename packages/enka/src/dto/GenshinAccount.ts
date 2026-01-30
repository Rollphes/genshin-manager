import { PlayerDetail } from '@/dto/PlayerDetail'
import type { GameAccountResponse } from '@/types/api/responses'

/**
 * Constructor data for GenshinAccount
 */
export interface GenshinAccountData {
  /** UID */
  readonly uid: number
  /** Account hash */
  readonly hash: string
  /** Region */
  readonly region: string
  /** Whether UID is public */
  readonly uidPublic: boolean
  /** Whether live preview is public */
  readonly livePublic: boolean
  /** Whether account is verified */
  readonly verified: boolean
  /** Player detail */
  readonly playerDetail: PlayerDetail
  /** Avatar order map (avatarId → order) */
  readonly avatarOrder: Readonly<Record<string, number>>
  /** Account order */
  readonly order: number
}

/**
 * Genshin Impact account from Enka.Network profile.
 * Pure DTO.
 */
export class GenshinAccount {
  /** UID */
  public readonly uid: number
  /** Account hash */
  public readonly hash: string
  /** Region */
  public readonly region: string
  /** Whether UID is public */
  public readonly uidPublic: boolean
  /** Whether live preview is public */
  public readonly livePublic: boolean
  /** Whether account is verified */
  public readonly verified: boolean
  /** Player detail */
  public readonly playerDetail: PlayerDetail
  /** Avatar order map */
  public readonly avatarOrder: Readonly<Record<string, number>>
  /** Account order */
  public readonly order: number

  /**
   * Create a GenshinAccount
   * @param data - Pre-resolved account data
   */
  constructor(data: GenshinAccountData) {
    this.uid = data.uid
    this.hash = data.hash
    this.region = data.region
    this.uidPublic = data.uidPublic
    this.livePublic = data.livePublic
    this.verified = data.verified
    this.playerDetail = data.playerDetail
    this.avatarOrder = data.avatarOrder
    this.order = data.order
  }

  /**
   * Build a GenshinAccount from a GameAccountResponse
   * @param response - Enka API game account response
   * @returns GenshinAccount instance
   */
  public static fromResponse(response: GameAccountResponse): GenshinAccount {
    return new GenshinAccount({
      uid: response.uid,
      hash: response.hash,
      region: response.region,
      uidPublic: response.uid_public,
      livePublic: response.live_public,
      verified: response.verified,
      playerDetail: PlayerDetail.fromResponse(response.player_info),
      avatarOrder: response.avatar_order,
      order: response.order,
    })
  }
}
