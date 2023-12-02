import { Client } from '@/client/Client'
import { Artifact } from '@/models/Artifact'

/**
 * Class of set bonuses that can be activated by artifacts
 */
export class SetBonus {
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
  /**
   * IDs of set bonuses that can be activated with one artifact.
   */
  private readonly oneSetBonusIds: number[] = [
    15009, 15010, 15011, 15012, 15013,
  ]

  /**
   * Create a SetBonus
   * @param artifacts Artifacts equipped by the character.
   */
  constructor(artifacts: Artifact[]) {
    const countIds: { [setId: string]: number } = {}
    const activeSetIds: string[] = []
    const setBracers: { [setId: string]: Artifact } = {}

    artifacts.forEach((artifact) => {
      const setId = artifact.setId
      if (setId !== undefined) {
        countIds[setId] = (countIds[setId] || 0) + 1
        const setJson = Client._getJsonFromCachedExcelBinOutput(
          'ReliquarySetExcelConfigData',
          setId,
        )
        setBracers[setId] = new Artifact(
          (setJson.containsList as number[])[0],
          10001,
        )
      }
    })

    Object.keys(countIds).forEach((setId) => {
      const count = countIds[setId]
      if (this.oneSetBonusIds.includes(+setId)) countIds[setId] = 1
      else if (count >= 4) countIds[setId] = 4
      else if (count >= 2) countIds[setId] = 2
      else delete countIds[setId]

      activeSetIds.push(setId)
    })

    this.oneSetBonus = activeSetIds
      .filter((setId) => countIds[setId] === 1)
      .map((setId) => setBracers[setId])

    this.twoSetBonus = activeSetIds
      .filter((setId) => countIds[setId] === 2)
      .map((setId) => setBracers[setId])

    this.fourSetBonus = activeSetIds
      .filter((setId) => countIds[setId] === 4)
      .map((setId) => setBracers[setId])
  }
}
