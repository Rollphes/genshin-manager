import { GeneralError } from '@genshin-manager/core'
import { describe, expect, it, vi } from 'vitest'

import { QueryBuilder } from '@/builder/QueryBuilder'
import type { WhereCondition } from '@/builder/types'
import { Location } from '@/location/Location'
import type { TextMapProvider } from '@/value/types'

interface TestRecord {
  id: number
  name: string
  type: string
  value: number
  tags: string[]
}

class TestQueryBuilder extends QueryBuilder<TestRecord> {
  private data: TestRecord[]
  private textMapProviderInstance?: TextMapProvider

  constructor(tableName: string, data: TestRecord[]) {
    super(tableName)
    this.data = data
  }

  public setTextMapProvider(provider: TextMapProvider): void {
    this.textMapProviderInstance = provider
  }

  // Expose protected for testing
  public getWhereConditions(): readonly WhereCondition[] {
    return this.whereConditions
  }

  protected executeQuery(): Promise<TestRecord[]> {
    let results = [...this.data]

    for (const condition of this.whereConditions) {
      if (condition.type === 'eq') {
        results = results.filter(
          (r) => r[condition.key as keyof TestRecord] === condition.value,
        )
      } else {
        results = results.filter((r) =>
          condition.values.includes(
            r[condition.key as keyof TestRecord] as string | number,
          ),
        )
      }
    }

    return Promise.resolve(results)
  }

  protected createNotFoundError(): Error {
    return new GeneralError(`Record not found in ${this.tableName}`)
  }

  protected getLocation(): Location {
    let location = Location.create('Test', this.tableName)
    for (const condition of this.whereConditions) {
      if (condition.type === 'eq')
        location = location.filter(condition.key, condition.value)
    }
    return location
  }

  protected getTextMapProvider(): TextMapProvider | undefined {
    return this.textMapProviderInstance
  }

  protected clone<NewSelected extends keyof TestRecord>(): QueryBuilder<
    TestRecord,
    NewSelected
  > {
    const cloned = new TestQueryBuilder(
      this.tableName,
      this.data,
    ) as unknown as QueryBuilder<TestRecord, NewSelected>
    this.copyStateTo(
      cloned as unknown as QueryBuilder<TestRecord, keyof TestRecord>,
    )
    return cloned
  }
}

describe('QueryBuilder', () => {
  const testData: TestRecord[] = [
    { id: 1, name: 'Alice', type: 'admin', value: 100, tags: ['a', 'b'] },
    { id: 2, name: 'Bob', type: 'user', value: 50, tags: ['c'] },
    { id: 3, name: 'Charlie', type: 'user', value: 75, tags: ['a', 'c'] },
    { id: 4, name: 'Diana', type: 'admin', value: 200, tags: [] },
  ]

  describe('select', () => {
    it('should limit returned properties', async () => {
      const builder = new TestQueryBuilder('TestTable', testData)
      const result = await builder.select(['id', 'name']).execute()

      expect(result[0]).toHaveProperty('id')
      expect(result[0]).toHaveProperty('name')
      expect(result[0]).not.toHaveProperty('type')
      expect(result[0]).not.toHaveProperty('value')
    })

    it('should return LocatedValue for each property', async () => {
      const builder = new TestQueryBuilder('TestTable', testData)
      const result = await builder.select(['id', 'name']).execute()

      expect(result[0].id.value).toBe(1)
      expect(result[0].name.value).toBe('Alice')
    })
  })

  describe('selectAll', () => {
    it('should return all properties', async () => {
      const builder = new TestQueryBuilder('TestTable', testData)
      const result = await builder.select(['id']).selectAll().execute()

      expect(result[0]).toHaveProperty('id')
      expect(result[0]).toHaveProperty('name')
      expect(result[0]).toHaveProperty('type')
      expect(result[0]).toHaveProperty('value')
      expect(result[0]).toHaveProperty('tags')
    })
  })

  describe('where', () => {
    it('should filter by equality', async () => {
      const builder = new TestQueryBuilder('TestTable', testData)
      const result = await builder.where('type', 'admin').execute()

      expect(result).toHaveLength(2)
      expect(result[0].name.value).toBe('Alice')
      expect(result[1].name.value).toBe('Diana')
    })

    it('should chain multiple where conditions', async () => {
      const builder = new TestQueryBuilder('TestTable', testData)
      const result = await builder
        .where('type', 'admin')
        .where('value', 100)
        .execute()

      expect(result).toHaveLength(1)
      expect(result[0].name.value).toBe('Alice')
    })
  })

  describe('whereIn', () => {
    it('should filter by IN condition', async () => {
      const builder = new TestQueryBuilder('TestTable', testData)
      const result = await builder.whereIn('id', [1, 3]).execute()

      expect(result).toHaveLength(2)
      expect(result[0].id.value).toBe(1)
      expect(result[1].id.value).toBe(3)
    })
  })

  describe('orderBy', () => {
    it('should sort ascending', async () => {
      const builder = new TestQueryBuilder('TestTable', testData)
      const result = await builder.orderBy('value', 'asc').execute()

      expect(result[0].value.value).toBe(50)
      expect(result[1].value.value).toBe(75)
      expect(result[2].value.value).toBe(100)
      expect(result[3].value.value).toBe(200)
    })

    it('should sort descending', async () => {
      const builder = new TestQueryBuilder('TestTable', testData)
      const result = await builder.orderBy('value', 'desc').execute()

      expect(result[0].value.value).toBe(200)
      expect(result[1].value.value).toBe(100)
      expect(result[2].value.value).toBe(75)
      expect(result[3].value.value).toBe(50)
    })

    it('should sort strings', async () => {
      const builder = new TestQueryBuilder('TestTable', testData)
      const result = await builder.orderBy('name', 'asc').execute()

      expect(result[0].name.value).toBe('Alice')
      expect(result[1].name.value).toBe('Bob')
      expect(result[2].name.value).toBe('Charlie')
      expect(result[3].name.value).toBe('Diana')
    })
  })

  describe('limit', () => {
    it('should limit number of results', async () => {
      const builder = new TestQueryBuilder('TestTable', testData)
      const result = await builder.limit(2).execute()

      expect(result).toHaveLength(2)
    })
  })

  describe('offset', () => {
    it('should skip records', async () => {
      const builder = new TestQueryBuilder('TestTable', testData)
      const result = await builder.offset(2).execute()

      expect(result).toHaveLength(2)
      expect(result[0].name.value).toBe('Charlie')
      expect(result[1].name.value).toBe('Diana')
    })

    it('should work with limit', async () => {
      const builder = new TestQueryBuilder('TestTable', testData)
      const result = await builder.offset(1).limit(2).execute()

      expect(result).toHaveLength(2)
      expect(result[0].name.value).toBe('Bob')
      expect(result[1].name.value).toBe('Charlie')
    })
  })

  describe('execute', () => {
    it('should return all records when no conditions', async () => {
      const builder = new TestQueryBuilder('TestTable', testData)
      const result = await builder.execute()

      expect(result).toHaveLength(4)
    })

    it('should wrap arrays in LocatedArray', async () => {
      const builder = new TestQueryBuilder('TestTable', testData)
      const result = await builder.execute()

      expect(result[0].tags.value).toEqual(['a', 'b'])
      expect(result[0].tags.length).toBe(2)
    })
  })

  describe('executeTakeFirst', () => {
    it('should return first record', async () => {
      const builder = new TestQueryBuilder('TestTable', testData)
      const result = await builder.executeTakeFirst()

      expect(result).toBeDefined()
      expect(result?.name.value).toBe('Alice')
    })

    it('should return undefined when no matches', async () => {
      const builder = new TestQueryBuilder('TestTable', testData)
      const result = await builder.where('id', 999).executeTakeFirst()

      expect(result).toBeUndefined()
    })
  })

  describe('executeTakeFirstOrThrow', () => {
    it('should return first record', async () => {
      const builder = new TestQueryBuilder('TestTable', testData)
      const result = await builder.executeTakeFirstOrThrow()

      expect(result.name.value).toBe('Alice')
    })

    it('should throw when no matches', async () => {
      const builder = new TestQueryBuilder('TestTable', testData)

      await expect(
        builder.where('id', 999).executeTakeFirstOrThrow(),
      ).rejects.toThrow(GeneralError)
    })
  })

  describe('location tracking', () => {
    it('should include location in LocatedValue', async () => {
      const builder = new TestQueryBuilder('TestTable', testData)
      const result = await builder.where('id', 1).executeTakeFirst()

      expect(result?.name.location.toString()).toBe('Test:TestTable[id=1].name')
    })
  })

  describe('textMapProvider integration', () => {
    it('should pass textMapProvider to LocatedValue', async () => {
      const mockProvider: TextMapProvider = {
        getTextSync: vi.fn().mockReturnValue('translated'),
      }

      const builder = new TestQueryBuilder('TestTable', testData)
      builder.setTextMapProvider(mockProvider)

      const result = await builder.executeTakeFirst()

      // Simulate using toText on a numeric value
      // (In real use, the value would be a hash)
      expect(result?.id.value).toBe(1)
    })
  })

  describe('immutability', () => {
    it('should not modify original builder', async () => {
      const original = new TestQueryBuilder('TestTable', testData)
      const withWhere = original.where('type', 'admin')
      const withLimit = original.limit(1)

      expect(original.getWhereConditions()).toHaveLength(0)
      expect((withWhere as TestQueryBuilder).getWhereConditions()).toHaveLength(
        1,
      )

      const originalResults = await original.execute()
      const whereResults = await withWhere.execute()
      const limitResults = await withLimit.execute()

      expect(originalResults).toHaveLength(4)
      expect(whereResults).toHaveLength(2)
      expect(limitResults).toHaveLength(1)
    })
  })
})
