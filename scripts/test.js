const { Client } = require('../dist/client/Client.js')
const { CharacterInfo } = require('../dist/models/character/CharacterInfo.js')
const {
  CharacterCostume,
} = require('../dist/models/character/CharacterCostume.js')
const {
  CharacterProfile,
} = require('../dist/models/character/CharacterProfile.js')
const { CharacterSkill } = require('../dist/models/character/CharacterSkill.js')
const {
  CharacterInherentSkill,
} = require('../dist/models/character/CharacterInherentSkill.js')
const {
  CharacterConstellation,
} = require('../dist/models/character/CharacterConstellation.js')
const { CharacterStory } = require('../dist/models/character/CharacterStory.js')
const { CharacterVoice } = require('../dist/models/character/CharacterVoice.js')
const { Artifact } = require('../dist/models/Artifact.js')
const { Material } = require('../dist/models/Material.js')
const { Weapon } = require('../dist/models/weapon/Weapon.js')
const { TowerSchedule } = require('../dist/models/tower/TowerSchedule.js')
const { TowerFloor } = require('../dist/models/tower/TowerFloor.js')
const { TowerLevel } = require('../dist/models/tower/TowerLevel.js')
const { Monster } = require('../dist/models/Monster.js')
const { ProfilePicture } = require('../dist/models/ProfilePicture.js')
const { DailyFarming } = require('../dist/models/DailyFarming.js')

const { EnkaManager } = require('../dist/client/EnkaManager.js')

const testType = process.env.npm_config_test_type

async function main() {
  const client = new Client({
    downloadLanguages: ['EN'],
    defaultLanguage: 'EN',
    fetchOptions: {
      timeout: 0,
    },
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
      CharacterVoice.allFetterIds.forEach((id) => new CharacterVoice(id))
      Artifact.allArtifactIds.forEach((id) => new Artifact(id, 10001))
      Material.allMaterialIds.forEach((id) => new Material(id))
      Weapon.allWeaponIds.forEach((id) => new Weapon(id))
      TowerSchedule.allTowerScheduleIds.forEach(
        (id) => new TowerSchedule(id),
      )
      TowerFloor.allTowerFloorIds.forEach((id) => new TowerFloor(id))
      TowerLevel.allTowerLevelIds.forEach((id) => new TowerLevel(id, 12))
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
      console.log('step 1:Spiral Abyss Schedule test...')
      TowerSchedule.allTowerScheduleIds.map((id) => new TowerSchedule(id))
      console.log('step 2:MonsterDescribeExcelConfigData keys test...')
      const describeIds = Object.keys(
        Client._getCachedExcelBinOutputByName('MonsterDescribeExcelConfigData'),
      )
      describeIds.map((id) => {
        const monsterId = Monster.findMonsterIdByDescribeId(id)
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

      const towerFloorIds = await TowerFloor.allTowerFloorIds
      for (const id of towerFloorIds) {
        const towerFloor = new TowerFloor(id)
        await towerFloor.bgImage.fetchBuffer().catch((e) => console.log(e))
      }

      const towerScheduleIds = await TowerSchedule.allTowerScheduleIds
      for (const id of towerScheduleIds) {
        const towerSchedule = new TowerSchedule(id)
        await towerSchedule.icon.fetchBuffer().catch((e) => console.log(e))
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
            const voice = new CharacterVoice(id, cv)
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
