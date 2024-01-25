const fs = require('fs')
const { Client } = require('../dist/client/Client.js')
const { CharacterInfo } = require('../dist/models/character/CharacterInfo.js')
const {
  CharacterCostume,
} = require('../dist/models/character/CharacterCostume.js')
const { CharacterSkill } = require('../dist/models/character/CharacterSkill.js')
const {
  CharacterConstellation,
} = require('../dist/models/character/CharacterConstellation.js')
const { Artifact } = require('../dist/models/Artifact.js')
const { Material } = require('../dist/models/Material.js')
const { Weapon } = require('../dist/models/weapon/Weapon.js')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function main() {
  const client = new Client({
    downloadLanguages: [
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
    ],
    defaultLanguage: 'EN',
    fetchOptions: {
      timeout: 0,
    },
  })
  await client.deploy()
  rl.question('What is the version of the game?:', async (answer) => {
    for (const lang of client.option.downloadLanguages) {
      await client.changeLanguage(lang)
      const filePath = `./handbooks/handbook_${lang}.md`
      console.log(
        `HandBook is being created... (Language: ${lang})`,
      )
      //write version
      fs.writeFileSync(filePath, `# GameVersion ${answer}\n`, {
        encoding: 'utf-8',
      })

      //write characterId
      fs.appendFileSync(filePath, `## CharacterId\n`)
      CharacterInfo.getAllCharacterIds().forEach((id) => {
        const characterInfo = new CharacterInfo(id)
        fs.appendFileSync(
          filePath,
          `ID:${id} Name:${characterInfo.name}<br>\n`,
        )
      })

      //write costumeId
      fs.appendFileSync(filePath, `## CostumeId\n`)
      CharacterCostume.getAllCostumeIds().forEach((id) => {
        const costume = new CharacterCostume(id)
        fs.appendFileSync(
          filePath,
          `ID:${id} Name:${costume.name}<br>\n`,
        )
      })

      //write skillId
      fs.appendFileSync(filePath, `## SkillId\n`)
      CharacterSkill.getAllSkillIds().forEach((id) => {
        const skill = new CharacterSkill(id)
        fs.appendFileSync(filePath, `ID:${id} Name:${skill.name}<br>\n`)
      })

      //write constellationId
      fs.appendFileSync(filePath, `## ConstellationId\n`)
      CharacterConstellation.getAllConstellationIds().forEach((id) => {
        const constellation = new CharacterConstellation(id)
        fs.appendFileSync(
          filePath,
          `ID:${id} Name:${constellation.name}<br>\n`,
        )
      })

      //write artifactId
      fs.appendFileSync(filePath, `## ArtifactId\n`)
      Artifact.getAllArtifactIds().forEach((id) => {
        const artifact = new Artifact(id, 10001)
        fs.appendFileSync(
          filePath,
          `ID:${id} Name:${artifact.name}<br>\n`,
        )
      })

      //write weaponId
      fs.appendFileSync(filePath, `## WeaponId\n`)
      Weapon.getAllWeaponIds().forEach((id) => {
        const weapon = new Weapon(id)
        fs.appendFileSync(filePath, `ID:${id} Name:${weapon.name}<br>\n`)
      })

      //write materialId
      fs.appendFileSync(filePath, `## MaterialId\n`)
      Material.getAllMaterialIds().forEach((id) => {
        const material = new Material(id)
        fs.appendFileSync(
          filePath,
          `ID:${id} Name:${material.name}<br>\n`,
        )
      })

      console.log(`HandBook is created! (Language: ${lang})`)
    }
    rl.close()
    process.exit(0)
  })
}
void main()
