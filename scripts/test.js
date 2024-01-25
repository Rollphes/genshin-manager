const { Client } = require('../dist/client/Client.js')
const { CharacterInfo } = require('../dist/models/character/CharacterInfo.js')
const {
  CharacterCostume,
} = require('../dist/models/character/CharacterCostume.js')
const {
  CharacterProfile,
} = require('../dist/models/character/CharacterProfile.js')
const { CharacterSkill } = require('../dist/models/character/CharacterSkill.js')
const { CharacterInherentSkill } = require('../dist/models/character/CharacterInherentSkill.js')
const {
  CharacterConstellation,
} = require('../dist/models/character/CharacterConstellation.js')
const { Artifact } = require('../dist/models/Artifact.js')
const { Material } = require('../dist/models/Material.js')
const { Weapon } = require('../dist/models/weapon/Weapon.js')
const { TowerSchedule } = require('../dist/models/tower/TowerSchedule.js')
const { TowerFloor } = require('../dist/models/tower/TowerFloor.js')
const { Monster } = require('../dist/models/Monster.js')
const { ProfilePicture } = require('../dist/models/ProfilePicture.js')

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
      CharacterInfo.getAllCharacterIds().forEach((id) => new CharacterInfo(id))
      CharacterCostume.getAllCostumeIds().forEach(
        (id) => new CharacterCostume(id),
      )
      CharacterProfile.getAllCharacterIds().forEach(
        (id) => new CharacterProfile(id),
      )
      CharacterSkill.getAllSkillIds().forEach((id) => new CharacterSkill(id))
      CharacterInherentSkill.getAllInherentSkillIds().forEach(
        (id) => new CharacterInherentSkill(id),
      )
      CharacterConstellation.getAllConstellationIds().forEach(
        (id) => new CharacterConstellation(id),
      )
      Artifact.getAllArtifactIds().forEach((id) => new Artifact(id, 10001))
      Material.getAllMaterialIds().forEach((id) => new Material(id))
      Weapon.getAllWeaponIds().forEach((id) => new Weapon(id))
      TowerSchedule.getAllTowerScheduleIds().forEach(
        (id) => new TowerSchedule(id),
      )
      Monster.getAllMonsterIds().forEach((id) => new Monster(id))
      TowerFloor.getAllTowerFloorIds().forEach((id) => new TowerFloor(id))
      ProfilePicture.getAllProfilePictureIds().forEach(
        (id) => new ProfilePicture(id),
      )
      console.log('AllId test passed!')
      break
    case 'EnkaNetwork':
      console.log('Running test of EnkaNetwork...')
      const enkaData = await new EnkaManager().fetch(800802278)
      console.log('EnkaNetwork test passed!')
      break
    case 'findMonsterIdByDescribeId':
      console.log('Running test of findMonsterIdByDescribeId...')
      console.log('step 1:Spiral Abyss Schedule test...')
      TowerSchedule.getAllTowerScheduleIds().map((id) => new TowerSchedule(id))
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
      console.log('Skip images supported by EnkaNetwork...')
      const materialIds = await Material.getAllMaterialIds()
      for (const id of materialIds) {
        const material = new Material(id)
        try {
          await material.icon.fetchBuffer()
          for (const img of material.pictures) {
            await img.fetchBuffer()
          }
        } catch (e) {
          console.log(e)
        }
      }

      const towerScheduleIds = await TowerSchedule.getAllTowerScheduleIds()
      for (const id of towerScheduleIds) {
        const towerSchedule = new TowerSchedule(id)
        try {
          await towerSchedule.icon.fetchBuffer()
        } catch (e) {
          console.log(e)
        }
      }

      const monsterIds = await Monster.getAllMonsterIds()
      for (const id of monsterIds) {
        const monster = new Monster(id)
        if (monster.icon === undefined) continue
        try {
          await monster.icon.fetchBuffer()
        } catch (e) {
          console.log(e)
        }
      }

      const towerFloorIds = await TowerFloor.getAllTowerFloorIds()
      for (const id of towerFloorIds) {
        const towerFloor = new TowerFloor(id)
        try {
          await towerFloor.bgImage.fetchBuffer()
        } catch (e) {
          console.log(e)
        }
      }

      const profilePictureIds = await ProfilePicture.getAllProfilePictureIds()
      for (const id of profilePictureIds) {
        const profilePicture = new ProfilePicture(id)
        try {
          await profilePicture.icon.fetchBuffer()
        } catch (e) {
          console.log(e)
        }
      }

      console.log('Image test passed!')
      break
  }
  process.exit(0)
}
void main()
