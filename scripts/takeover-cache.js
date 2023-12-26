const fs = require('fs-extra')
const path = require('path')

const cacheDir = __dirname.includes('node_modules\\genshin-manager')
  ? path.join(__dirname, '..', '..', 'genshin-manager-cache')
  : path.join(__dirname, '..', 'genshin-manager-cache')
const assetCacheFolderPath = path.resolve(__dirname, '..', 'cache')

if (fs.existsSync(cacheDir)) {
  //path.join(cacheDir, 'cache', 'Images')の中身をpath.join(assetCacheFolderPath, 'Images')の中に移動(既存のファイルは上書きしない)
  fs.readdirSync(path.join(cacheDir, 'cache', 'Images')).forEach((file) => {
    fs.copyFileSync(
      path.join(cacheDir, 'cache', 'Images', file),
      path.join(assetCacheFolderPath, 'Images', file),
    )
  })

  fs.rmSync(cacheDir, { recursive: true })
}
