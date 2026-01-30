import type { FightProp } from '@/types/enums'

/**
 * Constructor data for StatProperty
 */
export interface StatPropertyData {
  /** Fight prop type */
  readonly type: FightProp
  /** Localized stat name */
  readonly name: string
  /** Stat value */
  readonly value: number
}

/**
 * Represents a statistical property with type, name, and value information.
 * Pure DTO — no static dependencies, all data is injected via constructor.
 */
export class StatProperty {
  private static readonly percentPattern =
    /PERCENT|CRITICAL|EFFICIENCY|HEAL|HURT|RATIO/

  /** Stat type */
  public readonly type: FightProp
  /** Localized stat name */
  public readonly name: string
  /** Whether the stat is a percent value */
  public readonly isPercent: boolean
  /** Stat value (cleaned IEEE 754) */
  public readonly value: number

  /**
   * Create a StatProperty
   * @param data - Pre-resolved stat property data
   */
  constructor(data: StatPropertyData) {
    this.type = data.type
    this.name = data.name
    this.isPercent = StatProperty.percentPattern.test(data.type)
    this.value = StatProperty.cleanUp(data.value)
  }

  /**
   * Formatted value text (e.g. "15,552" or "46.6%")
   */
  public get valueText(): string {
    const fix = this.isPercent ? 1 : 0
    const formatted = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: fix,
      maximumFractionDigits: fix,
    }).format(this.multipliedValue === 0 ? 0 : this.multipliedValue)
    return `${formatted}${this.isPercent ? '%' : ''}`
  }

  /**
   * Display-ready multiplied value (×100 for percent stats)
   */
  public get multipliedValue(): number {
    return StatProperty.cleanUp(this.value * (this.isPercent ? 100 : 1))
  }

  /**
   * IEEE 754 rounding method
   * @param v - Value to clean
   * @returns Rounded value
   */
  private static cleanUp(v: number): number {
    return Math.round(v * 100000) / 100000 + 0
  }
}
