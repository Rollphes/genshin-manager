import type { WhereCondition } from '@genshin-manager/query'

/**
 * Evaluate WHERE conditions against a record
 * Extracted as shared utility to avoid logic duplication across query builders
 */
export class WhereConditionEvaluator<TRecord extends Record<string, unknown>> {
  /**
   * Evaluates all WHERE conditions against a record
   * @param record - The record to evaluate
   * @param conditions - Array of WHERE conditions
   * @returns true if all conditions match
   */
  public evaluateAll(
    record: TRecord,
    conditions: readonly WhereCondition[],
  ): boolean {
    for (const condition of conditions)
      if (!this.evaluateCondition(record, condition)) return false

    return true
  }

  /**
   * Evaluates a single WHERE condition against a record
   * @param record - The record to evaluate
   * @param condition - The condition to evaluate
   * @returns true if condition matches
   */
  private evaluateCondition(
    record: TRecord,
    condition: WhereCondition,
  ): boolean {
    switch (condition.type) {
      case 'comparison': {
        const key = condition.key as keyof TRecord
        const recordValue = record[key]
        return this.evaluateComparison(
          recordValue,
          condition.operator,
          condition.value,
        )
      }

      case 'or':
        return condition.conditions.some((c) =>
          this.evaluateCondition(record, c),
        )

      case 'and':
        return condition.conditions.every((c) =>
          this.evaluateCondition(record, c),
        )

      case 'not':
        return !this.evaluateCondition(record, condition.condition)
    }
  }

  /**
   * Evaluates a comparison operation
   * @param recordValue - The record field value
   * @param operator - The comparison operator
   * @param conditionValue - The condition value(s)
   * @returns true if comparison matches
   */
  private evaluateComparison(
    recordValue: unknown,
    operator: string,
    conditionValue: string | number | readonly (string | number)[],
  ): boolean {
    switch (operator) {
      case '=':
        return recordValue === conditionValue
      case '!=':
        return recordValue !== conditionValue
      case '>':
        return this.compareGreaterThan(recordValue, conditionValue)
      case '<':
        return this.compareLessThan(recordValue, conditionValue)
      case '>=':
        return this.compareGreaterOrEqual(recordValue, conditionValue)
      case '<=':
        return this.compareLessOrEqual(recordValue, conditionValue)
      case 'in':
        return this.evaluateIn(recordValue, conditionValue)
      case 'like':
        return this.evaluateLike(recordValue, conditionValue)
      default:
        return false
    }
  }

  /**
   * Compares two ordered values for greater-than
   * @param recordValue - The record field value
   * @param conditionValue - The condition value
   * @returns true if recordValue > conditionValue
   */
  private compareGreaterThan(
    recordValue: unknown,
    conditionValue: string | number | readonly (string | number)[],
  ): boolean {
    if (typeof recordValue === 'number' && typeof conditionValue === 'number')
      return recordValue > conditionValue
    if (typeof recordValue === 'string' && typeof conditionValue === 'string')
      return recordValue > conditionValue
    return false
  }

  /**
   * Compares two ordered values for less-than
   * @param recordValue - The record field value
   * @param conditionValue - The condition value
   * @returns true if recordValue < conditionValue
   */
  private compareLessThan(
    recordValue: unknown,
    conditionValue: string | number | readonly (string | number)[],
  ): boolean {
    if (typeof recordValue === 'number' && typeof conditionValue === 'number')
      return recordValue < conditionValue
    if (typeof recordValue === 'string' && typeof conditionValue === 'string')
      return recordValue < conditionValue
    return false
  }

  /**
   * Compares two ordered values for greater-than-or-equal
   * @param recordValue - The record field value
   * @param conditionValue - The condition value
   * @returns true if recordValue >= conditionValue
   */
  private compareGreaterOrEqual(
    recordValue: unknown,
    conditionValue: string | number | readonly (string | number)[],
  ): boolean {
    if (typeof recordValue === 'number' && typeof conditionValue === 'number')
      return recordValue >= conditionValue
    if (typeof recordValue === 'string' && typeof conditionValue === 'string')
      return recordValue >= conditionValue
    return false
  }

  /**
   * Compares two ordered values for less-than-or-equal
   * @param recordValue - The record field value
   * @param conditionValue - The condition value
   * @returns true if recordValue <= conditionValue
   */
  private compareLessOrEqual(
    recordValue: unknown,
    conditionValue: string | number | readonly (string | number)[],
  ): boolean {
    if (typeof recordValue === 'number' && typeof conditionValue === 'number')
      return recordValue <= conditionValue
    if (typeof recordValue === 'string' && typeof conditionValue === 'string')
      return recordValue <= conditionValue
    return false
  }

  /**
   * Evaluates IN condition
   * @param recordValue - The record field value
   * @param conditionValue - The condition values array
   * @returns true if value is in array
   */
  private evaluateIn(
    recordValue: unknown,
    conditionValue: string | number | readonly (string | number)[],
  ): boolean {
    if (!Array.isArray(conditionValue)) return false
    return conditionValue.includes(recordValue as string | number)
  }

  /**
   * Evaluates LIKE condition with SQL wildcards
   * @param recordValue - The record field value
   * @param conditionValue - The LIKE pattern
   * @returns true if pattern matches
   */
  private evaluateLike(
    recordValue: unknown,
    conditionValue: string | number | readonly (string | number)[],
  ): boolean {
    if (typeof recordValue !== 'string' || typeof conditionValue !== 'string')
      return false

    // Escape regex special characters first, then convert SQL LIKE wildcards
    // This prevents ReDoS attacks and unintended regex matching
    const escaped = conditionValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = escaped.replace(/%/g, '.*').replace(/_/g, '.')
    return new RegExp(`^${pattern}$`, 'i').test(recordValue)
  }
}
