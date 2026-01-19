import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { Material } from '@/models/Material'

describe('Material', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'en',
      downloadLanguages: ['en'],
    })
    await client.deploy()
  }, 30000)

  describe('Static Properties', () => {
    it('should return all material IDs', () => {
      const ids = Material.allMaterialIds
      expect(ids).toBeDefined()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids.length).toBeGreaterThan(0)
    })
  })

  describe('Static Methods', () => {
    it('should get material ID by name', () => {
      const ids = Material.getMaterialIdByName("Hero's Wit")
      expect(ids).toBeDefined()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids.length).toBeGreaterThan(0)
    })

    it('should return empty array for non-existent material name', () => {
      const ids = Material.getMaterialIdByName('Non Existent Material')
      expect(ids).toBeDefined()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids.length).toBe(0)
    })
  })

  describe('Constructor', () => {
    it('should create Material', () => {
      const material = new Material(104003)
      expect(material).toBeDefined()
      expect(material.id).toBe(104003)
    })
  })

  describe("Instance Properties (Hero's Wit - 104003)", () => {
    let material: Material

    beforeAll(() => {
      material = new Material(104003)
    })

    it('should have correct id', () => {
      expect(material.id).toBe(104003)
    })

    it('should have correct name', () => {
      expect(material.name).toBe("Hero's Wit")
    })

    it('should have non-empty description', () => {
      expect(material.description).toBeDefined()
      expect(material.description.length).toBeGreaterThan(0)
    })

    it('should have icon as ImageAssets', () => {
      expect(material.icon).toBeInstanceOf(ImageAssets)
    })

    it('should have pictures as array', () => {
      expect(material.pictures).toBeDefined()
      expect(Array.isArray(material.pictures)).toBe(true)
    })

    it('should have correct itemType', () => {
      expect(material.itemType).toBe('ITEM_MATERIAL')
    })

    it('should have correct materialType', () => {
      expect(material.materialType).toBe('MATERIAL_EXP_FRUIT')
    })
  })

  describe('Instance Properties (Virtual material - Character EXP)', () => {
    let material: Material

    beforeAll(() => {
      material = new Material(101)
    })

    it('should have correct id', () => {
      expect(material.id).toBe(101)
    })

    it('should have correct name', () => {
      expect(material.name).toBe('Character EXP')
    })

    it('should have correct itemType for virtual material', () => {
      expect(material.itemType).toBe('ITEM_VIRTUAL')
    })

    it('should have correct materialType', () => {
      expect(material.materialType).toBe('MATERIAL_NONE')
    })
  })
})
