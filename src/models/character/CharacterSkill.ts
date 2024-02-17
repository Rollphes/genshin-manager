import { Client } from '@/client/Client'
import { OutOfRangeError } from '@/errors/OutOfRangeError'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { CharacterInfo } from '@/models/character/CharacterInfo'
import { JsonObject } from '@/utils/JsonParser'

/**
 * Class of character's skill
 */
export class CharacterSkill {
    /**
     * Skill ID
     */
    public readonly id: number
    /**
     * Skill name
     */
    public readonly name: string
    /**
     * Skill description
     */
    public readonly description: string
    /**
     * Skill icon
     */
    public readonly icon: ImageAssets
    /**
     * level + extraLevel
     */
    public readonly level: number
    /**
     * Levels increased by constellation
     */
    public readonly extraLevel: number
    /**
     * Skill param descriptions
     * @returns (`${description}|${param}`)[]
     */
    public readonly paramDescriptions: string[] = []

    /**
     * Create a Skill
     * @param skillId Skill ID
     * @param level Skill level (1-15). Default: 1
     * @param extraLevel Levels increased by constellation (0 or 3). Default: 0
     */
    constructor(skillId: number, level: number = 1, extraLevel: number = 0) {
        this.id = skillId
        const skillJson = Client._getJsonFromCachedExcelBinOutput(
            'AvatarSkillExcelConfigData',
            this.id,
        )
        this.name =
            Client.cachedTextMap.get(String(skillJson.nameTextMapHash)) || ''
        this.description =
            Client.cachedTextMap.get(String(skillJson.descTextMapHash)) || ''
        this.icon = new ImageAssets(skillJson.skillIcon as string)
        this.extraLevel = extraLevel
        this.level = level + this.extraLevel
        if (this.level < 1 || this.level > 15)
            throw new OutOfRangeError('level + extraLevel', this.level, 1, 15)

        if (skillJson.proudSkillGroupId === undefined) return
        const proudSkillGroupId = skillJson.proudSkillGroupId as number
        const proudSkillJson = Client._getJsonFromCachedExcelBinOutput(
            'ProudSkillExcelConfigData',
            proudSkillGroupId,
        )[this.level] as JsonObject
        const params = proudSkillJson.paramList as number[]
        ;(proudSkillJson.paramDescList as number[]).forEach((paramDescHash) => {
            const paramDesc = (
                Client.cachedTextMap.get(String(paramDescHash)) || ''
            ).replace(/|/g, '')
            if (paramDesc === '') return
            this.paramDescriptions.push(
                paramDesc.replace(/\{param.*?\}/g, (paramTag) => {
                    const paramId = paramTag.match(/(?<=param).*?(?=:)/g)?.[0]
                    const replaceTag = paramTag.match(/(?<=:).*?(?=})/g)?.[0]
                    if (paramId === undefined || replaceTag === undefined)
                        return ''
                    const fixedIndex = +(
                        replaceTag.match(/(?<=F)./g)?.[0] ?? '0'
                    )
                    const isInt = replaceTag.includes('I')
                    const isPercent = replaceTag.includes('P')
                    const paramValue = params[+paramId - 1]

                    if (isInt) return `${Math.floor(paramValue)}`
                    if (isPercent)
                        return `${(paramValue * 100).toFixed(fixedIndex)}%`
                    return `${paramValue.toFixed(fixedIndex)}`
                }),
            )
        })
    }

    /**
     * Get all skill IDs
     * @returns All skill IDs
     */
    public static get allSkillIds(): number[] {
        const characterIds = CharacterInfo.allCharacterIds
        return characterIds.flatMap((characterId) => {
            return new CharacterInfo(characterId).skillOrder
        })
    }

    /**
     * Get skill order by character ID
     * @param characterId Character ID
     * @param skillDepotId Skill depot ID
     * @returns Skill order
     */
    public static getSkillOrderByCharacterId(
        characterId: number,
        skillDepotId?: number,
    ): number[] {
        const avatarJson = Client._getJsonFromCachedExcelBinOutput(
            'AvatarExcelConfigData',
            characterId,
        )
        const depotId =
            skillDepotId && [10000005, 10000007].includes(characterId)
                ? skillDepotId
                : (avatarJson.skillDepotId as number)
        const depotJson = Client._getJsonFromCachedExcelBinOutput(
            'AvatarSkillDepotExcelConfigData',
            depotId,
        )
        return [501, 701].includes(depotId)
            ? (depotJson.skills as number[]).slice(0, 1)
            : (depotJson.skills as number[])
                  .slice(0, 2)
                  .concat(depotJson.energySkill as number)
    }
}
