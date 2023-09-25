const { Client } = require('../dist/client/Client.js')
const fs = require('fs')

const downloadLanguage = process.env.npm_config_download_language
const nocache = process.env.npm_config_nocache

const defaultDownloadTextMapLanguage = [
  'EN',
  'RU',
  'VI',
  'TH',
  'PT',
  'KR',
  'JP',
  'ID',
  'FR',
  'ES',
  'DE',
  'CHT',
  'CHS',
]

function getBool(value) {
  return value?.toLowerCase() === 'true' || value === '1'
}

function getLanguage(value) {
  if (defaultDownloadTextMapLanguage.includes(value)) {
    return [value]
  }
  if (value === 'ALL') {
    return defaultDownloadTextMapLanguage
  }
  return ['EN']
}

async function main() {
  if (!getBool(nocache)) {
    const client = new Client({
      downloadLanguages: getLanguage(downloadLanguage),
      autoFetchLatestAssetsByCron: undefined,
      defaultLanguage: getLanguage(downloadLanguage)[0],
      fetchOptions: {
        timeout: 0,
      },
    })
    if (fs.existsSync(client.option.assetCacheFolderPath))
      fs.rmSync(client.option.assetCacheFolderPath, { recursive: true })
    await client.deploy()
  }
}
void main()
