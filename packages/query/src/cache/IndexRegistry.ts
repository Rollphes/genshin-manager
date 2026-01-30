/**
 * Registry for table index patterns
 * Manages which columns should be indexed for each table
 * @template TTableName - The table name type
 */
export class IndexRegistry<TTableName extends string> {
  private readonly patterns = new Map<TTableName, string[][]>()

  /**
   * Registers index patterns for a table
   * @param tableName - The table to register patterns for
   * @param patterns - Array of column combinations to index
   */
  public register(tableName: TTableName, patterns: string[][]): void {
    this.patterns.set(tableName, patterns)
  }

  /**
   * Gets the index patterns for a table
   * @param tableName - The table to get patterns for
   * @returns The index patterns or undefined if not registered
   */
  public getPatterns(tableName: TTableName): string[][] | undefined {
    return this.patterns.get(tableName)
  }

  /**
   * Checks if a table has registered patterns
   * @param tableName - The table to check
   * @returns True if patterns are registered
   */
  public has(tableName: TTableName): boolean {
    return this.patterns.has(tableName)
  }

  /**
   * Clears all registered patterns
   */
  public clear(): void {
    this.patterns.clear()
  }
}
