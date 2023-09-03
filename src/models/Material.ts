import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
export type ItemType = 'ITEM_VIRTUAL' | 'ITEM_MATERIAL'
export type MaterialType =
  | 'MATERIAL_ACTIVITY_GEAR'
  | 'MATERIAL_ACTIVITY_JIGSAW'
  | 'MATERIAL_ACTIVITY_ROBOT'
  | 'MATERIAL_ADSORBATE'
  | 'MATERIAL_ARANARA'
  | 'MATERIAL_AVATAR'
  | 'MATERIAL_AVATAR_MATERIAL'
  | 'MATERIAL_BGM'
  | 'MATERIAL_CHANNELLER_SLAB_BUFF'
  | 'MATERIAL_CHEST'
  | 'MATERIAL_CHEST_BATCH_USE'
  | 'MATERIAL_CONSUME'
  | 'MATERIAL_CONSUME_BATCH_USE'
  | 'MATERIAL_COSTUME'
  | 'MATERIAL_CRICKET'
  | 'MATERIAL_DESHRET_MANUAL'
  | 'MATERIAL_ELEM_CRYSTAL'
  | 'MATERIAL_EXCHANGE'
  | 'MATERIAL_EXP_FRUIT'
  | 'MATERIAL_FAKE_ABSORBATE'
  | 'MATERIAL_FIREWORKS'
  | 'MATERIAL_FISH_BAIT'
  | 'MATERIAL_FISH_ROD'
  | 'MATERIAL_FLYCLOAK'
  | 'MATERIAL_FOOD'
  | 'MATERIAL_FURNITURE_FORMULA'
  | 'MATERIAL_FURNITURE_SUITE_FORMULA'
  | 'MATERIAL_GCG_CARD'
  | 'MATERIAL_GCG_CARD_BACK'
  | 'MATERIAL_GCG_CARD_FACE'
  | 'MATERIAL_GCG_EXCHANGE_ITEM'
  | 'MATERIAL_GCG_FIELD'
  | 'MATERIAL_HOME_SEED'
  | 'MATERIAL_NAMECARD'
  | 'MATERIAL_NOTICE_ADD_HP'
  | 'MATERIAL_QUEST'
  | 'MATERIAL_RELIQUARY_MATERIAL'
  | 'MATERIAL_RENAME_ITEM'
  | 'MATERIAL_SEA_LAMP'
  | 'MATERIAL_SELECTABLE_CHEST'
  | 'MATERIAL_SPICE_FOOD'
  | 'MATERIAL_TALENT'
  | 'MATERIAL_WEAPON_EXP_STONE'
  | 'MATERIAL_WIDGET'
  | 'MATERIAL_WOOD'

//TODO: Add more properties
export class Material {
  /**
   * Material id
   */
  public readonly id: number
  /**
   * Material name
   */
  public readonly name: string
  /**
   * Material description
   */
  public readonly description: string
  /**
   * Material icon
   */
  public readonly icon: ImageAssets
  /**
   * Material pictures
   */
  public readonly pictures: ImageAssets[]
  /**
   * Material type
   */
  public readonly itemType: ItemType
  /**
   * Material type
   */
  public readonly materialType?: MaterialType

  constructor(id: number) {
    const materialJson = Client.cachedExcelBinOutputGetter(
      'MaterialExcelConfigData',
      id,
    )

    this.id = id
    this.name =
      Client.cachedTextMap.get(String(materialJson.nameTextMapHash)) || ''
    this.description =
      Client.cachedTextMap.get(String(materialJson.descTextMapHash)) || ''
    this.icon = new ImageAssets(materialJson.icon as string)
    this.pictures = (materialJson.picPath as string[]).map(
      (v) => new ImageAssets(v),
    )
    this.itemType = materialJson.itemType as ItemType
    this.materialType = materialJson.materialType as MaterialType | undefined
  }
}
