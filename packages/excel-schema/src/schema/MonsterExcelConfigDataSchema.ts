/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'

import { FightPropEnum } from '@/enum/FightProp'
import { GrowCurveEnum } from '@/enum/GrowCurve'
import { MonsterEnum } from '@/enum/Monster'
import { VisionLevelEnum } from '@/enum/VisionLevel'

export const AiSchema = z.enum([
  'assist01',
  'dragon01',
  '',
  'playing',
  'ranged01',
  'scout01',
  'sentry02',
])
export type Ai = z.infer<typeof AiSchema>

export const ExcludeWeathersSchema = z.enum(['', '雨,雷雨,雪', '雪', '雷雨,雪'])
export type ExcludeWeathers = z.infer<typeof ExcludeWeathersSchema>

export const LodPatternNameSchema = z.enum([
  'Animal_Default_01',
  'Animal_Special_200_01',
  'Animal_Special_20_01',
  'Animal_Special_40_01',
  '',
  'Monster_Beyd_Default_Lod1',
  'Monster_Beyd_Default_Lod2',
  'Monster_DisplayFar',
  'Monster_Flamingo_Normal_Migrate_01',
  'Monster_GiantChess_Stage2',
  'Monster_Narcissusborn_Narzissenkreuz_01',
  'Monster_Regisvine_Electric_01',
  'Monster_ShootingActivity_01',
  'Monster_Special_200_01',
  'Monster_Special_250_02',
  'Monster_Special_Dragon_01',
])
export type LodPatternName = z.infer<typeof LodPatternNameSchema>

export const PlayTypeSchema = z.enum(['BEYOND', 'DEFAULT'])
export type PlayType = z.infer<typeof PlayTypeSchema>

export const SecurityLevelSchema = z.enum(['BOSS', 'ELITE', 'NORMAL'])
export type SecurityLevel = z.infer<typeof SecurityLevelSchema>

export const ServerScriptSchema = z.enum([
  '',
  'SubFieldDrop_LightBall',
  'SubFieldDrop_Mimik_Ice',
  'Test_Mole_MoraDrop',
])
export type ServerScript = z.infer<typeof ServerScriptSchema>

export const PropGrowCurveSchema = z.object({
  growCurve: GrowCurveEnum,
  type: FightPropEnum,
})
export type PropGrowCurve = z.infer<typeof PropGrowCurveSchema>

export const MonsterExcelConfigDataSchema = z.object({
  affix: z.array(z.number()),
  ai: AiSchema,
  attackBase: z.number(),
  campID: z.number(),
  canSwim: z.boolean(),
  combatBGMLevel: z.number(),
  combatConfigHash: z.union([z.number(), z.string()]),
  controllerPathHash: z.union([z.number(), z.string()]),
  controllerPathRemoteHash: z.string(),
  critical: z.number(),
  criticalHurt: z.number(),
  defenseBase: z.number(),
  deformationMeshPathHash: z.union([z.number(), z.string()]),
  describeId: z.number(),
  elecSubHurt: z.number().optional(),
  elementMastery: z.number(),
  entityBudgetLevel: z.number(),
  equips: z.array(z.number()),
  excludeWeathers: ExcludeWeathersSchema,
  featureTagGroupID: z.number(),
  fireSubHurt: z.number().optional(),
  grassSubHurt: z.number().optional(),
  hideNameInElementView: z.boolean(),
  hpBase: z.number(),
  iceSubHurt: z.number().optional(),
  id: z.number(),
  isAIHashCheck: z.boolean(),
  isInvisibleReset: z.boolean(),
  killDropId: z.number(),
  lodPatternName: LodPatternNameSchema,
  monsterName: z.string(),
  mpPropID: z.number(),
  nameTextMapHash: z.number(),
  physicalSubHurt: z.number().optional(),
  playType: PlayTypeSchema,
  prefabPathHash: z.string(),
  prefabPathRagdollHash: z.union([z.number(), z.string()]),
  prefabPathRemoteHash: z.union([z.number(), z.string()]),
  propGrowCurves: z.array(PropGrowCurveSchema),
  radarHintID: z.number(),
  rockSubHurt: z.number().optional(),
  safetyCheck: z.boolean(),
  scriptDataPathHash: z.union([z.number(), z.string()]),
  securityLevel: SecurityLevelSchema,
  serverScript: ServerScriptSchema,
  skin: z.string(),
  type: MonsterEnum,
  visionLevel: VisionLevelEnum,
  waterSubHurt: z.number().optional(),
  windSubHurt: z.number().optional(),
})
export type MonsterExcelConfigData = z.infer<
  typeof MonsterExcelConfigDataSchema
>
