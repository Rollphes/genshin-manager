/**
 * Mock binary data for testing PNG and OGG file validation
 */

/**
 * Valid PNG file signature and IEND chunk for testing
 */
export const validPngData = Buffer.from([
  // PNG signature (8 bytes)
  137,
  80,
  78,
  71,
  13,
  10,
  26,
  10,
  // IHDR chunk (25 bytes total: 4 length + 4 type + 13 data + 4 CRC)
  0,
  0,
  0,
  13, // Length: 13
  73,
  72,
  68,
  82, // Type: IHDR
  0,
  0,
  0,
  1, // Width: 1
  0,
  0,
  0,
  1, // Height: 1
  8, // Bit depth: 8
  2, // Color type: 2 (RGB)
  0, // Compression: 0
  0, // Filter: 0
  0, // Interlace: 0
  55,
  110,
  58,
  210, // CRC32
  // IEND chunk (12 bytes: 4 length + 4 type + 0 data + 4 CRC)
  0,
  0,
  0,
  0, // Length: 0
  73,
  69,
  78,
  68, // Type: IEND
  174,
  66,
  96,
  130, // CRC32
])

/**
 * Corrupted PNG data missing IEND chunk
 */
export const corruptedPngData = Buffer.from([
  // PNG signature (8 bytes)
  137, 80, 78, 71, 13, 10, 26, 10,
  // IHDR chunk only, missing IEND
  0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 2, 0, 0, 0, 55, 110,
  58, 210,
])

/**
 * Invalid PNG signature
 */
export const invalidPngSignature = Buffer.from([
  // Invalid signature
  0, 0, 0, 0, 0, 0, 0, 0,
  // Rest is valid
  0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 2, 0, 0, 0, 55, 110,
  58, 210, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130,
])

/**
 * Valid OGG file with proper OggS header and end marker
 */
export const validOggData = Buffer.from([
  // OggS header (page header)
  79,
  103,
  103,
  83, // OggS signature
  0, // Version
  4, // Header type (4 = end of stream)
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0, // Granule position
  0,
  0,
  0,
  0, // Bitstream serial number
  0,
  0,
  0,
  0, // Page sequence number
  0,
  0,
  0,
  0, // CRC checksum
  0, // Number of page segments
  // Some dummy audio data

  ...new Array<number>(50).fill(0),
])

/**
 * Corrupted OGG data with wrong header type
 */
export const corruptedOggData = Buffer.from([
  // OggS header with wrong header type
  79,
  103,
  103,
  83, // OggS signature
  0, // Version
  2, // Header type (2 = not end of stream)
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,

  ...new Array<number>(50).fill(0),
])

/**
 * Invalid OGG data without OggS signature
 */
export const invalidOggSignature = Buffer.from([
  // Invalid signature
  0,
  0,
  0,
  0,
  0,
  4,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,

  ...new Array<number>(50).fill(0),
])
