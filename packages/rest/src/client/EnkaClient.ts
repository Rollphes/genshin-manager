import type { ClientOptions } from 'openapi-fetch'

import { createRestClient } from '@/client/createRestClient'
import { HttpError } from '@/error/HttpError'
import type { components, paths } from '@/types/enka'

/**
 * Enka.Network API response data type.
 */
export type EnkaData = components['schemas']['EnkaData']

/**
 * Enka.Network player info type.
 */
export type PlayerInfo = components['schemas']['PlayerInfo']

/**
 * Enka.Network avatar info type.
 */
export type AvatarInfo = components['schemas']['AvatarInfo']

/**
 * Enka.Network owner type.
 */
export type Owner = components['schemas']['Owner']

/**
 * Enka.Network game account type.
 */
export type GameAccount = components['schemas']['GameAccount']

/**
 * Enka.Network build type.
 */
export type Build = components['schemas']['Build']

const ENKA_BASE_URL = 'https://enka.network'

/**
 * Type-safe client for Enka.Network API.
 */
export class EnkaClient {
  private readonly client: ReturnType<typeof createRestClient<paths>>

  /**
   * Creates a new EnkaClient instance.
   * @param options - optional client options
   */
  constructor(options?: ClientOptions) {
    this.client = createRestClient<paths>(ENKA_BASE_URL, options)
  }

  /**
   * Fetch player data by UID.
   * @param uid - the Genshin Impact UID
   * @param infoOnly - if true, returns only player info without character details
   * @returns the player data
   * @throws - HttpError if the request fails
   */
  public async fetchPlayerData(
    uid: string,
    infoOnly?: boolean,
  ): Promise<EnkaData> {
    const { data, error, response } = await this.client.GET('/api/uid/{uid}', {
      params: {
        path: { uid },
        query: infoOnly ? { info: true } : undefined,
      },
    })

    if (error) throw new HttpError(response.status, response.statusText, error)
    if (!data) throw new HttpError(500, 'No data returned', undefined)

    return data
  }

  /**
   * Fetch Enka account profile by username.
   * @param username - the Enka account username
   * @returns the account profile
   * @throws - HttpError if the request fails
   */
  public async fetchProfile(username: string): Promise<Owner> {
    const { data, error, response } = await this.client.GET(
      '/api/profile/{username}',
      {
        params: { path: { username } },
      },
    )

    if (error) throw new HttpError(response.status, response.statusText, error)
    if (!data) throw new HttpError(500, 'No data returned', undefined)

    return data
  }

  /**
   * Fetch linked game accounts for an Enka user.
   * @param username - the Enka account username
   * @returns map of hash to game account
   * @throws - HttpError if the request fails
   */
  public async fetchHoyos(
    username: string,
  ): Promise<Record<string, GameAccount>> {
    const { data, error, response } = await this.client.GET(
      '/api/profile/{username}/hoyos',
      {
        params: { path: { username } },
      },
    )

    if (error) throw new HttpError(response.status, response.statusText, error)
    if (!data) throw new HttpError(500, 'No data returned', undefined)

    return data
  }

  /**
   * Fetch saved character builds for a game account.
   * @param username - the Enka account username
   * @param hash - the game account hash
   * @returns array of character builds
   * @throws - HttpError if the request fails
   */
  public async fetchBuilds(username: string, hash: string): Promise<Build[]> {
    const { data, error, response } = await this.client.GET(
      '/api/profile/{username}/hoyos/{hash}/builds',
      {
        params: { path: { username, hash } },
      },
    )

    if (error) throw new HttpError(response.status, response.statusText, error)
    if (!data) throw new HttpError(500, 'No data returned', undefined)

    return data
  }
}
