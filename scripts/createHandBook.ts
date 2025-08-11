import fs from 'fs'

import { Client, ClientEvents } from '@/client/Client.js'
import { Artifact } from '@/models/Artifact.js'
import { CharacterConstellation } from '@/models/character/CharacterConstellation.js'
import { CharacterCostume } from '@/models/character/CharacterCostume.js'
import { CharacterInfo } from '@/models/character/CharacterInfo.js'
import { CharacterInherentSkill } from '@/models/character/CharacterInherentSkill.js'
import { CharacterSkill } from '@/models/character/CharacterSkill.js'
import { Material } from '@/models/Material.js'
import { Monster } from '@/models/Monster.js'
import { Weapon } from '@/models/weapon/Weapon.js'

async function main(): Promise<void> {
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
  })
  client.on(ClientEvents.END_UPDATE_CACHE, async (version) => {
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
    process.exit(0)
  })
  await client.deploy()
}
void main()
