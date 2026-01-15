import { Client, ClientEvents } from '@/client/Client'
import {
  type EnkaData,
  EnkaManager,
  EnkaManagerEvents,
} from '@/client/EnkaManager'
import { NoticeManager, NoticeManagerEvents } from '@/client/NoticeManager'
import { Artifact } from '@/models/Artifact'
import { AudioAssets } from '@/models/assets/AudioAssets'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { Character } from '@/models/character/Character'
import { CharacterAscension } from '@/models/character/CharacterAscension'
import { CharacterBaseStats } from '@/models/character/CharacterBaseStats'
import { CharacterConstellation } from '@/models/character/CharacterConstellation'
import { CharacterCostume } from '@/models/character/CharacterCostume'
import { CharacterInfo } from '@/models/character/CharacterInfo'
import { CharacterInherentSkill } from '@/models/character/CharacterInherentSkill'
import { CharacterProfile } from '@/models/character/CharacterProfile'
import { CharacterSkill } from '@/models/character/CharacterSkill'
import { CharacterSkillAscension } from '@/models/character/CharacterSkillAscension'
import { CharacterStatusManager } from '@/models/character/CharacterStatusManager'
import { CharacterStory } from '@/models/character/CharacterStory'
import { CharacterVoice } from '@/models/character/CharacterVoice'
import { DailyFarming, DomainData } from '@/models/DailyFarming'
import { CharacterDetail } from '@/models/enka/CharacterDetail'
import { CharacterPreview } from '@/models/enka/CharacterPreview'
import { EnkaAccount } from '@/models/enka/EnkaAccount'
import { EnkaBuild } from '@/models/enka/EnkaBuild'
import { GenshinAccount } from '@/models/enka/GenshinAccount'
import { PlayerDetail } from '@/models/enka/PlayerDetail'
import { Material } from '@/models/Material'
import { Monster } from '@/models/Monster'
import { Notice } from '@/models/Notice'
import { ProfilePicture } from '@/models/ProfilePicture'
import { StatProperty } from '@/models/StatProperty'
import { Weapon } from '@/models/weapon/Weapon'
import { WeaponAscension } from '@/models/weapon/WeaponAscension'
import { WeaponInfo } from '@/models/weapon/WeaponInfo'
import { WeaponRefinement } from '@/models/weapon/WeaponRefinement'
import { BodyType, QualityType } from '@/types/generated/AvatarExcelConfigData'
import {
  ItemType,
  MaterialType,
} from '@/types/generated/MaterialExcelConfigData'
import type { Type as ProfilePictureType } from '@/types/generated/ProfilePictureExcelConfigData'
import { EquipType as ArtifactType } from '@/types/generated/ReliquaryExcelConfigData'
import { WeaponType } from '@/types/generated/WeaponExcelConfigData'
import { ClientOption, CVType, Element, FightPropType } from '@/types/types'
import { convertToUTC } from '@/utils/parsers/convertToUTC'
export {
  Artifact,
  AudioAssets,
  Character,
  CharacterAscension,
  CharacterBaseStats,
  CharacterConstellation,
  CharacterCostume,
  CharacterDetail,
  CharacterInfo,
  CharacterInherentSkill,
  CharacterPreview,
  CharacterProfile,
  CharacterSkill,
  CharacterSkillAscension,
  CharacterStatusManager,
  CharacterStory,
  CharacterVoice,
  Client,
  DailyFarming,
  EnkaAccount,
  EnkaBuild,
  EnkaManager,
  GenshinAccount,
  ImageAssets,
  Material,
  Monster,
  Notice,
  NoticeManager,
  PlayerDetail,
  ProfilePicture,
  StatProperty,
  Weapon,
  WeaponAscension,
  WeaponInfo,
  WeaponRefinement,
}
export { convertToUTC }
export {
  ArtifactType,
  BodyType,
  ClientEvents,
  ClientOption,
  CVType,
  DomainData,
  Element,
  EnkaData,
  EnkaManagerEvents,
  FightPropType,
  ItemType,
  MaterialType,
  NoticeManagerEvents,
  ProfilePictureType,
  QualityType,
  WeaponType,
}
// Export generated types
export type {
  DecodedType,
  MasterFileMap,
} from '@/types/generated/MasterFileMap'

// Export EnkaNetwork types
export * from '@/types/enkaNetwork/EnkaAccountTypes'
export * from '@/types/enkaNetwork/EnkaStatusTypes'
export * from '@/types/enkaNetwork/EnkaTypes'

// Export SG-HK4E-API types
export * from '@/types/sg-hk4e-api'

// Export error system - base
export {
  errorCategories,
  type ErrorCategory,
  GenshinManagerErrorCode,
  retryClassifications,
  type RetryConfiguration,
} from '@/errors/base/ErrorCodes'
export type { ErrorContext } from '@/errors/base/ErrorContext'
export { ErrorContextFactory } from '@/errors/base/ErrorContext'
export { GenshinManagerError } from '@/errors/base/GenshinManagerError'

// Export error system - validation errors
export { EnumValidationError } from '@/errors/validation/EnumValidationError'
export { FormatValidationError } from '@/errors/validation/FormatValidationError'
export { RangeValidationError } from '@/errors/validation/RangeValidationError'
export { RequiredFieldError } from '@/errors/validation/RequiredFieldError'
export { ValidationError } from '@/errors/validation/ValidationError'

// Export error system - asset errors
export { AssetCorruptedError } from '@/errors/assets/AssetCorruptedError'
export { AssetDownloadFailedError } from '@/errors/assets/AssetDownloadFailedError'
export { AssetError } from '@/errors/assets/AssetError'
export { AssetErrorFactory } from '@/errors/assets/AssetErrorFactory'
export { AssetNotFoundError } from '@/errors/assets/AssetNotFoundError'
export { AudioNotFoundError } from '@/errors/assets/AudioNotFoundError'
export { ImageNotFoundError } from '@/errors/assets/ImageNotFoundError'

// Export error system - network errors
export { EnkaNetworkError } from '@/errors/network/EnkaNetworkError'
export { EnkaNetworkStatusError } from '@/errors/network/EnkaNetworkStatusError'
export { NetworkError } from '@/errors/network/NetworkError'
export { NetworkTimeoutError } from '@/errors/network/NetworkTimeoutError'
export { NetworkUnavailableError } from '@/errors/network/NetworkUnavailableError'

// Export error system - decoding errors
export { JsonParseError } from '@/errors/decoding/JsonParseError'
export { KeyMatchingError } from '@/errors/decoding/KeyMatchingError'
export { LowConfidenceError } from '@/errors/decoding/LowConfidenceError'
export { MasterFileConfigurationError } from '@/errors/decoding/MasterFileConfigurationError'
export { PatternMismatchError } from '@/errors/decoding/PatternMismatchError'

// Export error system - content errors
export { AnnContentNotFoundError } from '@/errors/content/AnnContentNotFoundError'
export { BodyNotFoundError } from '@/errors/content/BodyNotFoundError'
export { TextMapFormatError } from '@/errors/content/TextMapFormatError'

// Export error system - config errors
export { ConfigInvalidError } from '@/errors/config/ConfigInvalidError'
export { ConfigMissingError } from '@/errors/config/ConfigMissingError'

// Export error system - general errors
export { GeneralError } from '@/errors/general/GeneralError'

// Export validation schemas
export * from '@/schemas/commonSchemas'
export { createArtifactLevelSchema } from '@/schemas/createArtifactLevelSchema'
export { createDynamicWeaponLevelSchema } from '@/schemas/createDynamicWeaponLevelSchema'
export { createPromoteLevelSchema } from '@/schemas/createPromoteLevelSchema'
export { createRangeSchema } from '@/schemas/createRangeSchema'
export { createUpdateIntervalSchema } from '@/schemas/createUpdateIntervalSchema'
