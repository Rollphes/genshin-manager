import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { Artifact } from '@/models/Artifact'
import { SetBonus } from '@/models/SetBonus'

describe('SetBonus', () => {
  let setArtifacts: Record<number, number[]>
  let setIdWith5Pieces: number | undefined

  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()

    // Build set artifact mapping
    const allIds = Artifact.allArtifactIds
    setArtifacts = {}
    for (const id of allIds) {
      try {
        const art = new Artifact(id, 10001, 0, [])
        if (art.setId !== undefined && art.setId !== 0) {
          if (!setArtifacts[art.setId]) setArtifacts[art.setId] = []
          setArtifacts[art.setId].push(id)
        }
      } catch {
        // skip invalid artifacts
      }
    }

    setIdWith5Pieces = Number(
      Object.keys(setArtifacts).find(
        (k) => setArtifacts[Number(k)].length >= 5,
      ),
    )
  }, 30000)

  describe('Constructor', () => {
    it('should create SetBonus with empty artifacts', () => {
      const setBonus = new SetBonus([])
      expect(setBonus).toBeDefined()
    })

    it('should create SetBonus with artifacts', () => {
      if (!setIdWith5Pieces) return
      const pieceIds = setArtifacts[setIdWith5Pieces].slice(0, 2)
      const artifacts = pieceIds.map((id) => new Artifact(id, 10001, 0, []))
      const setBonus = new SetBonus(artifacts)
      expect(setBonus).toBeDefined()
    })
  })

  describe('Empty Artifacts', () => {
    let setBonus: SetBonus

    beforeAll(() => {
      setBonus = new SetBonus([])
    })

    it('should have empty oneSetBonus', () => {
      expect(setBonus.oneSetBonus).toBeDefined()
      expect(Array.isArray(setBonus.oneSetBonus)).toBe(true)
      expect(setBonus.oneSetBonus.length).toBe(0)
    })

    it('should have empty twoSetBonus', () => {
      expect(setBonus.twoSetBonus).toBeDefined()
      expect(Array.isArray(setBonus.twoSetBonus)).toBe(true)
      expect(setBonus.twoSetBonus.length).toBe(0)
    })

    it('should have empty fourSetBonus', () => {
      expect(setBonus.fourSetBonus).toBeDefined()
      expect(Array.isArray(setBonus.fourSetBonus)).toBe(true)
      expect(setBonus.fourSetBonus.length).toBe(0)
    })
  })

  describe('Two-Set Bonus', () => {
    let setBonus: SetBonus

    beforeAll(() => {
      if (!setIdWith5Pieces) return
      const pieceIds = setArtifacts[setIdWith5Pieces].slice(0, 2)
      const artifacts = pieceIds.map((id) => new Artifact(id, 10001, 0, []))
      setBonus = new SetBonus(artifacts)
    })

    it('should have empty oneSetBonus', () => {
      if (!setIdWith5Pieces) return
      expect(setBonus.oneSetBonus.length).toBe(0)
    })

    it('should have one twoSetBonus', () => {
      if (!setIdWith5Pieces) return
      expect(setBonus.twoSetBonus.length).toBe(1)
    })

    it('should have empty fourSetBonus', () => {
      if (!setIdWith5Pieces) return
      expect(setBonus.fourSetBonus.length).toBe(0)
    })

    it('should have twoSetBonus as Artifact instances', () => {
      if (!setIdWith5Pieces) return
      expect(setBonus.twoSetBonus[0]).toBeInstanceOf(Artifact)
    })

    it('should have twoSetBonus with valid setName', () => {
      if (!setIdWith5Pieces) return
      expect(setBonus.twoSetBonus[0].setName).toBeDefined()
      expect(typeof setBonus.twoSetBonus[0].setName).toBe('string')
    })
  })

  describe('Four-Set Bonus', () => {
    let setBonus: SetBonus

    beforeAll(() => {
      if (!setIdWith5Pieces) return
      const pieceIds = setArtifacts[setIdWith5Pieces].slice(0, 4)
      const artifacts = pieceIds.map((id) => new Artifact(id, 10001, 0, []))
      setBonus = new SetBonus(artifacts)
    })

    it('should have empty oneSetBonus', () => {
      if (!setIdWith5Pieces) return
      expect(setBonus.oneSetBonus.length).toBe(0)
    })

    it('should have empty twoSetBonus', () => {
      if (!setIdWith5Pieces) return
      expect(setBonus.twoSetBonus.length).toBe(0)
    })

    it('should have one fourSetBonus', () => {
      if (!setIdWith5Pieces) return
      expect(setBonus.fourSetBonus.length).toBe(1)
    })

    it('should have fourSetBonus as Artifact instances', () => {
      if (!setIdWith5Pieces) return
      expect(setBonus.fourSetBonus[0]).toBeInstanceOf(Artifact)
    })

    it('should have fourSetBonus with valid setName', () => {
      if (!setIdWith5Pieces) return
      expect(setBonus.fourSetBonus[0].setName).toBeDefined()
      expect(typeof setBonus.fourSetBonus[0].setName).toBe('string')
    })
  })

  describe('Mixed Sets', () => {
    it('should handle artifacts from different sets', () => {
      const setIds = Object.keys(setArtifacts).slice(0, 2)
      if (setIds.length < 2) return

      const artifacts = [
        new Artifact(setArtifacts[Number(setIds[0])][0], 10001, 0, []),
        new Artifact(setArtifacts[Number(setIds[1])][0], 10001, 0, []),
      ]
      const setBonus = new SetBonus(artifacts)

      expect(setBonus.oneSetBonus.length).toBe(0)
      expect(setBonus.twoSetBonus.length).toBe(0)
      expect(setBonus.fourSetBonus.length).toBe(0)
    })

    it('should handle 2+2 set combination', () => {
      const setIds = Object.keys(setArtifacts).filter(
        (k) => setArtifacts[Number(k)].length >= 2,
      )
      if (setIds.length < 2) return

      const artifacts = [
        new Artifact(setArtifacts[Number(setIds[0])][0], 10001, 0, []),
        new Artifact(setArtifacts[Number(setIds[0])][1], 10001, 0, []),
        new Artifact(setArtifacts[Number(setIds[1])][0], 10001, 0, []),
        new Artifact(setArtifacts[Number(setIds[1])][1], 10001, 0, []),
      ]
      const setBonus = new SetBonus(artifacts)

      expect(setBonus.twoSetBonus.length).toBe(2)
      expect(setBonus.fourSetBonus.length).toBe(0)
    })
  })
})
