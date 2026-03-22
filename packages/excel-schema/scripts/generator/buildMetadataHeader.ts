/**
 * Build metadata header comment for generated files
 * @param commitId - source commit ID
 * @param generatedDate - generation timestamp
 * @returns formatted header comment
 */
export function buildMetadataHeader(
  commitId: string,
  generatedDate: Date,
): string {
  return [
    '/**',
    ' * @generated',
    ` * @source ${commitId}`,
    ` * @date ${generatedDate.toISOString()}`,
    ' */',
  ].join('\n')
}
