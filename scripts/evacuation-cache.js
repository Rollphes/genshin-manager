const fs = require('fs-extra')
const path = require('path')

const cacheDir = __dirname.includes('node_modules\\genshin-manager')
  ? path.join(__dirname, '..', '..', 'genshin-manager-cache')
  : path.join(__dirname, '..', 'genshin-manager-cache')
const assetCacheFolderPath = path.resolve(__dirname, '..', 'cache')

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir)
  fs.moveSync(
    path.join(assetCacheFolderPath, 'Images'),
    path.join(cacheDir, 'cache', 'Images'),
  )
}
