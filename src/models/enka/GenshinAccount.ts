import { EnkaBuild } from '@/models/enka/EnkaBuild'
import { PlayerDetail } from '@/models/enka/PlayerDetail'
import { APIBuild, APIGameAccount } from '@/types/enkaNetwork'

/**
 * Class of GenshinAccount
 */
export class GenshinAccount {
  /**
   * UID
   */
  public readonly uid: number
  /**
   * Hash
   */
  public readonly hash: string
  /**
   * Region
   */
  public readonly region: string
  /**
   * Is the UID public
   */
  public readonly uidPublic: boolean
  /**
   * Is the live preview public
   */
  public readonly livePublic: boolean
  /**
   * Is the account verified
   */
  public readonly verified: boolean
  /**
   * PlayerDetail
   */
  public readonly playerDetail: PlayerDetail
  /**
   * Builds
   */
  public readonly builds: EnkaBuild[][]
  /**
   * EnkaNetwork URL
   */
  public readonly url: string
  /**
   * Data from EnkaNetwork
   */
  public readonly data: APIGameAccount

  /**
   * Create a GenshinAccount
   * @param gameAccountData Data from EnkaNetwork
   * @param buildDatas Data from EnkaNetwork
   * @param username Username of EnkaNetwork
   * @param enkaBaseURL URL of enka.network
   */
  constructor(
    gameAccountData: APIGameAccount,
    buildDatas: Record<string, APIBuild[]>,
    username: string,
    enkaBaseURL: string,
  ) {
    this.uid = gameAccountData.uid
    this.hash = gameAccountData.hash
    this.region = gameAccountData.region
    this.uidPublic = gameAccountData.uid_public
    this.livePublic = gameAccountData.live_public
    this.verified = gameAccountData.verified
    this.playerDetail = new PlayerDetail(gameAccountData.player_info)
    const avatarOrder = gameAccountData.avatar_order
    const avatarIdOrder = Object.keys(avatarOrder).sort(
      (a, b) => avatarOrder[a] - avatarOrder[b],
    )
    this.url = `${enkaBaseURL}/u/${username}/${this.hash}`
    this.builds = avatarIdOrder.map((avatarId) =>
      buildDatas[avatarId]
        .sort((a, b) => a.order - b.order)
        .map((data) => new EnkaBuild(data, this.url)),
    )
    this.data = gameAccountData
  }
}
