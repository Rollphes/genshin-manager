// Base error system
export type {
  ErrorCategory,
  RetryConfiguration,
} from '@/errors/base/ErrorCodes'
export {
  errorCategories,
  GenshinManagerErrorCode,
  retryClassifications,
} from '@/errors/base/ErrorCodes'
export type { ErrorContext } from '@/errors/base/ErrorContext'
export { ErrorContextFactory } from '@/errors/base/ErrorContext'
export { GenshinManagerError } from '@/errors/base/GenshinManagerError'

// Validation errors
export { EnumValidationError } from '@/errors/validation/EnumValidationError'
export { FormatValidationError } from '@/errors/validation/FormatValidationError'
export { RangeValidationError } from '@/errors/validation/RangeValidationError'
export { RequiredFieldError } from '@/errors/validation/RequiredFieldError'
export { ValidationError } from '@/errors/validation/ValidationError'

// Asset errors
export { AssetCorruptedError } from '@/errors/assets/AssetCorruptedError'
export { AssetDownloadFailedError } from '@/errors/assets/AssetDownloadFailedError'
export { AssetError } from '@/errors/assets/AssetError'
export { AssetErrorFactory } from '@/errors/assets/AssetErrorFactory'
export { AssetNotFoundError } from '@/errors/assets/AssetNotFoundError'
export { AudioNotFoundError } from '@/errors/assets/AudioNotFoundError'
export { ImageNotFoundError } from '@/errors/assets/ImageNotFoundError'

// Network errors
export { EnkaNetworkError } from '@/errors/network/EnkaNetworkError'
export { EnkaNetworkStatusError } from '@/errors/network/EnkaNetworkStatusError'
export { NetworkError } from '@/errors/network/NetworkError'
export { NetworkTimeoutError } from '@/errors/network/NetworkTimeoutError'
export { NetworkUnavailableError } from '@/errors/network/NetworkUnavailableError'

// Decoding errors
export { KeyMatchingError } from '@/errors/decoding/KeyMatchingError'
export { LowConfidenceError } from '@/errors/decoding/LowConfidenceError'
export { MasterFileConfigurationError } from '@/errors/decoding/MasterFileConfigurationError'
export { PatternMismatchError } from '@/errors/decoding/PatternMismatchError'

// Content errors
export { AnnContentNotFoundError } from '@/errors/content/AnnContentNotFoundError'
export { BodyNotFoundError } from '@/errors/content/BodyNotFoundError'
export { TextMapFormatError } from '@/errors/content/TextMapFormatError'

// Configuration errors
export { ConfigInvalidError } from '@/errors/config/ConfigInvalidError'
export { ConfigMissingError } from '@/errors/config/ConfigMissingError'

// General errors
export { GeneralError } from '@/errors/general/GeneralError'
