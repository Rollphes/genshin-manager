import { ErrorCode, GenshinManagerError } from '@genshin-manager/core'

/**
 * Error thrown when attempting to use a GenshinManager instance after it has been destroyed
 */
export class ManagerDestroyedError extends GenshinManagerError {
  public readonly errorCode = ErrorCode.GmManagerDestroyed

  /**
   * Creates a new ManagerDestroyedError
   */
  constructor() {
    super(
      'GenshinManager has been destroyed. Create a new instance to continue.',
    )
  }
}
