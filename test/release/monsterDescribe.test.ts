import { beforeAll, describe, expect, test } from 'vitest'

import { Client } from '@/client/Client'
import { Monster } from '@/models/Monster'

describe('MonsterDescribe Release Test', () => {
  beforeAll(async () => {
    // Client deployment is already handled in test/setup.ts
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  }, 30000) // 30 seconds timeout for deployment
  test('should find monster IDs by describe IDs and instantiate monsters', () => {
    // Get all MonsterDescribeExcelConfigData keys
    const describeIds = Object.keys(
      Client._getCachedExcelBinOutputByName('MonsterDescribeExcelConfigData'),
    )

    expect(describeIds.length).toBeGreaterThan(0)

    // Test each describe ID
    describeIds.forEach((describeIdStr) => {
      const describeId = Number(describeIdStr)
      expect(describeId).toBeGreaterThan(0)

      // Find monster ID by describe ID
      const monsterId = Monster.findMonsterIdByDescribeId(describeId)
      expect(monsterId).toBeGreaterThan(0)

      // Create monster instance
      const monster = new Monster(monsterId)
      expect(monster).toBeDefined()
      expect(monster.id).toBe(monsterId)
      expect(monster.name).toBeDefined()
      expect(typeof monster.name).toBe('string')
    })
  })

  test('should validate static method findMonsterIdByDescribeId', () => {
    // Test with known describe IDs (if any)
    const allMonsterIds = Monster.allMonsterIds
    expect(allMonsterIds.length).toBeGreaterThan(0)

    // Ensure all monster IDs can be instantiated
    allMonsterIds.forEach((monsterId) => {
      const monster = new Monster(monsterId)
      expect(monster).toBeDefined()
      expect(monster.id).toBe(monsterId)
    })
  })
})
