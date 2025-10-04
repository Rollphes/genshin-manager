import path from 'path'

/**
 * Get the package folder path
 */
const PACKAGE_FOLDER_PATH_INTERNAL = __dirname
  .replace(/\\/g, '/')
  .includes('/node_modules/genshin-manager')
  ? path.resolve(__dirname, '..')
  : path.resolve(__dirname, '..', '..', '..')

/**
 * Get the handbook folder path
 */
export const handbookFolderPath = path.join(
  PACKAGE_FOLDER_PATH_INTERNAL,
  'handbooks',
)

/**
 * Get the init image folder path
 */
export const initImageFolderPath = path.join(
  PACKAGE_FOLDER_PATH_INTERNAL,
  'initImages',
)

/**
 * Get the master file folder path
 */
export const masterFileFolderPath = path.join(
  PACKAGE_FOLDER_PATH_INTERNAL,
  'masterFiles',
)

/**
 * Get the ExcelBinOutput folder path
 */
export const excelBinOutputFolderPathForDevelop = path.join(
  PACKAGE_FOLDER_PATH_INTERNAL,
  'cache',
  'ExcelBinOutput',
)

/**
 * Get the generated types folder path
 */
export const generatedTypesFolderPath = path.join(
  PACKAGE_FOLDER_PATH_INTERNAL,
  'src',
  'types',
  'generated',
)

/**
 * Package folder path (exported for compatibility)
 */
export const packageFolderPath = PACKAGE_FOLDER_PATH_INTERNAL
