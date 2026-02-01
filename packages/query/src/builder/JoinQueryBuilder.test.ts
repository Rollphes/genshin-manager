import { GeneralError } from '@genshin-manager/core'
import { describe, expect, it } from 'vitest'

import { JoinQueryBuilder } from '@/builder/JoinQueryBuilder'
import type { IndexKey } from '@/builder/types'
import { QueryLocation } from '@/location/QueryLocation'

interface UserRecord {
  id: number
  name: string
  departmentId: number
}

interface DepartmentRecord {
  id: number
  departmentName: string
  location: string
}

class TestJoinQueryBuilder extends JoinQueryBuilder<
  UserRecord,
  DepartmentRecord
> {
  private baseData: UserRecord[]
  private joinData: DepartmentRecord[]
  private joinDataMap: Map<number, DepartmentRecord>

  constructor(
    baseData: UserRecord[],
    joinData: DepartmentRecord[],
    joinType: 'inner' | 'left' = 'inner',
  ) {
    super('DepartmentTable', 'departmentId', 'id', joinType)
    this.baseData = baseData
    this.joinData = joinData
    this.joinDataMap = new Map(joinData.map((d) => [d.id, d]))
  }

  protected executeBaseQuery(): Promise<UserRecord[]> {
    return Promise.resolve([...this.baseData])
  }

  protected getJoinRecord(
    joinKey: IndexKey,
  ): Promise<DepartmentRecord | undefined> {
    if (typeof joinKey !== 'number') return Promise.resolve(undefined)
    return Promise.resolve(this.joinDataMap.get(joinKey))
  }

  protected createNotFoundError(): Error {
    return new GeneralError('Record not found')
  }

  protected clone<
    NewSelected extends keyof UserRecord | keyof DepartmentRecord,
  >(): JoinQueryBuilder<UserRecord, DepartmentRecord, NewSelected> {
    const cloned = new TestJoinQueryBuilder(
      this.baseData,
      this.joinData,
      this.joinType,
    ) as unknown as JoinQueryBuilder<UserRecord, DepartmentRecord, NewSelected>
    this.copyStateTo(
      cloned as unknown as JoinQueryBuilder<
        UserRecord,
        DepartmentRecord,
        keyof UserRecord | keyof DepartmentRecord
      >,
    )
    return cloned
  }

  protected getBaseLocation(): QueryLocation {
    return QueryLocation.create('Test', 'UserTable')
  }

  protected getJoinLocation(): QueryLocation {
    return QueryLocation.create('Test', 'DepartmentTable')
  }
}

describe('JoinQueryBuilder', () => {
  const users: UserRecord[] = [
    { id: 1, name: 'Alice', departmentId: 10 },
    { id: 2, name: 'Bob', departmentId: 20 },
    { id: 3, name: 'Charlie', departmentId: 10 },
    { id: 4, name: 'Diana', departmentId: 99 }, // Non-existent department
  ]

  const departments: DepartmentRecord[] = [
    { id: 10, departmentName: 'Engineering', location: 'Building A' },
    { id: 20, departmentName: 'Marketing', location: 'Building B' },
    { id: 30, departmentName: 'Sales', location: 'Building C' },
  ]

  describe('INNER JOIN', () => {
    it('should join matching records', async () => {
      const builder = new TestJoinQueryBuilder(users, departments, 'inner')
      const result = await builder.execute()

      // Diana (departmentId: 99) should be excluded
      expect(result).toHaveLength(3)

      const alice = result.find((r) => r.name.value === 'Alice')
      expect(alice).toBeDefined()
      expect(alice?.departmentName.value).toBe('Engineering')
      expect(alice?.location.value).toBe('Building A')
    })

    it('should exclude records with no match', async () => {
      const builder = new TestJoinQueryBuilder(users, departments, 'inner')
      const result = await builder.execute()

      const diana = result.find((r) => r.name.value === 'Diana')
      expect(diana).toBeUndefined()
    })
  })

  describe('LEFT JOIN', () => {
    it('should include all base records', async () => {
      const builder = new TestJoinQueryBuilder(users, departments, 'left')
      const result = await builder.execute()

      expect(result).toHaveLength(4)
    })

    it('should have undefined join properties for non-matching records', async () => {
      const builder = new TestJoinQueryBuilder(users, departments, 'left')
      const result = await builder
        .select(['id', 'name', 'departmentId'], ['departmentName', 'location'])
        .execute()

      const diana = result.find((r) => r.name.value === 'Diana')
      expect(diana).toBeDefined()
      expect(diana?.departmentName.value).toBeUndefined()
      expect(diana?.location.value).toBeUndefined()
    })
  })

  describe('select', () => {
    it('should limit properties from both tables', async () => {
      const builder = new TestJoinQueryBuilder(users, departments, 'inner')
      const result = await builder
        .select(['id', 'name'], ['departmentName'])
        .execute()

      const first = result[0]
      expect(first).toHaveProperty('id')
      expect(first).toHaveProperty('name')
      expect(first).toHaveProperty('departmentName')
      expect(first).not.toHaveProperty('departmentId')
      expect(first).not.toHaveProperty('location')
    })
  })

  describe('execute', () => {
    it('should wrap values in LocatedValue', async () => {
      const builder = new TestJoinQueryBuilder(users, departments, 'inner')
      const result = await builder.execute()

      expect(result[0].name.location.toString()).toBe('Test:UserTable.name')
      expect(result[0].departmentName.location.toString()).toBe(
        'Test:DepartmentTable.departmentName',
      )
    })
  })

  describe('executeTakeFirst', () => {
    it('should return first joined record', async () => {
      const builder = new TestJoinQueryBuilder(users, departments, 'inner')
      const result = await builder.executeTakeFirst()

      expect(result).toBeDefined()
      expect(result?.name.value).toBe('Alice')
    })

    it('should return undefined when no matches', async () => {
      const builder = new TestJoinQueryBuilder(
        [{ id: 1, name: 'Nobody', departmentId: 999 }],
        departments,
        'inner',
      )
      const result = await builder.executeTakeFirst()

      expect(result).toBeUndefined()
    })
  })

  describe('executeTakeFirstOrThrow', () => {
    it('should return first joined record', async () => {
      const builder = new TestJoinQueryBuilder(users, departments, 'inner')
      const result = await builder.executeTakeFirstOrThrow()

      expect(result.name.value).toBe('Alice')
    })

    it('should throw when no matches', async () => {
      const builder = new TestJoinQueryBuilder(
        [{ id: 1, name: 'Nobody', departmentId: 999 }],
        departments,
        'inner',
      )

      await expect(builder.executeTakeFirstOrThrow()).rejects.toThrow(
        GeneralError,
      )
    })
  })

  describe('immutability', () => {
    it('should not modify original builder', async () => {
      const original = new TestJoinQueryBuilder(users, departments, 'inner')
      const withSelect = original.select(['name'], ['departmentName'])

      const originalResult = await original.execute()
      const selectResult = await withSelect.execute()

      // Original should have all properties
      expect(originalResult[0]).toHaveProperty('id')
      expect(originalResult[0]).toHaveProperty('location')

      // Selected should have only selected properties
      expect(selectResult[0]).not.toHaveProperty('id')
      expect(selectResult[0]).not.toHaveProperty('location')
    })
  })
})
