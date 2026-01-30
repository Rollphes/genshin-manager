/**
 * Minimal interface for TextMap cache required by LocatedValue
 * Implementations should provide text lookup by hash
 */
export interface TextMapProvider {
  /**
   * Gets text by hash synchronously
   * @param hash - The TextMap hash
   * @returns The localized text string
   * @throws {@link TextMapHashNotFoundError} - When hash is not found
   */
  getTextSync(hash: number): string
}
