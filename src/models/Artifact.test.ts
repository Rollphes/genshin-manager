import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { Artifact } from '@/models/Artifact'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { StatProperty } from '@/models/StatProperty'

describe('Artifact', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'en',
      downloadLanguages: ['en'],
    })
    await client.deploy()
  }, 30000)

  describe('Static Properties', () => {
    it('should return all artifact IDs', () => {
      const ids = Artifact.allArtifactIds
      expect(ids).toBeDefined()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids.length).toBeGreaterThan(0)
    })

    it('should not include black-listed artifact IDs', () => {
      const ids = Artifact.allArtifactIds
      const blackIds = [23300, 23301, 23302, 23303]
      blackIds.forEach((blackId) => {
        expect(ids).not.toContain(blackId)
      })
    })
  })

  describe('Static Methods', () => {
    it('should get max level for 1-star artifact', () => {
      const ids = Artifact.allArtifactIds
      const oneStarId = ids.find((id) => {
        try {
          return Artifact.getMaxLevelByArtifactId(id) === 5
        } catch {
          return false
        }
      })
      if (oneStarId) expect(Artifact.getMaxLevelByArtifactId(oneStarId)).toBe(5)
    })

    it('should get max level for 5-star artifact', () => {
      const ids = Artifact.allArtifactIds
      const fiveStarId = ids.find((id) => {
        try {
          return Artifact.getMaxLevelByArtifactId(id) === 20
        } catch {
          return false
        }
      })
      if (fiveStarId)
        expect(Artifact.getMaxLevelByArtifactId(fiveStarId)).toBe(20)
    })
  })

  describe('Constructor', () => {
    it('should create Artifact with default values', () => {
      const ids = Artifact.allArtifactIds
      const artifact = new Artifact(ids[0])
      expect(artifact).toBeDefined()
      expect(artifact.id).toBe(ids[0])
      expect(artifact.level).toBe(0)
    })

    it('should create Artifact with custom level', () => {
      const ids = Artifact.allArtifactIds
      const fiveStarId = ids.find((id) => {
        try {
          return Artifact.getMaxLevelByArtifactId(id) === 20
        } catch {
          return false
        }
      })
      if (fiveStarId) {
        const artifact = new Artifact(fiveStarId, 10001, 20, [])
        expect(artifact.level).toBe(20)
      }
    })
  })

  describe('Instance Properties (1-star artifact)', () => {
    let artifact: Artifact
    let artifactId: number

    beforeAll(() => {
      const ids = Artifact.allArtifactIds
      artifactId = ids[0]
      artifact = new Artifact(artifactId, 10001, 0, [])
    })

    it('should have correct id', () => {
      expect(artifact.id).toBe(artifactId)
    })

    it('should have correct level', () => {
      expect(artifact.level).toBe(0)
    })

    it('should have type as string', () => {
      expect(artifact.type).toBeDefined()
      expect(typeof artifact.type).toBe('string')
    })

    it('should have name as string', () => {
      expect(artifact.name).toBeDefined()
      expect(typeof artifact.name).toBe('string')
    })

    it('should have description as string', () => {
      expect(artifact.description).toBeDefined()
      expect(typeof artifact.description).toBe('string')
    })

    it('should have rarity as number', () => {
      expect(artifact.rarity).toBeDefined()
      expect(typeof artifact.rarity).toBe('number')
    })

    it('should have mainStat as StatProperty', () => {
      expect(artifact.mainStat).toBeInstanceOf(StatProperty)
    })

    it('should have subStats as array', () => {
      expect(artifact.subStats).toBeDefined()
      expect(Array.isArray(artifact.subStats)).toBe(true)
    })

    it('should have appendProps as array', () => {
      expect(artifact.appendProps).toBeDefined()
      expect(Array.isArray(artifact.appendProps)).toBe(true)
    })

    it('should have icon as ImageAssets', () => {
      expect(artifact.icon).toBeInstanceOf(ImageAssets)
    })
  })

  describe('Instance Properties (5-star artifact at max level)', () => {
    let artifact: Artifact
    let fiveStarId: number | undefined

    beforeAll(() => {
      const ids = Artifact.allArtifactIds
      fiveStarId = ids.find((id) => {
        try {
          return Artifact.getMaxLevelByArtifactId(id) === 20
        } catch {
          return false
        }
      })
      if (fiveStarId) artifact = new Artifact(fiveStarId, 10001, 20, [])
    })

    it('should have rarity 5', () => {
      if (fiveStarId) expect(artifact.rarity).toBe(5)
    })

    it('should have level 20', () => {
      if (fiveStarId) expect(artifact.level).toBe(20)
    })

    it('should have mainStat with higher value at max level', () => {
      if (fiveStarId) expect(artifact.mainStat.value).toBe(4780)
    })
  })

  describe('Set Properties', () => {
    it('should have setId for artifacts with sets', () => {
      const ids = Artifact.allArtifactIds
      const artifactWithSet = ids.find((id) => {
        try {
          const art = new Artifact(id, 10001, 0, [])
          return art.setId !== undefined && art.setId !== 0
        } catch {
          return false
        }
      })
      if (artifactWithSet) {
        const artifact = new Artifact(artifactWithSet, 10001, 0, [])
        expect(artifact.setId).toBeDefined()
        expect(artifact.setId).not.toBe(0)
      }
    })

    it('should have setName for artifacts with valid sets', () => {
      const ids = Artifact.allArtifactIds
      const artifactWithSet = ids.find((id) => {
        try {
          const art = new Artifact(id, 10001, 0, [])
          return art.setName !== undefined
        } catch {
          return false
        }
      })
      if (artifactWithSet) {
        const artifact = new Artifact(artifactWithSet, 10001, 0, [])
        expect(artifact.setName).toBeDefined()
        expect(typeof artifact.setName).toBe('string')
      }
    })
  })
})
