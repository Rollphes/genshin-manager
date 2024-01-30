import { APIAvatarInfo, APIPlayerInfo } from '@/types/EnkaTypes'

//TODO: remove memo
//https://enka.network/api/profile/Algoinde/ : APIOwner
//https://enka.network/api/profile/Algoinde/hoyos/ : {[hash: string]: APIGameAccount}
//https://enka.network/api/profile/Algoinde/hoyos/4Wjv2e/ : APIGameAccount
//https://enka.network/api/profile/Algoinde/hoyos/4Wjv2e/builds/ : {[characterId: string]: APIBuild}

/**
 * Enka API GameAccount type
 */
export interface APIGameAccount {
  /**
   * UID
   */
  uid: number
  /**
   * Is the uid public
   */
  uid_public: boolean
  /**
   * Is the uid public
   */
  public: boolean
  /**
   * Is the live preview public
   */
  live_public: boolean
  /**
   * is the account verified
   */
  verified: boolean
  /**
   * Player Info
   */
  player_info: APIPlayerInfo
  /**
   * GameAccount Hash
   */
  hash: string
  /**
   * region
   */
  region: string
  /**
   * order
   */
  order: number
  /**
   * avatar order
   */
  avatar_order: { [characterId: string]: number }
  /**
   * hoyo type (0: GI 1:HSR)
   */
  hoyo_type: number
}

/**
 * Enka API Build type
 */
export interface APIBuild {
  /**
   * Build ID
   */
  id: number
  /**
   * Build Name
   */
  name: string
  /**
   * Character ID
   */
  avatar_id: string
  /**
   * Avatar Info
   */
  avatar_data: APIAvatarInfo
  /**
   * order
   */
  order: number
  /**
   * is the live preview
   */
  live: boolean
  /**
   * Build Settings
   */
  settings: APIBuildSettings
  /**
   * is the public
   */
  public: boolean
  /**
   * image URL
   */
  image: null | string
  /**
   * hoyo type (0: GI 1:HSR)
   */
  hoyo_type: number
}

/**
 * Enka API Build Settings type
 */
export interface APIBuildSettings {
  /**
   * build description
   */
  caption?: string
  /**
   * custom art source
   */
  artSource?: string
  /**
   * honkard width
   */
  honkardWidth?: number
  /**
   * Is Adaptive Color
   */
  adaptiveColor?: boolean
}
