const fs = require('fs')
const { Client } = require('../dist/client/Client.js')
const { CharacterInfo } = require('../dist/models/character/CharacterInfo.js')
const { CharacterCostume } = require('../dist/models/character/CharacterCostume.js')
const { CharacterSkill } = require('../dist/models/character/CharacterSkill.js')
const { CharacterConstellation } = require('../dist/models/character/CharacterConstellation.js')
const { Artifact } = require('../dist/models/Artifact.js')
const { Material } = require('../dist/models/Material.js')
const { Weapon } = require('../dist/models/weapon/Weapon.js')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function main() {
  rl.question('language?:', async (answer) => {
    const client = new Client({
      downloadLanguages: [answer],
      defaultLanguage: answer,
      fetchOptions: {
        timeout: 0,
      },
    })
    await client.deploy()
    rl.question('What is the version of the game?:', (answer) => {
      console.log(
        `HandBook is being created... (Language: ${Client.option.defaultLanguage})`,
      )
      //write version
      fs.writeFileSync('./handbook.md', `# GameVersion ${answer}\n`, {
        encoding: 'utf-8',
      })

      //write characterId
      fs.appendFileSync('./handbook.md', `## CharacterId\n`)
      CharacterInfo.getAllCharacterIds().forEach((id) => {
        const characterInfo = new CharacterInfo(id)
        fs.appendFileSync(
          './handbook.md',
          `ID:${id} Name:${characterInfo.name}<br>\n`,
        )
      })

      //write costumeId
      fs.appendFileSync('./handbook.md', `## CostumeId\n`)
      CharacterCostume.getAllCostumeIds().forEach((id) => {
        const costume = new CharacterCostume(id)
        fs.appendFileSync('./handbook.md', `ID:${id} Name:${costume.name}<br>\n`)
      })

      //write skillId
      fs.appendFileSync('./handbook.md', `## SkillId\n`)
      CharacterSkill.getAllSkillIds().forEach((id) => {
        const skill = new CharacterSkill(id)
        fs.appendFileSync('./handbook.md', `ID:${id} Name:${skill.name}<br>\n`)
      })

      //write constellationId
      fs.appendFileSync('./handbook.md', `## ConstellationId\n`)
      CharacterConstellation.getAllConstellationIds().forEach((id) => {
        const constellation = new CharacterConstellation(id)
        fs.appendFileSync('./handbook.md', `ID:${id} Name:${constellation.name}<br>\n`)
      })

      //write artifactId
      fs.appendFileSync('./handbook.md', `## ArtifactId\n`)
      Artifact.getAllArtifactIds().forEach((id) => {
        const artifact = new Artifact(id, 10001)
        fs.appendFileSync('./handbook.md', `ID:${id} Name:${artifact.name}<br>\n`)
      })

      //write weaponId
      fs.appendFileSync('./handbook.md', `## WeaponId\n`)
      Weapon.getAllWeaponIds().forEach((id) => {
        const weapon = new Weapon(id)
        fs.appendFileSync('./handbook.md', `ID:${id} Name:${weapon.name}<br>\n`)
      })

      //write materialId
      fs.appendFileSync('./handbook.md', `## MaterialId\n`)
      Material.getAllMaterialIds().forEach((id) => {
        const material = new Material(id)
        fs.appendFileSync('./handbook.md', `ID:${id} Name:${material.name}<br>\n`)
      })

      console.log('HandBook created!')
      rl.close()
    })
  })
  process.exit(0)
}
void main()
