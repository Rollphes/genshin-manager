import { ErrorCode, GenshinManagerError } from '@genshin-manager/core'

/**
 * Error thrown when HoYoverse API returns a non-zero retcode
 */
export class HoyoverseApiError extends GenshinManagerError {
  public readonly errorCode = ErrorCode.GmNetwork

  /**
   * Constructor for HoyoverseApiError
   * @param retcode - API return code
   * @param apiMessage - API error message
   * @param endpoint - API endpoint that failed
   * @param options - Error options
   */
  constructor(
    public readonly retcode: number,
    public readonly apiMessage: string,
    public readonly endpoint: string,
    options?: ErrorOptions,
  ) {
    super(
      `HoYoverse API error (retcode: ${String(retcode)}): ${apiMessage} at ${endpoint}`,
      options,
    )
  }
}
