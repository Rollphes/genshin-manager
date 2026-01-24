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
import { Artifact, ArtifactAffixAppendProp } from '@/interface/Artifact'
import { AudioAssets } from '@/interface/assets/AudioAssets'
import { ImageAssets } from '@/interface/assets/ImageAssets'
import { Character, CharacterSummary } from '@/interface/character/Character'
import { CharacterAscension } from '@/interface/character/CharacterAscension'
import { CharacterBaseStats } from '@/interface/character/CharacterBaseStats'
import { CharacterConstellation } from '@/interface/character/CharacterConstellation'
import { CharacterCostume } from '@/interface/character/CharacterCostume'
import { CharacterInfo } from '@/interface/character/CharacterInfo'
import { CharacterInherentSkill } from '@/interface/character/CharacterInherentSkill'
import { CharacterProfile } from '@/interface/character/CharacterProfile'
import { CharacterSkill } from '@/interface/character/CharacterSkill'
import { CharacterSkillAscension } from '@/interface/character/CharacterSkillAscension'
import { CharacterStatusManager } from '@/interface/character/CharacterStatusManager'
import { CharacterStory } from '@/interface/character/CharacterStory'
import { CharacterVoice } from '@/interface/character/CharacterVoice'
import { DailyFarming, DomainData } from '@/interface/DailyFarming'
import { CharacterDetail } from '@/interface/enka/CharacterDetail'
import { CharacterPreview } from '@/interface/enka/CharacterPreview'
import { EnkaAccount } from '@/interface/enka/EnkaAccount'
import { EnkaBuild } from '@/interface/enka/EnkaBuild'
import { GenshinAccount } from '@/interface/enka/GenshinAccount'
import { PlayerDetail } from '@/interface/enka/PlayerDetail'
import { Material } from '@/interface/Material'
import { Monster } from '@/interface/Monster'
import { Notice } from '@/interface/Notice'
import { ProfilePicture } from '@/interface/ProfilePicture'
import { SetBonus } from '@/interface/SetBonus'
import { StatProperty } from '@/interface/StatProperty'
import { Weapon } from '@/interface/weapon/Weapon'
import { WeaponAscension } from '@/interface/weapon/WeaponAscension'
import { WeaponInfo } from '@/interface/weapon/WeaponInfo'
import { WeaponRefinement } from '@/interface/weapon/WeaponRefinement'
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
export * from '@/infrastructure/types/api/sg-hk4e-api/types'

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
