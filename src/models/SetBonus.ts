import { Client } from '@/client'
import { Artifact } from '@/models/Artifact'

/**
 * Manages artifact set effects and bonuses that activate when wearing multiple pieces
 */
export class SetBonus {
  /**
   * IDs of set bonuses that can be activated with one artifact
   */
  private static readonly oneSetBonusIds: number[] = [
    15009, 15010, 15011, 15012, 15013,
  ]
  /**
   * Set bonus that can be triggered by a single artifact
   */
  public readonly oneSetBonus: Artifact[]
  /**
   * Set bonus that can be triggered by two artifacts
   */
  public readonly twoSetBonus: Artifact[]
  /**
   * Set bonus that can be triggered by four artifacts
   */
  public readonly fourSetBonus: Artifact[]

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

  /**
   * Create a SetBonus
   * @param artifacts artifacts equipped by the character
   */
  constructor(artifacts: Artifact[]) {
    const countIds: Record<string, number> = {}
    const activeSetIds: string[] = []
    const setBracers: Record<string, Artifact> = {}

    artifacts.forEach((artifact) => {
      const setId = artifact.setId
      if (setId !== undefined) {
        countIds[setId] = (countIds[setId] || 0) + 1
        const setJson = Client._getJsonFromCachedExcelBinOutput(
          'ReliquarySetExcelConfigData',
          setId,
        )
        setBracers[setId] = new Artifact(setJson.containsList[0], 10001)
      }
    })

    const filteredCountIds: Record<string, number> = {}
    Object.keys(countIds).forEach((setId) => {
      const count = countIds[setId]
      if (SetBonus.oneSetBonusIds.includes(+setId)) {
        filteredCountIds[setId] = 1
        activeSetIds.push(setId)
      } else if (count >= 4) {
        filteredCountIds[setId] = 4
        activeSetIds.push(setId)
      } else if (count >= 2) {
        filteredCountIds[setId] = 2
        activeSetIds.push(setId)
      }
    })

    this.oneSetBonus = activeSetIds
      .filter((setId) => filteredCountIds[setId] === 1)
      .map((setId) => setBracers[setId])

    this.twoSetBonus = activeSetIds
      .filter((setId) => filteredCountIds[setId] === 2)
      .map((setId) => setBracers[setId])

    this.fourSetBonus = activeSetIds
      .filter((setId) => filteredCountIds[setId] === 4)
      .map((setId) => setBracers[setId])
  }
}
