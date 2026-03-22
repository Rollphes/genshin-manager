import type { ClientOptions } from 'openapi-fetch'

import { createRestClient } from '@/client/createRestClient'
import { HttpError } from '@/error/HttpError'
import type { components, paths } from '@/types/enka-status'

/**
 * Enka Status API response type.
 */
export type EnkaStatus = components['schemas']['EnkaStatus']

/**
 * Enka stat by region type.
 */
export type EnkaStat = components['schemas']['EnkaStat']

/**
 * Enka ping status type.
 */
export type EnkaPingu = components['schemas']['EnkaPingu']

const ENKA_STATUS_BASE_URL = 'http://status.enka.network'

/**
 * Type-safe client for Enka.Network Status API.
 */
export class EnkaStatusClient {
  private readonly client: ReturnType<typeof createRestClient<paths>>

  /**
   * Creates a new EnkaStatusClient instance.
   * @param options - optional client options
   */
  constructor(options?: ClientOptions) {
    this.client = createRestClient<paths>(ENKA_STATUS_BASE_URL, options)
  }

  /**
   * Fetch status from the last hour.
   * @returns the status data
   * @throws - HttpError if the request fails
   */
  public async fetchStatus(): Promise<EnkaStatus> {
    const { data, error, response } = await this.client.GET('/api/status')

    if (error) throw new HttpError(response.status, response.statusText, error)

    return data
  }

  /**
   * Fetch current status.
   * @returns the current status data
   * @throws - HttpError if the request fails
   */
  public async fetchCurrentStatus(): Promise<EnkaStatus> {
    const { data, error, response } = await this.client.GET('/api/now')

    if (error) throw new HttpError(response.status, response.statusText, error)

    return data
  }
}
