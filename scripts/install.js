const { Client } = require('../dist/client/Client.js')
async function main() {
  const client = new Client({ defaultLanguage: 'JP', autoFetchLatestExcelBinOutput:false })
  await client.deploy()
}
void main()
