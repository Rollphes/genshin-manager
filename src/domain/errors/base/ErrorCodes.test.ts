import { describe, expect, it } from 'vitest'

import {
  errorCategories,
  GenshinManagerErrorCode,
  retryClassifications,
} from '@/domain/errors/base/ErrorCodes'

describe('ErrorCodes', () => {
  describe('GenshinManagerErrorCode', () => {
    describe('VALIDATION errors (1000-1999)', () => {
      it('should have GmValidationType code', () => {
        expect(GenshinManagerErrorCode.GmValidationType).toBe('GM1002')
      })

      it('should have GmValidationRequired code', () => {
        expect(GenshinManagerErrorCode.GmValidationRequired).toBe('GM1003')
      })

      it('should have GmValidationFormat code', () => {
        expect(GenshinManagerErrorCode.GmValidationFormat).toBe('GM1004')
      })

      it('should have GmValidationEnum code', () => {
        expect(GenshinManagerErrorCode.GmValidationEnum).toBe('GM1005')
      })
    })

    describe('ASSETS errors (2000-2999)', () => {
      it('should have GmAssetsNotFound code', () => {
        expect(GenshinManagerErrorCode.GmAssetsNotFound).toBe('GM2001')
      })

      it('should have GmAssetsCorrupted code', () => {
        expect(GenshinManagerErrorCode.GmAssetsCorrupted).toBe('GM2002')
      })

      it('should have GmAssetsAudioNotFound code', () => {
        expect(GenshinManagerErrorCode.GmAssetsAudioNotFound).toBe('GM2004')
      })

      it('should have GmAssetsImageNotFound code', () => {
        expect(GenshinManagerErrorCode.GmAssetsImageNotFound).toBe('GM2005')
      })
    })

    describe('NETWORK errors (4000-4999)', () => {
      it('should have GmNetworkUnavailable code', () => {
        expect(GenshinManagerErrorCode.GmNetworkUnavailable).toBe('GM4002')
      })
    })

    describe('CONFIG errors (5000-5999)', () => {
      it('should have GmConfigMissing code', () => {
        expect(GenshinManagerErrorCode.GmConfigMissing).toBe('GM5002')
      })
    })

    describe('CONTENT errors (6000-6999)', () => {
      it('should have GmContentAnnNotFound code', () => {
        expect(GenshinManagerErrorCode.GmContentAnnNotFound).toBe('GM6001')
      })

      it('should have GmContentBodyNotFound code', () => {
        expect(GenshinManagerErrorCode.GmContentBodyNotFound).toBe('GM6002')
      })

      it('should have GmContentTextMapFormat code', () => {
        expect(GenshinManagerErrorCode.GmContentTextMapFormat).toBe('GM6003')
      })
    })

    describe('GENERAL errors (9000-9999)', () => {
      it('should have GmGeneralUnknown code', () => {
        expect(GenshinManagerErrorCode.GmGeneralUnknown).toBe('GM9001')
      })
    })
  })

  describe('errorCategories', () => {
    it('should map VALIDATION errors to VALIDATION category', () => {
      expect(errorCategories[GenshinManagerErrorCode.GmValidationType]).toBe(
        'VALIDATION',
      )
      expect(
        errorCategories[GenshinManagerErrorCode.GmValidationRequired],
      ).toBe('VALIDATION')
      expect(errorCategories[GenshinManagerErrorCode.GmValidationFormat]).toBe(
        'VALIDATION',
      )
      expect(errorCategories[GenshinManagerErrorCode.GmValidationEnum]).toBe(
        'VALIDATION',
      )
    })

    it('should map ASSETS errors to ASSETS category', () => {
      expect(errorCategories[GenshinManagerErrorCode.GmAssetsNotFound]).toBe(
        'ASSETS',
      )
      expect(errorCategories[GenshinManagerErrorCode.GmAssetsCorrupted]).toBe(
        'ASSETS',
      )
      expect(
        errorCategories[GenshinManagerErrorCode.GmAssetsAudioNotFound],
      ).toBe('ASSETS')
      expect(
        errorCategories[GenshinManagerErrorCode.GmAssetsImageNotFound],
      ).toBe('ASSETS')
    })

    it('should map NETWORK errors to NETWORK category', () => {
      expect(
        errorCategories[GenshinManagerErrorCode.GmNetworkUnavailable],
      ).toBe('NETWORK')
    })

    it('should map CONFIG errors to CONFIG category', () => {
      expect(errorCategories[GenshinManagerErrorCode.GmConfigMissing]).toBe(
        'CONFIG',
      )
    })

    it('should map CONTENT errors to CONTENT category', () => {
      expect(
        errorCategories[GenshinManagerErrorCode.GmContentAnnNotFound],
      ).toBe('CONTENT')
      expect(
        errorCategories[GenshinManagerErrorCode.GmContentBodyNotFound],
      ).toBe('CONTENT')
      expect(
        errorCategories[GenshinManagerErrorCode.GmContentTextMapFormat],
      ).toBe('CONTENT')
    })

    it('should map GENERAL errors to GENERAL category', () => {
      expect(errorCategories[GenshinManagerErrorCode.GmGeneralUnknown]).toBe(
        'GENERAL',
      )
    })
  })

  describe('retryClassifications', () => {
    describe('non-retryable errors', () => {
      it('should mark VALIDATION errors as non-retryable', () => {
        expect(
          retryClassifications[GenshinManagerErrorCode.GmValidationType]
            .isRetryable,
        ).toBe(false)
        expect(
          retryClassifications[GenshinManagerErrorCode.GmValidationRequired]
            .isRetryable,
        ).toBe(false)
        expect(
          retryClassifications[GenshinManagerErrorCode.GmValidationFormat]
            .isRetryable,
        ).toBe(false)
        expect(
          retryClassifications[GenshinManagerErrorCode.GmValidationEnum]
            .isRetryable,
        ).toBe(false)
      })

      it('should mark ASSETS_CORRUPTED as non-retryable', () => {
        expect(
          retryClassifications[GenshinManagerErrorCode.GmAssetsCorrupted]
            .isRetryable,
        ).toBe(false)
      })

      it('should mark CONFIG errors as non-retryable', () => {
        expect(
          retryClassifications[GenshinManagerErrorCode.GmConfigMissing]
            .isRetryable,
        ).toBe(false)
      })

      it('should mark TEXT_MAP_FORMAT error as non-retryable', () => {
        expect(
          retryClassifications[GenshinManagerErrorCode.GmContentTextMapFormat]
            .isRetryable,
        ).toBe(false)
      })
    })

    describe('retryable errors', () => {
      it('should configure ASSETS_NOT_FOUND with retry settings', () => {
        const config =
          retryClassifications[GenshinManagerErrorCode.GmAssetsNotFound]
        expect(config.isRetryable).toBe(true)
        expect(config.maxRetries).toBe(3)
        expect(config.retryDelay).toBe(1000)
        expect(config.backoffMultiplier).toBe(2)
      })

      it('should configure ASSETS_AUDIO_NOT_FOUND with retry settings', () => {
        const config =
          retryClassifications[GenshinManagerErrorCode.GmAssetsAudioNotFound]
        expect(config.isRetryable).toBe(true)
        expect(config.maxRetries).toBe(2)
        expect(config.retryDelay).toBe(1000)
      })

      it('should configure ASSETS_IMAGE_NOT_FOUND with retry settings', () => {
        const config =
          retryClassifications[GenshinManagerErrorCode.GmAssetsImageNotFound]
        expect(config.isRetryable).toBe(true)
        expect(config.maxRetries).toBe(2)
        expect(config.retryDelay).toBe(1000)
      })

      it('should configure NETWORK_UNAVAILABLE with retry settings', () => {
        const config =
          retryClassifications[GenshinManagerErrorCode.GmNetworkUnavailable]
        expect(config.isRetryable).toBe(true)
        expect(config.maxRetries).toBe(5)
        expect(config.retryDelay).toBe(5000)
        expect(config.backoffMultiplier).toBe(1.5)
      })

      it('should configure CONTENT_ANN_NOT_FOUND with retry settings', () => {
        const config =
          retryClassifications[GenshinManagerErrorCode.GmContentAnnNotFound]
        expect(config.isRetryable).toBe(true)
        expect(config.maxRetries).toBe(2)
        expect(config.retryDelay).toBe(1000)
      })

      it('should configure CONTENT_BODY_NOT_FOUND with retry settings', () => {
        const config =
          retryClassifications[GenshinManagerErrorCode.GmContentBodyNotFound]
        expect(config.isRetryable).toBe(true)
        expect(config.maxRetries).toBe(2)
        expect(config.retryDelay).toBe(1000)
      })

      it('should configure GENERAL_UNKNOWN with retry settings', () => {
        const config =
          retryClassifications[GenshinManagerErrorCode.GmGeneralUnknown]
        expect(config.isRetryable).toBe(true)
        expect(config.maxRetries).toBe(1)
        expect(config.retryDelay).toBe(2000)
      })
    })
  })
})
