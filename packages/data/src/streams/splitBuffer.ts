/**
 * Split buffer by separator
 * @param buffer - Buffer to split
 * @param separator - Separator buffer
 * @returns Array of buffers
 */
export function splitBuffer(buffer: Buffer, separator: Buffer): Buffer[] {
  const result: Buffer[] = []
  let start = 0
  let index: number

  while ((index = buffer.indexOf(separator, start)) !== -1) {
    result.push(buffer.subarray(start, index))
    start = index + separator.length
  }

  result.push(buffer.subarray(start))

  return result
}
