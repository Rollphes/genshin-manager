import { z } from 'zod'

import { createArtifactLevelSchema } from '@/schemas/createArtifactLevelSchema'
import { createDynamicWeaponLevelSchema } from '@/schemas/createDynamicWeaponLevelSchema'
import { createPromoteLevelSchema } from '@/schemas/createPromoteLevelSchema'
import { createRangeSchema } from '@/schemas/createRangeSchema'
import { createUpdateIntervalSchema } from '@/schemas/createUpdateIntervalSchema'

// Re-export factory functions
export {
  createArtifactLevelSchema,
  createDynamicWeaponLevelSchema,
  createPromoteLevelSchema,
  createRangeSchema,
  createUpdateIntervalSchema,
}

/**
 * Common validation schemas for genshin-manager
 */

/**
 * Day of week validation schema (0-6)
 */
export const dayOfWeekSchema = createRangeSchema(0, 6, 'dayOfWeek')

/**
 * Monster level validation schema (1-200)
 */
export const monsterLevelSchema = createRangeSchema(1, 200, 'monster level')

/**
 * Player count validation schema (1-4)
 */
export const playerCountSchema = createRangeSchema(1, 4, 'playerCount')

/**
 * Weapon level validation schema (1-90)
 */
export const weaponLevelSchema = createRangeSchema(1, 90, 'weapon level')

/**
 * Character level validation schema (1-100)
 */
export const characterLevelSchema = createRangeSchema(1, 100, 'character level')

/**
 * Ascension level validation schema (0-6)
 */
export const ascensionLevelSchema = createRangeSchema(0, 6, 'ascension level')

/**
 * Refinement level validation schema (1-5)
 */
export const refinementLevelSchema = createRangeSchema(1, 5, 'refinement level')

/**
 * Constellation level validation schema (0-6)
 */
export const constellationLevelSchema = createRangeSchema(
  0,
  6,
  'constellation level',
)

/**
 * Skill level validation schema (1-15)
 */
export const skillLevelSchema = createRangeSchema(1, 15, 'skill level')

/**
 * UID validation schema
 */
export const uidSchema = z.string().regex(/^\d{9}$/, {
  message: 'UID must be a 9-digit number',
})

/**
 * Traveler character ID validation schema
 */
export const travelerIdSchema = z
  .number()
  .refine((id) => [10000005, 10000007].includes(id), {
    message: 'characterId must be a valid traveler ID (10000005 or 10000007)',
  })

/**
 * Fixed refinement rank validation schema (exactly 1)
 */
export const fixedRefinementSchema = z.number().refine((rank) => rank === 1, {
  message: 'refinementRank must be exactly 1 for this weapon type',
})

/**
 * File path validation schema
 */
export const filePathSchema = z.string().min(1, {
  message: 'File path cannot be empty',
})

/**
 * URL validation schema
 */
export const urlSchema = z.string().url({
  message: 'Must be a valid URL',
})

/**
 * Asset ID validation schema
 */
export const assetIdSchema = z.string().regex(/^\d+$/, {
  message: 'Asset ID must be a numeric string',
})

/**
 * Language code validation schema
 */
export const languageCodeSchema = z.enum(
  [
    'en-us',
    'ja-jp',
    'ko-kr',
    'zh-cn',
    'zh-tw',
    'de-de',
    'es-es',
    'fr-fr',
    'id-id',
    'pt-pt',
    'ru-ru',
    'th-th',
    'vi-vn',
  ],
  {
    message: 'Invalid language code',
  },
)

/**
 * Character rarity validation schema (4-5 stars)
 */
export const characterRaritySchema = z.enum(['4', '5'], {
  message: 'Character rarity must be 4 or 5 stars',
})

/**
 * Weapon rarity validation schema (1-5 stars)
 */
export const weaponRaritySchema = z.enum(['1', '2', '3', '4', '5'], {
  message: 'Weapon rarity must be 1-5 stars',
})

/**
 * Element validation schema
 */
export const elementSchema = z.enum(
  ['Anemo', 'Geo', 'Electro', 'Dendro', 'Hydro', 'Pyro', 'Cryo'],
  {
    message: 'Invalid element type',
  },
)

/**
 * Weapon type validation schema
 */
export const weaponTypeSchema = z.enum(
  [
    'WEAPON_SWORD_ONE_HAND',
    'WEAPON_CLAYMORE',
    'WEAPON_BOW',
    'WEAPON_CATALYST',
    'WEAPON_POLE',
  ],
  {
    message: 'Invalid weapon type',
  },
)

/**
 * Network configuration schema
 */
export const networkConfigSchema = z.object({
  timeout: z.number().min(1000).max(30000).default(10000),
  retries: z.number().min(0).max(10).default(3),
  retryDelay: z.number().min(100).max(10000).default(1000),
  userAgent: z.string().optional(),
})

/**
 * Cache configuration schema
 */
export const cacheConfigSchema = z.object({
  enabled: z.boolean().default(true),
  ttl: z.number().min(0).default(3600000), // 1 hour in ms
  maxSize: z.number().min(1).default(1000),
  cleanupInterval: z.number().min(60000).default(300000), // 5 minutes in ms
})

/**
 * Logging configuration schema
 */
export const loggingConfigSchema = z.object({
  level: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  enabled: z.boolean().default(true),
  includeTimestamp: z.boolean().default(true),
  includeLevel: z.boolean().default(true),
})

/**
 * Asset processing configuration schema
 */
export const assetProcessingConfigSchema = z.object({
  downloadTimeout: z.number().min(1000).max(60000).default(10000),
  maxConcurrentDownloads: z.number().min(1).max(20).default(5),
  retryFailedDownloads: z.boolean().default(true),
  verifyIntegrity: z.boolean().default(false),
})

/**
 * Main configuration schema
 */
export const configSchema = z.object({
  network: networkConfigSchema.optional(),
  cache: cacheConfigSchema.optional(),
  logging: loggingConfigSchema.optional(),
  assetProcessing: assetProcessingConfigSchema.optional(),
  dataDirectory: filePathSchema.optional(),
  language: languageCodeSchema.default('en-us'),
})

/**
 * Export all schemas as a single object for easier imports
 */
export const schemas = {
  // Range schemas
  createUpdateIntervalSchema,
  createPromoteLevelSchema,
  createDynamicWeaponLevelSchema,
  createArtifactLevelSchema,
  weaponLevelSchema,
  characterLevelSchema,
  ascensionLevelSchema,
  refinementLevelSchema,
  constellationLevelSchema,
  skillLevelSchema,
  dayOfWeekSchema,
  monsterLevelSchema,
  playerCountSchema,

  // String schemas
  uidSchema,
  travelerIdSchema,
  fixedRefinementSchema,
  filePathSchema,
  urlSchema,
  assetIdSchema,
  languageCodeSchema,

  // Enum schemas
  characterRaritySchema,
  weaponRaritySchema,
  elementSchema,
  weaponTypeSchema,

  // Configuration schemas
  networkConfigSchema,
  cacheConfigSchema,
  loggingConfigSchema,
  assetProcessingConfigSchema,
  configSchema,
}
