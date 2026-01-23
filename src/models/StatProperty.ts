import { Client } from '@/client/Client'
import { AssetNotFoundError } from '@/errors/assets/AssetNotFoundError'
import { FightProp } from '@/types/enums'

/**
 * Represents a statistical property with type, name, and value information
 */
export class StatProperty {
  /**
   * Stat type
   */
  public readonly type: FightProp
  /**
   * Stat name
   */
  public readonly name: string
  /**
   * Whether the stat is a percent value
   */
  public readonly isPercent: boolean
  /**
   * Stat value
   */
  public readonly value: number

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

  /**
   * Create a StatProperty
   * @param type - fight prop type
   * @param value - value of the stat
   * @example
   * ```ts
   * const hpStat = new StatProperty('FIGHT_PROP_HP', 15552)
   * console.log(hpStat.name)
   * console.log(hpStat.valueText)
   * ```
   */
  constructor(type: FightProp, value: number) {
    this.type = type

    const manualTextJson = Client._findBy(
      'ManualTextMapConfigData',
      'textMapId',
      this.type,
    )
    if (!manualTextJson) {
      throw new AssetNotFoundError(
        `ManualTextMap ${this.type}`,
        'ManualTextMapConfigData',
      )
    }
    const textMapContentTextMapHash = manualTextJson.textMapContentTextMapHash

    this.name = Client._cachedTextMap.get(textMapContentTextMapHash) ?? ''

    this.isPercent = /PERCENT|CRITICAL|EFFICIENCY|HEAL|HURT|RATIO/.test(
      this.type,
    )

    this.value = this.cleanUp(value)
  }

  /**
   * Get value text
   * @returns value text
   */
  public get valueText(): string {
    const fix = this.isPercent ? 1 : 0
    const formattedValue = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: fix,
      maximumFractionDigits: fix,
    }).format(this.multipliedValue === 0 ? 0 : this.multipliedValue)
    return `${formattedValue}${this.isPercent ? '%' : ''}`
  }

  /**
   * Get multiplied value
   * @returns multiplied value
   */
  public get multipliedValue(): number {
    return this.cleanUp(this.value * (this.isPercent ? 100 : 1))
  }

  /**
   * IEEE 754 rounding method
   * @param v - value
   * @returns rounded value
   */
  private cleanUp(v: number): number {
    return Math.round(v * 100000) / 100000 + 0
  }
}
