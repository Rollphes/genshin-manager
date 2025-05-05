const fs = require('fs')
const { Client, ClientEvents } = require('../dist/client/Client.js')
const { CharacterInfo } = require('../dist/models/character/CharacterInfo.js')
const {
  CharacterCostume,
} = require('../dist/models/character/CharacterCostume.js')
const { CharacterSkill } = require('../dist/models/character/CharacterSkill.js')
const {
  CharacterInherentSkill,
} = require('../dist/models/character/CharacterInherentSkill.js')
const {
  CharacterConstellation,
} = require('../dist/models/character/CharacterConstellation.js')
const { Artifact } = require('../dist/models/Artifact.js')
const { Material } = require('../dist/models/Material.js')
const { Weapon } = require('../dist/models/weapon/Weapon.js')
const readline = require('readline')
const { Monster } = require('../dist/models/Monster.js')

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
  client.on(ClientEvents.END_UPDATE_CACHE, async(version)=>{
    for (const lang of client.option.downloadLanguages) {
      await client.changeLanguage(lang)
      const filePath = `./handbooks/handbook_${lang}.md`
      console.log(`HandBook is being created... (Language: ${lang})`)
      //write version
      fs.writeFileSync(filePath, `# GameVersion ${version}\n`, {
        encoding: 'utf-8',
      })

      //write characterId
      fs.appendFileSync(filePath, `## CharacterId\n`)
      CharacterInfo.allCharacterIds.forEach((id) => {
        const characterInfo = new CharacterInfo(id)
        fs.appendFileSync(filePath, `ID:${id} Name:${characterInfo.name}<br>\n`)
      })

      //write costumeId
      fs.appendFileSync(filePath, `## CostumeId\n`)
      CharacterCostume.allCostumeIds.forEach((id) => {
        const costume = new CharacterCostume(id)
        fs.appendFileSync(filePath, `ID:${id} Name:${costume.name}<br>\n`)
      })

      //write skillId
      fs.appendFileSync(filePath, `## SkillId\n`)
      CharacterSkill.allSkillIds.forEach((id) => {
        const skill = new CharacterSkill(id)
        fs.appendFileSync(filePath, `ID:${id} Name:${skill.name}<br>\n`)
      })

      //write inherentSkillId
      fs.appendFileSync(filePath, `## InherentSkillId\n`)
      CharacterInherentSkill.allInherentSkillIds.forEach((id) => {
        const inherentSkill = new CharacterInherentSkill(id)
        fs.appendFileSync(filePath, `ID:${id} Name:${inherentSkill.name}<br>\n`)
      })

      //write constellationId
      fs.appendFileSync(filePath, `## ConstellationId\n`)
      CharacterConstellation.allConstellationIds.forEach((id) => {
        const constellation = new CharacterConstellation(id)
        fs.appendFileSync(filePath, `ID:${id} Name:${constellation.name}<br>\n`)
      })

      //write artifactId
      fs.appendFileSync(filePath, `## ArtifactId\n`)
      Artifact.allArtifactIds.forEach((id) => {
        const artifact = new Artifact(id, 10001)
        fs.appendFileSync(filePath, `ID:${id} Name:${artifact.name}<br>\n`)
      })

      //write weaponId
      fs.appendFileSync(filePath, `## WeaponId\n`)
      Weapon.allWeaponIds.forEach((id) => {
        const weapon = new Weapon(id)
        fs.appendFileSync(filePath, `ID:${id} Name:${weapon.name}<br>\n`)
      })

      //write materialId
      fs.appendFileSync(filePath, `## MaterialId\n`)
      Material.allMaterialIds.forEach((id) => {
        const material = new Material(id)
        fs.appendFileSync(filePath, `ID:${id} Name:${material.name}<br>\n`)
      })

      //write monsterId
      fs.appendFileSync(filePath, `## MonsterId\n`)
      Monster.allMonsterIds.forEach((id) => {
        const monster = new Monster(id)
        fs.appendFileSync(
          filePath,
          `ID:${id} Name:${monster.name || monster.describeName}<br>\n`,
        )
      })

      console.log(`HandBook is created! (Language: ${lang})`)
    }
    rl.close()
    process.exit(0)
  })
  await client.deploy()
}
void main()
