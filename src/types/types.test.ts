import { describe, expect, it } from 'vitest'

import {
  BodyType as GeneratedBodyType,
  QualityType as GeneratedQualityType,
  WeaponType as GeneratedWeaponType,
} from '@/types/generated/AvatarExcelConfigData'
import {
  ItemType as GeneratedItemType,
  MaterialType as GeneratedMaterialType,
} from '@/types/generated/MaterialExcelConfigData'
import { EquipType as GeneratedEquipType } from '@/types/generated/ReliquaryExcelConfigData'
import {
  ArtifactType,
  BodyType,
  ItemType,
  MaterialType,
  QualityType,
  WeaponType,
} from '@/types/types'

describe('types.ts enum values should match generated enum values', () => {
  it('BodyType values should match', () => {
    const typesValues = Object.values(BodyType).sort()
    const generatedValues = Object.values(GeneratedBodyType).sort()
    expect(typesValues).toEqual(generatedValues)
  })

  it('QualityType values should match', () => {
    const typesValues = Object.values(QualityType).sort()
    const generatedValues = Object.values(GeneratedQualityType).sort()
    expect(typesValues).toEqual(generatedValues)
  })

  it('WeaponType values should match', () => {
    const typesValues = Object.values(WeaponType).sort()
    const generatedValues = Object.values(GeneratedWeaponType).sort()
    expect(typesValues).toEqual(generatedValues)
  })

  it('ItemType values should match', () => {
    const typesValues = Object.values(ItemType).sort()
    const generatedValues = Object.values(GeneratedItemType).sort()
    expect(typesValues).toEqual(generatedValues)
  })

  it('ArtifactType values should match', () => {
    const typesValues = Object.values(ArtifactType).sort()
    const generatedValues = Object.values(GeneratedEquipType).sort()
    expect(typesValues).toEqual(generatedValues)
  })

  it('MaterialType values should match', () => {
    const typesValues = Object.values(MaterialType).sort()
    const generatedValues = Object.values(GeneratedMaterialType).sort()
    expect(typesValues).toEqual(generatedValues)
  })
})
