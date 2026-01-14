/**
 * Comprehensive error code enumeration for genshin-manager
 */
export enum GenshinManagerErrorCode {
  // Validation errors (1000-1999)
  GM_VALIDATION_RANGE = 'GM1001',
  GM_VALIDATION_TYPE = 'GM1002',
  GM_VALIDATION_REQUIRED = 'GM1003',
  GM_VALIDATION_FORMAT = 'GM1004',
  GM_VALIDATION_ENUM = 'GM1005',

  // Assets errors (2000-2999)
  GM_ASSETS_NOT_FOUND = 'GM2001',
  GM_ASSETS_CORRUPTED = 'GM2002',
  GM_ASSETS_DOWNLOAD_FAILED = 'GM2003',
  GM_ASSETS_AUDIO_NOT_FOUND = 'GM2004',
  GM_ASSETS_IMAGE_NOT_FOUND = 'GM2005',

  // Decoding errors (3000-3999)
  GM_DECODE_MASTER_NOT_FOUND = 'GM3001',
  GM_DECODE_PATTERN_MISMATCH = 'GM3002',
  GM_DECODE_LOW_CONFIDENCE = 'GM3003',
  GM_DECODE_KEY_MATCHING_FAILED = 'GM3004',
  GM_DECODE_JSON_PARSE_FAILED = 'GM3005',

  // Network errors (4000-4999)
  GM_NETWORK_TIMEOUT = 'GM4001',
  GM_NETWORK_UNAVAILABLE = 'GM4002',
  GM_NETWORK_ENKA_ERROR = 'GM4003',
  GM_NETWORK_ENKA_STATUS_ERROR = 'GM4004',

  // Configuration errors (5000-5999)
  GM_CONFIG_INVALID = 'GM5001',
  GM_CONFIG_MISSING = 'GM5002',

  // Content errors (6000-6999)
  GM_CONTENT_ANN_NOT_FOUND = 'GM6001',
  GM_CONTENT_BODY_NOT_FOUND = 'GM6002',
  GM_CONTENT_TEXT_MAP_FORMAT = 'GM6003',

  // General errors (9000-9999)
  GM_GENERAL_UNKNOWN = 'GM9001',
}

/**
 * Error category mapping
 */
export const errorCategories = {
  [GenshinManagerErrorCode.GM_VALIDATION_RANGE]: 'VALIDATION',
  [GenshinManagerErrorCode.GM_VALIDATION_TYPE]: 'VALIDATION',
  [GenshinManagerErrorCode.GM_VALIDATION_REQUIRED]: 'VALIDATION',
  [GenshinManagerErrorCode.GM_VALIDATION_FORMAT]: 'VALIDATION',
  [GenshinManagerErrorCode.GM_VALIDATION_ENUM]: 'VALIDATION',

  [GenshinManagerErrorCode.GM_ASSETS_NOT_FOUND]: 'ASSETS',
  [GenshinManagerErrorCode.GM_ASSETS_CORRUPTED]: 'ASSETS',
  [GenshinManagerErrorCode.GM_ASSETS_DOWNLOAD_FAILED]: 'ASSETS',
  [GenshinManagerErrorCode.GM_ASSETS_AUDIO_NOT_FOUND]: 'ASSETS',
  [GenshinManagerErrorCode.GM_ASSETS_IMAGE_NOT_FOUND]: 'ASSETS',

  [GenshinManagerErrorCode.GM_DECODE_MASTER_NOT_FOUND]: 'DECODING',
  [GenshinManagerErrorCode.GM_DECODE_PATTERN_MISMATCH]: 'DECODING',
  [GenshinManagerErrorCode.GM_DECODE_LOW_CONFIDENCE]: 'DECODING',
  [GenshinManagerErrorCode.GM_DECODE_KEY_MATCHING_FAILED]: 'DECODING',
  [GenshinManagerErrorCode.GM_DECODE_JSON_PARSE_FAILED]: 'DECODING',

  [GenshinManagerErrorCode.GM_NETWORK_TIMEOUT]: 'NETWORK',
  [GenshinManagerErrorCode.GM_NETWORK_UNAVAILABLE]: 'NETWORK',
  [GenshinManagerErrorCode.GM_NETWORK_ENKA_ERROR]: 'NETWORK',
  [GenshinManagerErrorCode.GM_NETWORK_ENKA_STATUS_ERROR]: 'NETWORK',

  [GenshinManagerErrorCode.GM_CONFIG_INVALID]: 'CONFIG',
  [GenshinManagerErrorCode.GM_CONFIG_MISSING]: 'CONFIG',

  [GenshinManagerErrorCode.GM_CONTENT_ANN_NOT_FOUND]: 'CONTENT',
  [GenshinManagerErrorCode.GM_CONTENT_BODY_NOT_FOUND]: 'CONTENT',
  [GenshinManagerErrorCode.GM_CONTENT_TEXT_MAP_FORMAT]: 'CONTENT',

  [GenshinManagerErrorCode.GM_GENERAL_UNKNOWN]: 'GENERAL',
} as const

/**
 * Error category type
 */
export type ErrorCategory =
  (typeof errorCategories)[keyof typeof errorCategories]

/**
 * Retry classification for errors
 */
export const retryClassifications = {
  [GenshinManagerErrorCode.GM_VALIDATION_RANGE]: { isRetryable: false },
  [GenshinManagerErrorCode.GM_VALIDATION_TYPE]: { isRetryable: false },
  [GenshinManagerErrorCode.GM_VALIDATION_REQUIRED]: { isRetryable: false },
  [GenshinManagerErrorCode.GM_VALIDATION_FORMAT]: { isRetryable: false },
  [GenshinManagerErrorCode.GM_VALIDATION_ENUM]: { isRetryable: false },

  [GenshinManagerErrorCode.GM_ASSETS_NOT_FOUND]: {
    isRetryable: true,
    maxRetries: 3,
    retryDelay: 1000,
    backoffMultiplier: 2,
  },
  [GenshinManagerErrorCode.GM_ASSETS_CORRUPTED]: { isRetryable: false },
  [GenshinManagerErrorCode.GM_ASSETS_DOWNLOAD_FAILED]: {
    isRetryable: true,
    maxRetries: 3,
    retryDelay: 2000,
    backoffMultiplier: 2,
  },
  [GenshinManagerErrorCode.GM_ASSETS_AUDIO_NOT_FOUND]: {
    isRetryable: true,
    maxRetries: 2,
    retryDelay: 1000,
  },
  [GenshinManagerErrorCode.GM_ASSETS_IMAGE_NOT_FOUND]: {
    isRetryable: true,
    maxRetries: 2,
    retryDelay: 1000,
  },

  [GenshinManagerErrorCode.GM_DECODE_MASTER_NOT_FOUND]: { isRetryable: false },
  [GenshinManagerErrorCode.GM_DECODE_PATTERN_MISMATCH]: { isRetryable: false },
  [GenshinManagerErrorCode.GM_DECODE_LOW_CONFIDENCE]: { isRetryable: false },
  [GenshinManagerErrorCode.GM_DECODE_KEY_MATCHING_FAILED]: {
    isRetryable: false,
  },
  [GenshinManagerErrorCode.GM_DECODE_JSON_PARSE_FAILED]: { isRetryable: false },

  [GenshinManagerErrorCode.GM_NETWORK_TIMEOUT]: {
    isRetryable: true,
    maxRetries: 3,
    retryDelay: 1000,
    backoffMultiplier: 2,
  },
  [GenshinManagerErrorCode.GM_NETWORK_UNAVAILABLE]: {
    isRetryable: true,
    maxRetries: 5,
    retryDelay: 5000,
    backoffMultiplier: 1.5,
  },
  [GenshinManagerErrorCode.GM_NETWORK_ENKA_ERROR]: {
    isRetryable: true,
    maxRetries: 3,
    retryDelay: 2000,
  },
  [GenshinManagerErrorCode.GM_NETWORK_ENKA_STATUS_ERROR]: {
    isRetryable: true,
    maxRetries: 2,
    retryDelay: 3000,
  },

  [GenshinManagerErrorCode.GM_CONFIG_INVALID]: { isRetryable: false },
  [GenshinManagerErrorCode.GM_CONFIG_MISSING]: { isRetryable: false },

  [GenshinManagerErrorCode.GM_CONTENT_ANN_NOT_FOUND]: {
    isRetryable: true,
    maxRetries: 2,
    retryDelay: 1000,
  },
  [GenshinManagerErrorCode.GM_CONTENT_BODY_NOT_FOUND]: {
    isRetryable: true,
    maxRetries: 2,
    retryDelay: 1000,
  },
  [GenshinManagerErrorCode.GM_CONTENT_TEXT_MAP_FORMAT]: { isRetryable: false },

  [GenshinManagerErrorCode.GM_GENERAL_UNKNOWN]: {
    isRetryable: true,
    maxRetries: 1,
    retryDelay: 2000,
  },
} as const

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
