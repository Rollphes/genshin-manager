/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'

import { DragEnum } from '@/enum/Drag'
import { MonitorEnum } from '@/enum/Monitor'

export const BuffIconSchema = z.enum(['', 'Skill_B_Barbara_01'])
export type BuffIcon = z.infer<typeof BuffIconSchema>

export const CostElemTypeSchema = z.enum([
  'Electric',
  'Fire',
  'Grass',
  'Ice',
  'None',
  'Rock',
  'Water',
  'Wind',
])
export type CostElemType = z.infer<typeof CostElemTypeSchema>

export const GlobalValueKeySchema = z.enum([
  'AVATAR_6_0_QUEST_ENERGY',
  'AVATAR_6_3_QUEST_ENERGY',
  'AVATAR_BLOCKING_ENERGY',
  'AVATAR_BLOCKING_MIKAWAFLOWER_ENERGY',
  'AVATAR_BREAKOUT_ENERGY',
  'AVATAR_DIVE_ENERGY',
  'AVATAR_GLIDING_ENERGY',
  'AVATAR_INAZUMA_BADMINTON_HUGE',
  'AVATAR_LANV3RACE_ENERGY',
  'AVATAR_MagnetAbsorbSkill',
  'AVATAR_MagnetThrowSkill',
  'AVATAR_MVM_ENERGY',
  'AVATAR_SEEKANDHIDE_ENERGY',
  'AVATAR_Select_Launcher_Target_Charge',
  '',
  'Flying_Squirrel_FlyEnergy',
  'GV_HoldBallFlag',
  'GV_SideScrollerParkour_SkillEnergy',
  'GV_V6_1_Quest_Rerir_Fight_NeferSpecialEnergy',
  'OrigamiSquirrel_Return_Energy',
  'TEAM_AbyssCity_LunarisCut_SP_ENERGY',
  'TEAM_ANTI_KILL_ENERGY',
  'TEAM_LunarisCSMIX_ENERGY',
  'TEAM_PlayerSkill_LuanrisThrow_Vail',
  'TEAM_TTC_ThrowCoinSkill',
  'V6_3_LunarisCSMIX_Unload',
])
export type GlobalValueKey = z.infer<typeof GlobalValueKeySchema>

export const LockShapeSchema = z.enum([
  'CircleLockEnemy',
  'CircleLockEnemyAmborFly',
  'CircleLockEnemyR10',
  'CircleLockEnemyR10H6HC',
  'CircleLockEnemyR12H14HC',
  'CircleLockEnemyR15H10HC',
  'CircleLockEnemyR25H10HC',
  'CircleLockEnemyR5H10HC',
  'CircleLockEnemyR5H6HC',
  'CircleLockEnemyR7H6HC',
  'CircleLockEnemyR8H6HC',
  'CircleR25H20HC',
])
export type LockShape = z.infer<typeof LockShapeSchema>

export const AvatarSkillExcelConfigDataSchema = z.object({
  abilityName: z.string(),
  buffIcon: BuffIconSchema,
  cdSlot: z.number(),
  cdTime: z.number(),
  costElemType: CostElemTypeSchema,
  costElemVal: z.number(),
  costStamina: z.number(),
  descTextMapHash: z.number(),
  dragType: DragEnum,
  energyMin: z.number(),
  extraDescTextMapHash: z.number(),
  globalValueKey: GlobalValueKeySchema,
  id: z.number(),
  isAttackCameraLock: z.boolean(),
  lockShape: LockShapeSchema,
  lockWeightParams: z.array(z.number()),
  maxChargeNum: z.number(),
  nameTextMapHash: z.number(),
  needMonitor: MonitorEnum,
  proudSkillGroupId: z.number(),
  shareCDID: z.number(),
  skillIcon: z.string(),
  triggerID: z.number(),
})
export type AvatarSkillExcelConfigData = z.infer<
  typeof AvatarSkillExcelConfigDataSchema
>
