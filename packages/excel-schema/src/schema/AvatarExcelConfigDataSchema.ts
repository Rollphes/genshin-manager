/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T17:11:38.550Z
 */
import { z } from 'zod'

import { AvatarEnum } from '@/enum/Avatar'
import { AvatarIdentityEnum } from '@/enum/AvatarIdentity'
import { BodyEnum } from '@/enum/Body'
import { FightPropBaseEnum } from '@/enum/FightPropBase'
import { GrowCurveEnum } from '@/enum/GrowCurve'
import { QualityEnum } from '@/enum/Quality'
import { WeaponEnum } from '@/enum/Weapon'

export const TagSchema = z.enum([
  'AVATAR_TAG_HEXENZIRKEL',
  'AVATAR_TAG_MOONPHASE',
  'None',
])
export type Tag = z.infer<typeof TagSchema>

export const PropGrowCurveSchema = z.object({
  growCurve: GrowCurveEnum,
  type: FightPropBaseEnum,
})
export type PropGrowCurve = z.infer<typeof PropGrowCurveSchema>

export const AvatarExcelConfigDataSchema = z.object({
  animatorConfigPathHash: z.union([z.number(), z.string()]),
  attackBase: z.number(),
  avatarIdentityType: AvatarIdentityEnum,
  avatarPromoteId: z.number(),
  avatarPromoteRewardIdList: z.array(z.number()),
  avatarPromoteRewardLevelList: z.array(z.number()),
  bodyType: BodyEnum,
  campID: z.number(),
  candSkillDepotIds: z.array(z.number()),
  chargeEfficiency: z.number(),
  combatConfigHash: z.string(),
  controllerPathHash: z.string(),
  controllerPathRemoteHash: z.string(),
  coopPicNameHash: z.union([z.number(), z.string()]),
  critical: z.number(),
  criticalHurt: z.number(),
  defenseBase: z.number(),
  deformationMeshPathHash: z.string(),
  descTextMapHash: z.number(),
  elecSubHurt: z.number(),
  elementMastery: z.number(),
  featureTagGroupID: z.number(),
  fireSubHurt: z.number(),
  gachaCardNameHash: z.union([z.number(), z.string()]),
  gachaImageNameHash: z.union([z.number(), z.string()]),
  grassSubHurt: z.number(),
  hpBase: z.number(),
  iceSubHurt: z.number(),
  iconName: z.string(),
  id: z.number(),
  imageName: z.string(),
  initialWeapon: z.number(),
  isRangeAttack: z.boolean(),
  lodPatternName: z.string(),
  manekinJsonConfigHash: z.string(),
  manekinMotionConfig: z.number(),
  manekinPathHash: z.string(),
  nameTextMapHash: z.number(),
  physicalSubHurt: z.number(),
  prefabPathHash: z.string(),
  prefabPathRagdollHash: z.string(),
  prefabPathRemoteHash: z.string(),
  propGrowCurves: z.array(PropGrowCurveSchema),
  qualityType: QualityEnum,
  rockSubHurt: z.number(),
  scriptDataPathHash: z.string(),
  sideIconName: z.string(),
  skillDepotId: z.number().optional(),
  specialDeformationMeshPathHash: z.union([z.number(), z.string()]),
  staminaRecoverSpeed: z.number(),
  tags: z.array(TagSchema),
  useType: AvatarEnum,
  waterSubHurt: z.number(),
  weaponType: WeaponEnum,
  windSubHurt: z.number(),
})
export type AvatarExcelConfigData = z.infer<typeof AvatarExcelConfigDataSchema>
