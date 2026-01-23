import { AssetCacheManager } from '@/client/AssetCacheManager'
import { Client } from '@/client/Client'
import { type EnkaData, EnkaManager } from '@/client/EnkaManager'
import { NoticeManager } from '@/client/NoticeManager'
import { convertToUTC } from '@/domain/parsers/convertToUTC'
import { LogLevel } from '@/infrastructure/logger/Logger'
import { Artifact, ArtifactAffixAppendProp } from '@/models/Artifact'
import { AudioAssets } from '@/models/assets/AudioAssets'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { Character, CharacterSummary } from '@/models/character/Character'
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
import { SetBonus } from '@/models/SetBonus'
import { StatProperty } from '@/models/StatProperty'
import { Weapon } from '@/models/weapon/Weapon'
import { WeaponAscension } from '@/models/weapon/WeaponAscension'
import { WeaponInfo } from '@/models/weapon/WeaponInfo'
import { WeaponRefinement } from '@/models/weapon/WeaponRefinement'
import {
  BodyType,
  EquipType,
  FightProp,
  ItemType,
  MaterialType,
  ProfilePictureUnlockType,
  QualityType,
  WeaponType,
} from '@/types/enums'
import { type ClientEventMap, ClientEvents } from '@/types/events/client'
import {
  type EnkaManagerEventMap,
  EnkaManagerEvents,
} from '@/types/events/enka'
import {
  type NoticeManagerEventMap,
  NoticeManagerEvents,
} from '@/types/events/notice'
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
} from '@/types/types'
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
export * from '@/types/api/enkaNetwork/responses'

// Export SG-HK4E-API types
export * from '@/types/api/sg-hk4e-api/types'

// Export error system - base
export {
  errorCategories,
  type ErrorCategory,
  GenshinManagerErrorCode,
  retryClassifications,
  type RetryConfiguration,
} from '@/errors/base/ErrorCodes'
export type { ErrorContext } from '@/errors/base/ErrorContext'
export { GenshinManagerError } from '@/errors/base/GenshinManagerError'

// Export error system - context types
export type {
  AssetContext,
  EnumContext,
  NetworkContext,
  ValidationContext,
} from '@/types/errorContext'

// Export error system - validation errors
export { EnumValidationError } from '@/errors/validation/EnumValidationError'
export { FormatValidationError } from '@/errors/validation/FormatValidationError'
export { RequiredFieldError } from '@/errors/validation/RequiredFieldError'
export { ValidationError } from '@/errors/validation/ValidationError'

// Export error system - asset errors
export { AssetCorruptedError } from '@/errors/assets/AssetCorruptedError'
export { AssetError } from '@/errors/assets/AssetError'
export { AssetNotFoundError } from '@/errors/assets/AssetNotFoundError'
export { AudioNotFoundError } from '@/errors/assets/AudioNotFoundError'
export { ImageNotFoundError } from '@/errors/assets/ImageNotFoundError'

// Export error system - network errors
export { NetworkError } from '@/errors/network/NetworkError'
export { NetworkUnavailableError } from '@/errors/network/NetworkUnavailableError'

// Export error system - content errors
export { AnnContentNotFoundError } from '@/errors/content/AnnContentNotFoundError'
export { BodyNotFoundError } from '@/errors/content/BodyNotFoundError'
export { TextMapFormatError } from '@/errors/content/TextMapFormatError'

// Export error system - config errors
export { ConfigMissingError } from '@/errors/config/ConfigMissingError'

// Export error system - general errors
export { GeneralError } from '@/errors/general/GeneralError'
