import { Client } from '@/client/Client'
import { Artifact } from '@/models/Artifact'

/**
 * Class of set bonuses that can be activated by artifacts
 */
export class SetBonus {
  private readonly setBracers: { [setId: string]: Artifact } = {}
  private readonly activeSetIds: string[] = []
  private readonly countIds: { [setId: string]: number } = {}
  /**
   * IDs of set bonuses that can be activated with one artifact.
   */
  private readonly oneSetBonusIds: number[] = [
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

  constructor(artifacts: Artifact[]) {
    artifacts.forEach((artifact) => {
      const setId = artifact.setId
      if (setId !== undefined) {
        this.countIds[setId] = (this.countIds[setId] || 0) + 1
        const setJson = Client.cachedExcelBinOutputGetter(
          'ReliquarySetExcelConfigData',
          setId,
        )
        this.setBracers[setId] = new Artifact(
          (setJson.containsList as number[])[0],
          10001,
        )
      }
    })

    this.activeSetIds.push(...Object.keys(this.countIds))

    for (const setId in this.countIds) {
      const count = this.countIds[setId]
      if (this.oneSetBonusIds.includes(+setId)) {
        this.countIds[setId] = 1
      } else if (count >= 4) {
        this.countIds[setId] = 4
      } else if (count >= 2) {
        this.countIds[setId] = 2
      }
    }

    this.oneSetBonus = this.activeSetIds
      .filter((setId) => this.countIds[setId] === 1)
      .map((setId) => this.setBracers[setId])

    this.twoSetBonus = this.activeSetIds
      .filter((setId) => this.countIds[setId] === 2)
      .map((setId) => this.setBracers[setId])

    this.fourSetBonus = this.activeSetIds
      .filter((setId) => this.countIds[setId] === 4)
      .map((setId) => this.setBracers[setId])
  }
}
