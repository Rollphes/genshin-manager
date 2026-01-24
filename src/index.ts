import { Artifact, ArtifactAffixAppendProp } from '@/adapter/output/Artifact'
import { AudioAssets } from '@/adapter/output/assets/AudioAssets'
import { ImageAssets } from '@/adapter/output/assets/ImageAssets'
import {
  Character,
  CharacterSummary,
} from '@/adapter/output/character/Character'
import { CharacterAscension } from '@/adapter/output/character/CharacterAscension'
import { CharacterBaseStats } from '@/adapter/output/character/CharacterBaseStats'
import { CharacterConstellation } from '@/adapter/output/character/CharacterConstellation'
import { CharacterCostume } from '@/adapter/output/character/CharacterCostume'
import { CharacterInfo } from '@/adapter/output/character/CharacterInfo'
import { CharacterInherentSkill } from '@/adapter/output/character/CharacterInherentSkill'
import { CharacterProfile } from '@/adapter/output/character/CharacterProfile'
import { CharacterSkill } from '@/adapter/output/character/CharacterSkill'
import { CharacterSkillAscension } from '@/adapter/output/character/CharacterSkillAscension'
import { CharacterStatusManager } from '@/adapter/output/character/CharacterStatusManager'
import { CharacterStory } from '@/adapter/output/character/CharacterStory'
import { CharacterVoice } from '@/adapter/output/character/CharacterVoice'
import { DailyFarming, DomainData } from '@/adapter/output/DailyFarming'
import { CharacterDetail } from '@/adapter/output/enka/CharacterDetail'
import { CharacterPreview } from '@/adapter/output/enka/CharacterPreview'
import { EnkaAccount } from '@/adapter/output/enka/EnkaAccount'
import { EnkaBuild } from '@/adapter/output/enka/EnkaBuild'
import { GenshinAccount } from '@/adapter/output/enka/GenshinAccount'
import { PlayerDetail } from '@/adapter/output/enka/PlayerDetail'
import { Material } from '@/adapter/output/Material'
import { Monster } from '@/adapter/output/Monster'
import { Notice } from '@/adapter/output/Notice'
import { ProfilePicture } from '@/adapter/output/ProfilePicture'
import { SetBonus } from '@/adapter/output/SetBonus'
import { StatProperty } from '@/adapter/output/StatProperty'
import { Weapon } from '@/adapter/output/weapon/Weapon'
import { WeaponAscension } from '@/adapter/output/weapon/WeaponAscension'
import { WeaponInfo } from '@/adapter/output/weapon/WeaponInfo'
import { WeaponRefinement } from '@/adapter/output/weapon/WeaponRefinement'
import { AssetCacheManager } from '@/application/client/AssetCacheManager'
import { Client } from '@/application/client/Client'
import { type EnkaData, EnkaManager } from '@/application/enka/EnkaManager'
import { NoticeManager } from '@/application/notice/NoticeManager'
import {
  type ClientEventMap,
  ClientEvents,
} from '@/application/types/events/client'
import {
  type EnkaManagerEventMap,
  EnkaManagerEvents,
} from '@/application/types/events/enka'
import {
  type NoticeManagerEventMap,
  NoticeManagerEvents,
} from '@/application/types/events/notice'
import { convertToUTC } from '@/domain/parsers/convertToUTC'
import {
  BodyType,
  EquipType,
  FightProp,
  ItemType,
  MaterialType,
  ProfilePictureUnlockType,
  QualityType,
  WeaponType,
} from '@/domain/types/enums'
import { LogLevel } from '@/domain/types/LogLevel'
import {
  AscensionMaterial,
  CharacterUpgradePlan,
  ClientOption,
  CostItem,
  CVType,
  Element,
  Language,
  LevelRange,
  SkillLevelPlan,
  WeaponSummary,
} from '@/domain/types/types'
export {
  Artifact,
  AssetCacheManager,
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
  CharacterSummary,
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
  SetBonus,
  StatProperty,
  Weapon,
  WeaponAscension,
  WeaponInfo,
  WeaponRefinement,
}
export { convertToUTC }
export {
  ArtifactAffixAppendProp,
  AscensionMaterial,
  BodyType,
  CharacterUpgradePlan,
  ClientEventMap,
  ClientEvents,
  ClientOption,
  CostItem,
  CVType,
  DomainData,
  Element,
  EnkaData,
  EnkaManagerEventMap,
  EnkaManagerEvents,
  EquipType,
  FightProp,
  ItemType,
  Language,
  LevelRange,
  LogLevel,
  MaterialType,
  NoticeManagerEventMap,
  NoticeManagerEvents,
  ProfilePictureUnlockType,
  QualityType,
  SkillLevelPlan,
  WeaponSummary,
  WeaponType,
}

// Export EnkaNetwork types
export * from '@/infrastructure/types/api/enkaNetwork/responses'

// Export SG-HK4E-API types
export { Region, TimeZonesPerRegion } from '@/domain/types/Region'

// Export error system - base
export {
  errorCategories,
  type ErrorCategory,
  GenshinManagerErrorCode,
  retryClassifications,
  type RetryConfiguration,
} from '@/domain/errors/base/ErrorCodes'
export type { ErrorContext } from '@/domain/errors/base/ErrorContext'
export { GenshinManagerError } from '@/domain/errors/base/GenshinManagerError'

// Export error system - context types
export type {
  AssetContext,
  EnumContext,
  NetworkContext,
  ValidationContext,
} from '@/domain/types/errorContext'

// Export error system - validation errors
export { EnumValidationError } from '@/domain/errors/validation/EnumValidationError'
export { FormatValidationError } from '@/domain/errors/validation/FormatValidationError'
export { RequiredFieldError } from '@/domain/errors/validation/RequiredFieldError'
export { ValidationError } from '@/domain/errors/validation/ValidationError'

// Export error system - asset errors
export { AssetCorruptedError } from '@/infrastructure/errors/AssetCorruptedError'
export { AssetError } from '@/infrastructure/errors/AssetError'
export { AssetNotFoundError } from '@/infrastructure/errors/AssetNotFoundError'
export { AudioNotFoundError } from '@/infrastructure/errors/AudioNotFoundError'
export { ImageNotFoundError } from '@/infrastructure/errors/ImageNotFoundError'

// Export error system - network errors
export { NetworkError } from '@/infrastructure/errors/NetworkError'
export { NetworkUnavailableError } from '@/infrastructure/errors/NetworkUnavailableError'

// Export error system - content errors
export { AnnContentNotFoundError } from '@/application/errors/AnnContentNotFoundError'
export { BodyNotFoundError } from '@/application/errors/BodyNotFoundError'
export { TextMapFormatError } from '@/application/errors/TextMapFormatError'

// Export error system - config errors
export { ConfigMissingError } from '@/infrastructure/errors/ConfigMissingError'

// Export error system - general errors
export { GeneralError } from '@/application/errors/GeneralError'
