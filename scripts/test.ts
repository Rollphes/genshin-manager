import { Client } from '../dist/client/Client.js'
import { CharacterInfo } from '../dist/models/character/CharacterInfo.js'
import { CharacterCostume } from '../dist/models/character/CharacterCostume.js'
import { CharacterProfile } from '../dist/models/character/CharacterProfile.js'
import { CharacterSkill } from '../dist/models/character/CharacterSkill.js'
import { CharacterInherentSkill } from '../dist/models/character/CharacterInherentSkill.js'
import { CharacterConstellation } from '../dist/models/character/CharacterConstellation.js'
import { CharacterStory } from '../dist/models/character/CharacterStory.js'
import { CharacterVoice } from '../dist/models/character/CharacterVoice.js'
import { Artifact } from '../dist/models/Artifact.js'
import { Material } from '../dist/models/Material.js'
import { Weapon } from '../dist/models/weapon/Weapon.js'
import { Monster } from '../dist/models/Monster.js'
import { ProfilePicture } from '../dist/models/ProfilePicture.js'
import { DailyFarming } from '../dist/models/DailyFarming.js'
import { EnkaManager } from '../dist/client/EnkaManager.js'

const testType = process.env.npm_config_test_type

async function main() {
  const client = new Client({
    downloadLanguages: ['EN'],
    defaultLanguage: 'EN',
  })
  await client.deploy()
  console.log(`testType:${testType}`)
  switch (testType) {
    case 'AllId':
      console.log('Running test of class has AllId method...')
      CharacterInfo.allCharacterIds.forEach((id) => new CharacterInfo(id))
      CharacterCostume.allCostumeIds.forEach(
        (id) => new CharacterCostume(id),
      )
      CharacterProfile.allCharacterIds.forEach(
        (id) => new CharacterProfile(id),
      )
      CharacterSkill.allSkillIds.forEach((id) => new CharacterSkill(id))
      CharacterInherentSkill.allInherentSkillIds.forEach(
        (id) => new CharacterInherentSkill(id),
      )
      CharacterConstellation.allConstellationIds.forEach(
        (id) => new CharacterConstellation(id),
      )
      CharacterStory.allFetterIds.forEach((id) => new CharacterStory(id))
      CharacterVoice.allFetterIds.forEach((id) => new CharacterVoice(id, 'EN'))
      Artifact.allArtifactIds.forEach((id) => new Artifact(id, 10001))
      Material.allMaterialIds.forEach((id) => new Material(id))
      Weapon.allWeaponIds.forEach((id) => new Weapon(id))
      Monster.allMonsterIds.forEach((id) => new Monster(id))
      ProfilePicture.allProfilePictureIds.forEach(
        (id) => new ProfilePicture(id),
      )
      for (let i = 0; i < 7; i++) {
        new DailyFarming(i)
      }
      console.log('AllId test passed!')
      break
    case 'EnkaNetwork':
      console.log('Running test of EnkaNetwork...')
      await new EnkaManager().fetchAll(800802278)
      console.log('EnkaNetwork test passed!')
      break
    case 'findMonsterIdByDescribeId':
      console.log('Running test of findMonsterIdByDescribeId...')
      console.log('step 1:MonsterDescribeExcelConfigData keys test...')
      const describeIds = Object.keys(
        Client._getCachedExcelBinOutputByName('MonsterDescribeExcelConfigData'),
      )
      describeIds.map((id) => {
        const monsterId = Monster.findMonsterIdByDescribeId(Number(id))
        new Monster(monsterId)
      })
      console.log('findMonsterIdByDescribeId test passed!')
      break
    case 'Image':
      console.log('Running test of Image...')
      const artifactIds = await Artifact.allArtifactIds
      for (const id of artifactIds) {
        const artifact = new Artifact(id, 10001)
        await artifact.icon.fetchBuffer().catch((e) => console.log(e))
      }

      const materialIds = await Material.allMaterialIds
      for (const id of materialIds) {
        const material = new Material(id)
        await material.icon.fetchBuffer().catch((e) => console.log(e))
        for (const img of material.pictures) {
          await img.fetchBuffer().catch((e) => console.log(e))
        }
      }

      const monsterIds = await Monster.allMonsterIds
      for (const id of monsterIds) {
        const monster = new Monster(id)
        if (monster.icon === undefined) continue
        await monster.icon.fetchBuffer().catch((e) => console.log(e))
      }

      const profilePictureIds = await ProfilePicture.allProfilePictureIds
      for (const id of profilePictureIds) {
        const profilePicture = new ProfilePicture(id)
        await profilePicture.icon.fetchBuffer().catch((e) => console.log(e))
      }

      const constellationIds =
        await CharacterConstellation.allConstellationIds
      for (const id of constellationIds) {
        const constellation = new CharacterConstellation(id)
        await constellation.icon.fetchBuffer().catch((e) => console.log(e))
      }

      const costumeIds = await CharacterCostume.allCostumeIds
      for (const id of costumeIds) {
        const costume = new CharacterCostume(id)
        await costume.sideIcon.fetchBuffer().catch((e) => console.log(e))
        await costume.icon.fetchBuffer().catch((e) => console.log(e))
        await costume.art.fetchBuffer().catch((e) => console.log(e))
        await costume.card.fetchBuffer().catch((e) => console.log(e))
      }

      const inherentSkillIds =
        await CharacterInherentSkill.allInherentSkillIds
      for (const id of inherentSkillIds) {
        const inherentSkill = new CharacterInherentSkill(id)
        await inherentSkill.icon.fetchBuffer().catch((e) => console.log(e))
      }

      const skillIds = await CharacterSkill.allSkillIds
      for (const id of skillIds) {
        const skill = new CharacterSkill(id)
        await skill.icon.fetchBuffer().catch((e) => console.log(e))
      }

      const weaponIds = await Weapon.allWeaponIds
      for (const id of weaponIds) {
        const weapon = new Weapon(id)
        await weapon.icon.fetchBuffer().catch((e) => console.log(e))
      }

      console.log('Image test passed!')
      break
    case 'Audio':
      console.log('Running test of Audio...')
      const voiceIds = await CharacterVoice.allFetterIds
      await Promise.all(
        ['JP', 'EN', 'CHS', 'KR'].map(async (cv) => {
          for (const id of voiceIds) {
            const voice = new CharacterVoice(id, cv as 'EN' | 'KR' | 'JP' | 'CHS')
            await voice.audio.fetchBuffer().catch((e) => console.log(e))
          }
        }),
      )
      console.log('Audio test passed!')
      break
  }
  process.exit(0)
}
void main()
