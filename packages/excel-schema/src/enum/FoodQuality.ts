/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'
/** Zod enum schema for FoodQuality. */
export const FoodQualityEnum = z.enum([
  'FOOD_QUALITY_DELICIOUS',
  'FOOD_QUALITY_NONE',
  'FOOD_QUALITY_ORDINARY',
  'FOOD_QUALITY_STRANGE',
])
/** Type representing FoodQuality. */
export type FoodQuality = z.infer<typeof FoodQualityEnum>
