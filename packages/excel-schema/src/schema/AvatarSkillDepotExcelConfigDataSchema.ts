/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T17:11:38.550Z
 */
import { z } from 'zod'

export const AvatarSkillDepotExcelConfigDataSchema = z.object({
  attackModeSkill: z.number(),
  energySkill: z.number(),
  extraAbilities: z.array(z.string()),
  id: z.number(),
  leaderTalent: z.number(),
  skillDepotAbilityGroup: z.string(),
  skills: z.array(z.number()),
  subSkills: z.array(z.number()),
  talents: z.array(z.number()),
  talentStarName: z.string(),
})
export type AvatarSkillDepotExcelConfigData = z.infer<
  typeof AvatarSkillDepotExcelConfigDataSchema
>
