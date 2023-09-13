const { Client } = require('../dist/client/Client.js')
const { CharacterInfo } = require('../dist/models/character/CharacterInfo.js')
const { Costume } = require('../dist/models/character/Costume.js')
const { Profile } = require('../dist/models/character/Profile.js')
const { Skill } = require('../dist/models/character/Skill.js')
const { Talent } = require('../dist/models/character/Talent.js')
const { Artifact } = require('../dist/models/Artifact.js')
const { Material } = require('../dist/models/Material.js')
const { Weapon } = require('../dist/models/Weapon.js')
const { TowerSchedule } = require('../dist/models/tower/TowerSchedule.js')
const { TowerFloor } = require('../dist/models/tower/TowerFloor.js')
const { Monster } = require('../dist/models/Monster.js')

const { EnkaManager } = require('../dist/client/EnkaManager.js')

const testType = process.env.npm_config_test_type

async function main() {
  const client = new Client({
    downloadLanguages: ['EN'],
    autoFetchLatestAssetsByCron: undefined,
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
      Costume.getAllCostumeIds().forEach((id) => new Costume(id))
      Profile.getAllCharacterIds().forEach((id) => new Profile(id))
      Skill.getAllSkillIds().forEach((id) => new Skill(id))
      Talent.getAllTalentIds().forEach((id) => new Talent(id))
      Artifact.getAllArtifactIds().forEach((id) => new Artifact(id, 10001))
      Material.getAllMaterialIds().forEach((id) => new Material(id))
      Weapon.getAllWeaponIds().forEach((id) => new Weapon(id))
      TowerSchedule.getAllTowerScheduleIds().forEach(
        (id) => new TowerSchedule(id),
      )
      Monster.getAllMonsterIds().forEach((id) => new Monster(id))
      TowerFloor.getAllTowerFloorIds().forEach((id) => new TowerFloor(id))
      console.log('AllId test passed!')
      break
    case 'EnkaNetwork':
      console.log('Running test of EnkaNetwork...')
      const enkaData = await new EnkaManager().fetch(800802278)
      console.log('EnkaNetwork test passed!')
      break
  }
}
void main()
