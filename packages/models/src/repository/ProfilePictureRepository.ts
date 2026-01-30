import { ExcelBinPropertyNotFoundError } from '@genshin-manager/core'
import type { ExcelBinCache, TextMapIndex } from '@genshin-manager/data'

import { ImageAssets } from '@/assets/ImageAssets'
import { ProfilePicture } from '@/profile/ProfilePicture'
import { ProfilePictureUnlockType } from '@/types/enums'
import type { RepositoryDependencies } from '@/types/RepositoryDependencies'

/**
 * Repository for building ProfilePicture DTOs from ExcelBin data.
 */
export class ProfilePictureRepository {
  private readonly excelBinCache: ExcelBinCache
  private readonly textMap: TextMapIndex
  private readonly imageBaseURL: string

  /**
   * Create a ProfilePictureRepository
   * @param deps - Repository dependencies
   * @param imageBaseURL - Base URL for image assets
   */
  constructor(deps: RepositoryDependencies, imageBaseURL: string) {
    this.excelBinCache = deps.excelBinCache
    this.textMap = deps.textMap
    this.imageBaseURL = imageBaseURL
  }

  /**
   * Build a ProfilePicture DTO
   * @param profilePictureId - Profile picture ID
   * @returns ProfilePicture DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async getProfilePicture(
    profilePictureId: number,
  ): Promise<ProfilePicture> {
    const result = await this.excelBinCache
      .from('ProfilePictureExcelConfigData')
      .select(['id', 'type', 'unlockParam', 'iconPath'])
      .where('id', profilePictureId)
      .executeTakeFirst()

    if (!result) {
      throw new ExcelBinPropertyNotFoundError(
        'ProfilePictureExcelConfigData',
        profilePictureId,
      )
    }

    const unlockParam = result.unlockParam.value
    const unlockType = result.type.toEnum(ProfilePictureUnlockType)

    let characterId: number | undefined
    let costumeId: number | undefined
    let materialId: number | undefined
    let questId: number | undefined

    switch (unlockType) {
      case ProfilePictureUnlockType.ProfilePictureUnlockByAvatar:
        characterId = unlockParam
        costumeId = await this.getDefaultCostumeId(unlockParam)
        break
      case ProfilePictureUnlockType.ProfilePictureUnlockByCostume:
        costumeId = unlockParam
        characterId = await this.getCostumeCharacterId(unlockParam)
        break
      case ProfilePictureUnlockType.ProfilePictureUnlockByItem:
        materialId = unlockParam
        break
      case ProfilePictureUnlockType.ProfilePictureUnlockByParentQuest:
        questId = unlockParam
        break
    }

    return new ProfilePicture({
      id: profilePictureId,
      type: unlockType,
      characterId,
      costumeId,
      materialId,
      questId,
      icon: new ImageAssets({
        name: result.iconPath.value,
        imageBaseURL: this.imageBaseURL,
      }),
    })
  }

  /**
   * Get all profile picture IDs
   * @returns Array of profile picture IDs
   */
  public async getAllProfilePictureIds(): Promise<number[]> {
    const results = await this.excelBinCache
      .from('ProfilePictureExcelConfigData')
      .select(['id'])
      .execute()

    return results.map((r) => r.id.value)
  }

  /**
   * Find profile picture ID by unlock param
   * @param unlockParam - Costume/Character/Material/Quest ID
   * @returns Profile picture ID or undefined
   */
  public async findProfilePictureIdByUnlockParam(
    unlockParam: number,
  ): Promise<number | undefined> {
    const result = await this.excelBinCache
      .from('ProfilePictureExcelConfigData')
      .select(['id'])
      .where('unlockParam', unlockParam)
      .executeTakeFirst()

    return result?.id.value
  }

  /**
   * Get default costume ID for a character
   * @param characterId - Character ID
   * @returns Default costume ID
   */
  private async getDefaultCostumeId(
    characterId: number,
  ): Promise<number | undefined> {
    const results = await this.excelBinCache
      .from('AvatarCostumeExcelConfigData')
      .select(['skinId', 'characterId', 'quality'])
      .execute()

    const found = results.find(
      (r) => r.characterId.value === characterId && r.quality.value === 0,
    )
    return found?.skinId.value
  }

  /**
   * Get character ID from costume ID
   * @param costumeId - Costume ID
   * @returns Character ID
   */
  private async getCostumeCharacterId(
    costumeId: number,
  ): Promise<number | undefined> {
    const result = await this.excelBinCache
      .from('AvatarCostumeExcelConfigData')
      .select(['characterId'])
      .where('skinId', costumeId)
      .executeTakeFirst()

    return result?.characterId.value
  }
}
