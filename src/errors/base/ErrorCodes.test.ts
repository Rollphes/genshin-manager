import { describe, expect, it } from 'vitest'

import {
  errorCategories,
  GenshinManagerErrorCode,
  retryClassifications,
} from '@/errors/base/ErrorCodes'

describe('ErrorCodes', () => {
  describe('GenshinManagerErrorCode', () => {
    describe('VALIDATION errors (1000-1999)', () => {
      it('should have GM_VALIDATION_RANGE code', () => {
        expect(GenshinManagerErrorCode.GM_VALIDATION_RANGE).toBe('GM1001')
      })

      it('should have GM_VALIDATION_TYPE code', () => {
        expect(GenshinManagerErrorCode.GM_VALIDATION_TYPE).toBe('GM1002')
      })

      it('should have GM_VALIDATION_REQUIRED code', () => {
        expect(GenshinManagerErrorCode.GM_VALIDATION_REQUIRED).toBe('GM1003')
      })

      it('should have GM_VALIDATION_FORMAT code', () => {
        expect(GenshinManagerErrorCode.GM_VALIDATION_FORMAT).toBe('GM1004')
      })

      it('should have GM_VALIDATION_ENUM code', () => {
        expect(GenshinManagerErrorCode.GM_VALIDATION_ENUM).toBe('GM1005')
      })
    })

    describe('ASSETS errors (2000-2999)', () => {
      it('should have GM_ASSETS_NOT_FOUND code', () => {
        expect(GenshinManagerErrorCode.GM_ASSETS_NOT_FOUND).toBe('GM2001')
      })

      it('should have GM_ASSETS_CORRUPTED code', () => {
        expect(GenshinManagerErrorCode.GM_ASSETS_CORRUPTED).toBe('GM2002')
      })

      it('should have GM_ASSETS_DOWNLOAD_FAILED code', () => {
        expect(GenshinManagerErrorCode.GM_ASSETS_DOWNLOAD_FAILED).toBe('GM2003')
      })

      it('should have GM_ASSETS_AUDIO_NOT_FOUND code', () => {
        expect(GenshinManagerErrorCode.GM_ASSETS_AUDIO_NOT_FOUND).toBe('GM2004')
      })

      it('should have GM_ASSETS_IMAGE_NOT_FOUND code', () => {
        expect(GenshinManagerErrorCode.GM_ASSETS_IMAGE_NOT_FOUND).toBe('GM2005')
      })
    })

    describe('DECODING errors (3000-3999)', () => {
      it('should have GM_DECODE_MASTER_NOT_FOUND code', () => {
        expect(GenshinManagerErrorCode.GM_DECODE_MASTER_NOT_FOUND).toBe(
          'GM3001',
        )
      })

      it('should have GM_DECODE_PATTERN_MISMATCH code', () => {
        expect(GenshinManagerErrorCode.GM_DECODE_PATTERN_MISMATCH).toBe(
          'GM3002',
        )
      })

      it('should have GM_DECODE_LOW_CONFIDENCE code', () => {
        expect(GenshinManagerErrorCode.GM_DECODE_LOW_CONFIDENCE).toBe('GM3003')
      })

      it('should have GM_DECODE_KEY_MATCHING_FAILED code', () => {
        expect(GenshinManagerErrorCode.GM_DECODE_KEY_MATCHING_FAILED).toBe(
          'GM3004',
        )
      })

      it('should have GM_DECODE_JSON_PARSE_FAILED code', () => {
        expect(GenshinManagerErrorCode.GM_DECODE_JSON_PARSE_FAILED).toBe(
          'GM3005',
        )
      })
    })

    describe('NETWORK errors (4000-4999)', () => {
      it('should have GM_NETWORK_TIMEOUT code', () => {
        expect(GenshinManagerErrorCode.GM_NETWORK_TIMEOUT).toBe('GM4001')
      })

      it('should have GM_NETWORK_UNAVAILABLE code', () => {
        expect(GenshinManagerErrorCode.GM_NETWORK_UNAVAILABLE).toBe('GM4002')
      })

      it('should have GM_NETWORK_ENKA_ERROR code', () => {
        expect(GenshinManagerErrorCode.GM_NETWORK_ENKA_ERROR).toBe('GM4003')
      })

      it('should have GM_NETWORK_ENKA_STATUS_ERROR code', () => {
        expect(GenshinManagerErrorCode.GM_NETWORK_ENKA_STATUS_ERROR).toBe(
          'GM4004',
        )
      })
    })

    describe('CONFIG errors (5000-5999)', () => {
      it('should have GM_CONFIG_INVALID code', () => {
        expect(GenshinManagerErrorCode.GM_CONFIG_INVALID).toBe('GM5001')
      })

      it('should have GM_CONFIG_MISSING code', () => {
        expect(GenshinManagerErrorCode.GM_CONFIG_MISSING).toBe('GM5002')
      })
    })

    describe('CONTENT errors (6000-6999)', () => {
      it('should have GM_CONTENT_ANN_NOT_FOUND code', () => {
        expect(GenshinManagerErrorCode.GM_CONTENT_ANN_NOT_FOUND).toBe('GM6001')
      })

      it('should have GM_CONTENT_BODY_NOT_FOUND code', () => {
        expect(GenshinManagerErrorCode.GM_CONTENT_BODY_NOT_FOUND).toBe('GM6002')
      })

      it('should have GM_CONTENT_TEXT_MAP_FORMAT code', () => {
        expect(GenshinManagerErrorCode.GM_CONTENT_TEXT_MAP_FORMAT).toBe(
          'GM6003',
        )
      })
    })

    describe('GENERAL errors (9000-9999)', () => {
      it('should have GM_GENERAL_UNKNOWN code', () => {
        expect(GenshinManagerErrorCode.GM_GENERAL_UNKNOWN).toBe('GM9001')
      })
    })
  })

  describe('errorCategories', () => {
    it('should map VALIDATION errors to VALIDATION category', () => {
      expect(errorCategories[GenshinManagerErrorCode.GM_VALIDATION_RANGE]).toBe(
        'VALIDATION',
      )
      expect(errorCategories[GenshinManagerErrorCode.GM_VALIDATION_TYPE]).toBe(
        'VALIDATION',
      )
      expect(
        errorCategories[GenshinManagerErrorCode.GM_VALIDATION_REQUIRED],
      ).toBe('VALIDATION')
      expect(
        errorCategories[GenshinManagerErrorCode.GM_VALIDATION_FORMAT],
      ).toBe('VALIDATION')
      expect(errorCategories[GenshinManagerErrorCode.GM_VALIDATION_ENUM]).toBe(
        'VALIDATION',
      )
    })

    it('should map ASSETS errors to ASSETS category', () => {
      expect(errorCategories[GenshinManagerErrorCode.GM_ASSETS_NOT_FOUND]).toBe(
        'ASSETS',
      )
      expect(errorCategories[GenshinManagerErrorCode.GM_ASSETS_CORRUPTED]).toBe(
        'ASSETS',
      )
      expect(
        errorCategories[GenshinManagerErrorCode.GM_ASSETS_DOWNLOAD_FAILED],
      ).toBe('ASSETS')
      expect(
        errorCategories[GenshinManagerErrorCode.GM_ASSETS_AUDIO_NOT_FOUND],
      ).toBe('ASSETS')
      expect(
        errorCategories[GenshinManagerErrorCode.GM_ASSETS_IMAGE_NOT_FOUND],
      ).toBe('ASSETS')
    })

    it('should map DECODING errors to DECODING category', () => {
      expect(
        errorCategories[GenshinManagerErrorCode.GM_DECODE_MASTER_NOT_FOUND],
      ).toBe('DECODING')
      expect(
        errorCategories[GenshinManagerErrorCode.GM_DECODE_PATTERN_MISMATCH],
      ).toBe('DECODING')
      expect(
        errorCategories[GenshinManagerErrorCode.GM_DECODE_LOW_CONFIDENCE],
      ).toBe('DECODING')
      expect(
        errorCategories[GenshinManagerErrorCode.GM_DECODE_KEY_MATCHING_FAILED],
      ).toBe('DECODING')
      expect(
        errorCategories[GenshinManagerErrorCode.GM_DECODE_JSON_PARSE_FAILED],
      ).toBe('DECODING')
    })

    it('should map NETWORK errors to NETWORK category', () => {
      expect(errorCategories[GenshinManagerErrorCode.GM_NETWORK_TIMEOUT]).toBe(
        'NETWORK',
      )
      expect(
        errorCategories[GenshinManagerErrorCode.GM_NETWORK_UNAVAILABLE],
      ).toBe('NETWORK')
      expect(
        errorCategories[GenshinManagerErrorCode.GM_NETWORK_ENKA_ERROR],
      ).toBe('NETWORK')
      expect(
        errorCategories[GenshinManagerErrorCode.GM_NETWORK_ENKA_STATUS_ERROR],
      ).toBe('NETWORK')
    })

    it('should map CONFIG errors to CONFIG category', () => {
      expect(errorCategories[GenshinManagerErrorCode.GM_CONFIG_INVALID]).toBe(
        'CONFIG',
      )
      expect(errorCategories[GenshinManagerErrorCode.GM_CONFIG_MISSING]).toBe(
        'CONFIG',
      )
    })

    it('should map CONTENT errors to CONTENT category', () => {
      expect(
        errorCategories[GenshinManagerErrorCode.GM_CONTENT_ANN_NOT_FOUND],
      ).toBe('CONTENT')
      expect(
        errorCategories[GenshinManagerErrorCode.GM_CONTENT_BODY_NOT_FOUND],
      ).toBe('CONTENT')
      expect(
        errorCategories[GenshinManagerErrorCode.GM_CONTENT_TEXT_MAP_FORMAT],
      ).toBe('CONTENT')
    })

    it('should map GENERAL errors to GENERAL category', () => {
      expect(errorCategories[GenshinManagerErrorCode.GM_GENERAL_UNKNOWN]).toBe(
        'GENERAL',
      )
    })
  })

  describe('retryClassifications', () => {
    describe('non-retryable errors', () => {
      it('should mark VALIDATION errors as non-retryable', () => {
        expect(
          retryClassifications[GenshinManagerErrorCode.GM_VALIDATION_RANGE]
            .isRetryable,
        ).toBe(false)
        expect(
          retryClassifications[GenshinManagerErrorCode.GM_VALIDATION_TYPE]
            .isRetryable,
        ).toBe(false)
        expect(
          retryClassifications[GenshinManagerErrorCode.GM_VALIDATION_REQUIRED]
            .isRetryable,
        ).toBe(false)
        expect(
          retryClassifications[GenshinManagerErrorCode.GM_VALIDATION_FORMAT]
            .isRetryable,
        ).toBe(false)
        expect(
          retryClassifications[GenshinManagerErrorCode.GM_VALIDATION_ENUM]
            .isRetryable,
        ).toBe(false)
      })

      it('should mark ASSETS_CORRUPTED as non-retryable', () => {
        expect(
          retryClassifications[GenshinManagerErrorCode.GM_ASSETS_CORRUPTED]
            .isRetryable,
        ).toBe(false)
      })

      it('should mark most DECODING errors as non-retryable', () => {
        expect(
          retryClassifications[
            GenshinManagerErrorCode.GM_DECODE_MASTER_NOT_FOUND
          ].isRetryable,
        ).toBe(false)
        expect(
          retryClassifications[
            GenshinManagerErrorCode.GM_DECODE_PATTERN_MISMATCH
          ].isRetryable,
        ).toBe(false)
        expect(
          retryClassifications[GenshinManagerErrorCode.GM_DECODE_LOW_CONFIDENCE]
            .isRetryable,
        ).toBe(false)
        expect(
          retryClassifications[
            GenshinManagerErrorCode.GM_DECODE_KEY_MATCHING_FAILED
          ].isRetryable,
        ).toBe(false)
        expect(
          retryClassifications[
            GenshinManagerErrorCode.GM_DECODE_JSON_PARSE_FAILED
          ].isRetryable,
        ).toBe(false)
      })

      it('should mark CONFIG errors as non-retryable', () => {
        expect(
          retryClassifications[GenshinManagerErrorCode.GM_CONFIG_INVALID]
            .isRetryable,
        ).toBe(false)
        expect(
          retryClassifications[GenshinManagerErrorCode.GM_CONFIG_MISSING]
            .isRetryable,
        ).toBe(false)
      })

      it('should mark TEXT_MAP_FORMAT error as non-retryable', () => {
        expect(
          retryClassifications[
            GenshinManagerErrorCode.GM_CONTENT_TEXT_MAP_FORMAT
          ].isRetryable,
        ).toBe(false)
      })
    })

    describe('retryable errors', () => {
      it('should configure ASSETS_NOT_FOUND with retry settings', () => {
        const config =
          retryClassifications[GenshinManagerErrorCode.GM_ASSETS_NOT_FOUND]
        expect(config.isRetryable).toBe(true)
        expect(config.maxRetries).toBe(3)
        expect(config.retryDelay).toBe(1000)
        expect(config.backoffMultiplier).toBe(2)
      })

      it('should configure ASSETS_DOWNLOAD_FAILED with retry settings', () => {
        const config =
          retryClassifications[
            GenshinManagerErrorCode.GM_ASSETS_DOWNLOAD_FAILED
          ]
        expect(config.isRetryable).toBe(true)
        expect(config.maxRetries).toBe(3)
        expect(config.retryDelay).toBe(2000)
        expect(config.backoffMultiplier).toBe(2)
      })

      it('should configure ASSETS_AUDIO_NOT_FOUND with retry settings', () => {
        const config =
          retryClassifications[
            GenshinManagerErrorCode.GM_ASSETS_AUDIO_NOT_FOUND
          ]
        expect(config.isRetryable).toBe(true)
        expect(config.maxRetries).toBe(2)
        expect(config.retryDelay).toBe(1000)
      })

      it('should configure ASSETS_IMAGE_NOT_FOUND with retry settings', () => {
        const config =
          retryClassifications[
            GenshinManagerErrorCode.GM_ASSETS_IMAGE_NOT_FOUND
          ]
        expect(config.isRetryable).toBe(true)
        expect(config.maxRetries).toBe(2)
        expect(config.retryDelay).toBe(1000)
      })

      it('should configure NETWORK_TIMEOUT with retry settings', () => {
        const config =
          retryClassifications[GenshinManagerErrorCode.GM_NETWORK_TIMEOUT]
        expect(config.isRetryable).toBe(true)
        expect(config.maxRetries).toBe(3)
        expect(config.retryDelay).toBe(1000)
        expect(config.backoffMultiplier).toBe(2)
      })

      it('should configure NETWORK_UNAVAILABLE with retry settings', () => {
        const config =
          retryClassifications[GenshinManagerErrorCode.GM_NETWORK_UNAVAILABLE]
        expect(config.isRetryable).toBe(true)
        expect(config.maxRetries).toBe(5)
        expect(config.retryDelay).toBe(5000)
        expect(config.backoffMultiplier).toBe(1.5)
      })

      it('should configure NETWORK_ENKA_ERROR with retry settings', () => {
        const config =
          retryClassifications[GenshinManagerErrorCode.GM_NETWORK_ENKA_ERROR]
        expect(config.isRetryable).toBe(true)
        expect(config.maxRetries).toBe(3)
        expect(config.retryDelay).toBe(2000)
      })

      it('should configure NETWORK_ENKA_STATUS_ERROR with retry settings', () => {
        const config =
          retryClassifications[
            GenshinManagerErrorCode.GM_NETWORK_ENKA_STATUS_ERROR
          ]
        expect(config.isRetryable).toBe(true)
        expect(config.maxRetries).toBe(2)
        expect(config.retryDelay).toBe(3000)
      })

      it('should configure CONTENT_ANN_NOT_FOUND with retry settings', () => {
        const config =
          retryClassifications[GenshinManagerErrorCode.GM_CONTENT_ANN_NOT_FOUND]
        expect(config.isRetryable).toBe(true)
        expect(config.maxRetries).toBe(2)
        expect(config.retryDelay).toBe(1000)
      })

      it('should configure CONTENT_BODY_NOT_FOUND with retry settings', () => {
        const config =
          retryClassifications[
            GenshinManagerErrorCode.GM_CONTENT_BODY_NOT_FOUND
          ]
        expect(config.isRetryable).toBe(true)
        expect(config.maxRetries).toBe(2)
        expect(config.retryDelay).toBe(1000)
      })

      it('should configure GENERAL_UNKNOWN with retry settings', () => {
        const config =
          retryClassifications[GenshinManagerErrorCode.GM_GENERAL_UNKNOWN]
        expect(config.isRetryable).toBe(true)
        expect(config.maxRetries).toBe(1)
        expect(config.retryDelay).toBe(2000)
      })
    })
  })
})
