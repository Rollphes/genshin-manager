import { describe, expect, it } from 'vitest'

import { ImageAssets } from '@/assets/ImageAssets'
import { Material } from '@/common/Material'
import { ItemType, MaterialType } from '@/types/enums'

const BASE_URL = 'https://example.com'

describe('Material', () => {
  it('should create with all properties', () => {
    const icon = new ImageAssets({
      name: 'UI_ItemIcon_104001',
      imageBaseURL: BASE_URL,
    })
    const material = new Material({
      id: 104001,
      name: "Hero's Wit",
      description: 'A collection oferta...',
      icon,
      pictures: [],
      itemType: ItemType.ItemMaterial,
      materialType: MaterialType.MaterialExchange,
    })

    expect(material.id).toBe(104001)
    expect(material.name).toBe("Hero's Wit")
    expect(material.description).toContain('collection')
    expect(material.icon.name).toBe('UI_ItemIcon_104001')
    expect(material.pictures).toHaveLength(0)
    expect(material.itemType).toBe(ItemType.ItemMaterial)
    expect(material.materialType).toBe(MaterialType.MaterialExchange)
  })

  it('should handle virtual material', () => {
    const material = new Material({
      id: 102,
      name: 'Character EXP',
      description: 'EXP for characters',
      icon: new ImageAssets({
        name: 'UI_ItemIcon_102',
        imageBaseURL: BASE_URL,
      }),
      pictures: [],
      itemType: ItemType.ItemVirtual,
      materialType: undefined,
    })

    expect(material.itemType).toBe(ItemType.ItemVirtual)
    expect(material.materialType).toBeUndefined()
  })

  it('should handle material with pictures', () => {
    const pic1 = new ImageAssets({
      name: 'UI_ItemIcon_104001_pic1',
      imageBaseURL: BASE_URL,
    })
    const pic2 = new ImageAssets({
      name: 'UI_ItemIcon_104001_pic2',
      imageBaseURL: BASE_URL,
    })
    const material = new Material({
      id: 104001,
      name: "Hero's Wit",
      description: 'Test',
      icon: new ImageAssets({
        name: 'UI_ItemIcon_104001',
        imageBaseURL: BASE_URL,
      }),
      pictures: [pic1, pic2],
      itemType: ItemType.ItemMaterial,
      materialType: MaterialType.MaterialExchange,
    })

    expect(material.pictures).toHaveLength(2)
    expect(material.pictures[0]).toBeInstanceOf(ImageAssets)
  })
})
