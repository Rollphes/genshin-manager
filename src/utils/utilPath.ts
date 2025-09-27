import path from 'path'

/**
 * Get the package folder path
 */
const PACKAGE_FOLDER_PATH = __dirname
  .replace(/\\/g, '/')
  .includes('/node_modules/genshin-manager')
  ? path.resolve(__dirname, '..')
  : path.resolve(__dirname, '..', '..')

/**
 * Get the handbook folder path
 */
export const handbookFolderPath = path.join(PACKAGE_FOLDER_PATH, 'handbooks')

/**
 * Get the init image folder path
 */
export const initImageFolderPath = path.join(PACKAGE_FOLDER_PATH, 'initImages')

/**
 * Get the master file folder path
 */
export const masterFileFolderPath = path.join(
  PACKAGE_FOLDER_PATH,
  'masterFiles',
)
