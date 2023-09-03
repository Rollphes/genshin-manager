const { Client } = require('../dist/client/Client.js')
//TODO:テキストマップのダウンロードオプションを増やす(argsで指定できるようにする)
async function main() {
  const client = new Client({ defaultLanguage: 'JP', autoFetchLatestAssets:false })
  await client.deploy()
}
void main()
