import fs from 'fs'
import path from 'path'

import { Client } from '@/application/client/Client'
import { ClientEvents } from '@/application/types/events/client'
import { Language } from '@/domain/types/types'
import { handbookFolderPath } from '@/infrastructure/paths'
import { Artifact } from '@/interface/Artifact.js'
import { CharacterConstellation } from '@/interface/character/CharacterConstellation.js'
import { CharacterCostume } from '@/interface/character/CharacterCostume.js'
import { CharacterInfo } from '@/interface/character/CharacterInfo.js'
import { CharacterInherentSkill } from '@/interface/character/CharacterInherentSkill.js'
import { CharacterSkill } from '@/interface/character/CharacterSkill.js'
import { Material } from '@/interface/Material.js'
import { Monster } from '@/interface/Monster.js'
import { WeaponInfo } from '@/interface/weapon/WeaponInfo.js'

async function main(): Promise<void> {
  const client = new Client({
    downloadLanguages: [
      Language.En,
      Language.Ru,
      Language.Vi,
      Language.Th,
      Language.Pt,
      Language.Ko,
      Language.Ja,
      Language.Id,
      Language.Fr,
      Language.Es,
      Language.De,
      Language.ZhTw,
      Language.ZhCn,
    ],
    defaultLanguage: Language.En,
  })
  client.on(ClientEvents.EndUpdateCache, async (version) => {
    for (const lang of client.option.downloadLanguages) {
      await client.changeLanguage(lang)
      const filePath = path.join(handbookFolderPath, `handbook_${lang}.md`)
      console.log(`HandBook is being created... (Language: ${lang})`)

      fs.writeFileSync(filePath, `# GameVersion ${version}\n`, {
        encoding: 'utf-8',
      })

      fs.appendFileSync(filePath, `## CharacterId\n`)
      CharacterInfo.allCharacterIds.forEach((id) => {
        const characterInfo = new CharacterInfo(id)
        fs.appendFileSync(
          filePath,
          `ID:${String(id)} Name:${characterInfo.name}<br>\n`,
        )
      })

      fs.appendFileSync(filePath, `## CostumeId\n`)
      CharacterCostume.allCostumeIds.forEach((id) => {
        const costume = new CharacterCostume(id)
        fs.appendFileSync(
          filePath,
          `ID:${String(id)} Name:${costume.name}<br>\n`,
        )
      })

      fs.appendFileSync(filePath, `## SkillId\n`)
      CharacterSkill.allSkillIds.forEach((id) => {
        const skill = new CharacterSkill(id)
        fs.appendFileSync(filePath, `ID:${String(id)} Name:${skill.name}<br>\n`)
      })

      fs.appendFileSync(filePath, `## InherentSkillId\n`)
      CharacterInherentSkill.allInherentSkillIds.forEach((id) => {
        const inherentSkill = new CharacterInherentSkill(id)
        fs.appendFileSync(
          filePath,
          `ID:${String(id)} Name:${inherentSkill.name}<br>\n`,
        )
      })

      fs.appendFileSync(filePath, `## ConstellationId\n`)
      CharacterConstellation.allConstellationIds.forEach((id) => {
        const constellation = new CharacterConstellation(id)
        fs.appendFileSync(
          filePath,
          `ID:${String(id)} Name:${constellation.name}<br>\n`,
        )
      })

      fs.appendFileSync(filePath, `## ArtifactId\n`)
      Artifact.allArtifactIds.forEach((id) => {
        const artifact = new Artifact(id, 10001)
        fs.appendFileSync(
          filePath,
          `ID:${String(id)} Name:${artifact.name}<br>\n`,
        )
      })

      fs.appendFileSync(filePath, `## WeaponId\n`)
      WeaponInfo.allWeaponIds.forEach((id) => {
        const weapon = new WeaponInfo(id)
        fs.appendFileSync(
          filePath,
          `ID:${String(id)} Name:${weapon.name}<br>\n`,
        )
      })

      fs.appendFileSync(filePath, `## MaterialId\n`)
      Material.allMaterialIds.forEach((id) => {
        const material = new Material(id)
        fs.appendFileSync(
          filePath,
          `ID:${String(id)} Name:${material.name}<br>\n`,
        )
      })

      fs.appendFileSync(filePath, `## MonsterId\n`)
      Monster.allMonsterIds.forEach((id) => {
        const monster = new Monster(id)
        fs.appendFileSync(
          filePath,
          `ID:${String(id)} Name:${monster.name || monster.describeName}<br>\n`,
        )
      })

      console.log(`HandBook is created! (Language: ${lang})`)
    }
    process.exit(0)
  })
  await client.deploy()
}
void main()
