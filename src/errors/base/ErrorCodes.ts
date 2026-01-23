/**
 * Comprehensive error code enumeration for genshin-manager
 */
export enum GenshinManagerErrorCode {
  // Validation errors (1000-1999)
  GmValidationType = 'GM1002',
  GmValidationRequired = 'GM1003',
  GmValidationFormat = 'GM1004',
  GmValidationEnum = 'GM1005',

  // Assets errors (2000-2999)
  GmAssetsNotFound = 'GM2001',
  GmAssetsCorrupted = 'GM2002',
  GmAssetsAudioNotFound = 'GM2004',
  GmAssetsImageNotFound = 'GM2005',

  // Network errors (4000-4999)
  GmNetworkUnavailable = 'GM4002',

  // Configuration errors (5000-5999)
  GmConfigMissing = 'GM5002',

  // Content errors (6000-6999)
  GmContentAnnNotFound = 'GM6001',
  GmContentBodyNotFound = 'GM6002',
  GmContentTextMapFormat = 'GM6003',

  // General errors (9000-9999)
  GmGeneralUnknown = 'GM9001',
}

/**
 * Error category type
 */
export type ErrorCategory =
  | 'VALIDATION'
  | 'ASSETS'
  | 'NETWORK'
  | 'CONFIG'
  | 'CONTENT'
  | 'GENERAL'

/**
 * Error category mapping
 */
export const errorCategories = {
  [GenshinManagerErrorCode.GmValidationType]: 'VALIDATION',
  [GenshinManagerErrorCode.GmValidationRequired]: 'VALIDATION',
  [GenshinManagerErrorCode.GmValidationFormat]: 'VALIDATION',
  [GenshinManagerErrorCode.GmValidationEnum]: 'VALIDATION',

  [GenshinManagerErrorCode.GmAssetsNotFound]: 'ASSETS',
  [GenshinManagerErrorCode.GmAssetsCorrupted]: 'ASSETS',
  [GenshinManagerErrorCode.GmAssetsAudioNotFound]: 'ASSETS',
  [GenshinManagerErrorCode.GmAssetsImageNotFound]: 'ASSETS',

  [GenshinManagerErrorCode.GmNetworkUnavailable]: 'NETWORK',

  [GenshinManagerErrorCode.GmConfigMissing]: 'CONFIG',

  [GenshinManagerErrorCode.GmContentAnnNotFound]: 'CONTENT',
  [GenshinManagerErrorCode.GmContentBodyNotFound]: 'CONTENT',
  [GenshinManagerErrorCode.GmContentTextMapFormat]: 'CONTENT',

  [GenshinManagerErrorCode.GmGeneralUnknown]: 'GENERAL',
} as const satisfies Record<GenshinManagerErrorCode, ErrorCategory>

/**
 * Retry configuration interface
 */
export interface RetryConfiguration {
  /**
   * Whether this error should be retried
   */
  readonly isRetryable: boolean
  /**
   * Maximum number of retry attempts
   */
  readonly maxRetries?: number
  /**
   * Delay between retry attempts in milliseconds
   */
  readonly retryDelay?: number
  /**
   * Multiplier for exponential backoff
   */
  readonly backoffMultiplier?: number
}

/**
 * Retry classification for errors
 */
export const retryClassifications = {
  [GenshinManagerErrorCode.GmValidationType]: { isRetryable: false },
  [GenshinManagerErrorCode.GmValidationRequired]: { isRetryable: false },
  [GenshinManagerErrorCode.GmValidationFormat]: { isRetryable: false },
  [GenshinManagerErrorCode.GmValidationEnum]: { isRetryable: false },

  [GenshinManagerErrorCode.GmAssetsNotFound]: {
    isRetryable: true,
    maxRetries: 3,
    retryDelay: 1000,
    backoffMultiplier: 2,
  },
  [GenshinManagerErrorCode.GmAssetsCorrupted]: { isRetryable: false },
  [GenshinManagerErrorCode.GmAssetsAudioNotFound]: {
    isRetryable: true,
    maxRetries: 2,
    retryDelay: 1000,
  },
  [GenshinManagerErrorCode.GmAssetsImageNotFound]: {
    isRetryable: true,
    maxRetries: 2,
    retryDelay: 1000,
  },

  [GenshinManagerErrorCode.GmNetworkUnavailable]: {
    isRetryable: true,
    maxRetries: 5,
    retryDelay: 5000,
    backoffMultiplier: 1.5,
  },

  [GenshinManagerErrorCode.GmConfigMissing]: { isRetryable: false },

  [GenshinManagerErrorCode.GmContentAnnNotFound]: {
    isRetryable: true,
    maxRetries: 2,
    retryDelay: 1000,
  },
  [GenshinManagerErrorCode.GmContentBodyNotFound]: {
    isRetryable: true,
    maxRetries: 2,
    retryDelay: 1000,
  },
  [GenshinManagerErrorCode.GmContentTextMapFormat]: { isRetryable: false },

  [GenshinManagerErrorCode.GmGeneralUnknown]: {
    isRetryable: true,
    maxRetries: 1,
    retryDelay: 2000,
  },
} as const satisfies Record<GenshinManagerErrorCode, RetryConfiguration>
