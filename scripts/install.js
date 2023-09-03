const { Client } = require('../dist/client/Client.js')

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
  if (
    defaultDownloadTextMapLanguage.includes(value)
  ) {
    return [value]
  }
  return defaultDownloadTextMapLanguage
}

async function main() {
  if (!getBool(nocache)) {
    new Client({
      downloadLanguages: getLanguage(downloadLanguage),
    })
    await Client.updateCache()
  }
}
void main()
