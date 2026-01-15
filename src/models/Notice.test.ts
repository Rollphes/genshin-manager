import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { Notice } from '@/models/Notice'
import { ContentList, DataList } from '@/types/sg-hk4e-api/response'

function createMockDataList(overrides: Partial<DataList> = {}): DataList {
  return {
    ann_id: 12345,
    title: 'Test Announcement',
    subtitle: 'Test Subtitle<br/>Line 2',
    banner: 'https://example.com/banner.png',
    content: '',
    type_label: 'Event',
    tag_label: '1',
    tag_icon: 'https://example.com/tag.png',
    login_alert: 1,
    lang: 'en-us',
    start_time: '2024-01-01 10:00:00',
    end_time: '2024-01-31 10:00:00',
    type: 1,
    remind: 0,
    alert: 0,
    tag_start_time: '2024-01-01 10:00:00',
    tag_end_time: '2024-01-31 10:00:00',
    remind_ver: 5,
    has_content: true,
    extra_remind: 0,
    ...overrides,
  }
}

function createMockContentList(
  overrides: Partial<ContentList> = {},
): ContentList {
  return {
    ann_id: 12345,
    title: 'Test Content Title',
    subtitle: 'Test Content Subtitle',
    banner: 'https://example.com/content-banner.png',
    content: escape(
      '<p>〓Event Duration〓</p><p>2024/01/15 10:00 ~ 2024/01/31 10:00</p><p>〓Event Details〓</p><p>Test event details.</p>',
    ),
    lang: 'en-us',
    ...overrides,
  }
}

function createMockEnContentList(
  overrides: Partial<ContentList> = {},
): ContentList {
  return {
    ann_id: 12345,
    title: 'Test Content Title EN',
    subtitle: 'Test Content Subtitle EN',
    banner: 'https://example.com/content-banner-en.png',
    content: escape(
      '<p>〓Event Duration〓</p><p>2024/01/15 10:00 ~ 2024/01/31 10:00</p><p>〓Event Details〓</p><p>Test event details EN.</p>',
    ),
    lang: 'en-us',
    ...overrides,
  }
}

describe('Notice', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  }, 30000)

  describe('Constructor', () => {
    it('should create Notice with valid data', () => {
      const annList = createMockDataList()
      const annContent = createMockContentList()
      const enAnnContent = createMockEnContentList()

      const notice = new Notice(annList, annContent, enAnnContent, 'os_asia')
      expect(notice).toBeDefined()
    })

    it('should throw error when ann_id mismatch', () => {
      const annList = createMockDataList({ ann_id: 12345 })
      const annContent = createMockContentList({ ann_id: 99999 })
      const enAnnContent = createMockEnContentList({ ann_id: 12345 })

      expect(
        () => new Notice(annList, annContent, enAnnContent, 'os_asia'),
      ).toThrow()
    })
  })

  describe('Instance Properties', () => {
    let notice: Notice

    beforeAll(() => {
      const annList = createMockDataList()
      const annContent = createMockContentList()
      const enAnnContent = createMockEnContentList()
      notice = new Notice(annList, annContent, enAnnContent, 'os_asia')
    })

    it('should have correct id', () => {
      expect(notice.id).toBe(12345)
    })

    it('should have correct title', () => {
      expect(notice.title).toBe('Test Content Title')
    })

    it('should have subtitle with line breaks converted', () => {
      expect(notice.subtitle).toBe('Test Content Subtitle')
    })

    it('should have banner as ImageAssets', () => {
      expect(notice.banner).toBeInstanceOf(ImageAssets)
    })

    it('should have $ (cheerio) defined', () => {
      expect(notice.$).toBeDefined()
      expect(typeof notice.$).toBe('function')
    })

    it('should have correct type', () => {
      expect(notice.type).toBe(1)
    })

    it('should have correct typeLabel', () => {
      expect(notice.typeLabel).toBe('Event')
    })

    it('should have correct tag', () => {
      expect(notice.tag).toBe(1)
    })

    it('should have tagIcon as ImageAssets', () => {
      expect(notice.tagIcon).toBeInstanceOf(ImageAssets)
    })

    it('should have correct version', () => {
      expect(notice.version).toBe(5)
    })

    it('should have correct lang', () => {
      expect(notice.lang).toBe('en-us')
    })

    it('should have correct region', () => {
      expect(notice.region).toBe('os_asia')
    })
  })

  describe('Event Duration Parsing', () => {
    it('should parse event start and end dates', () => {
      const annList = createMockDataList()
      const annContent = createMockContentList()
      const enAnnContent = createMockEnContentList()
      const notice = new Notice(annList, annContent, enAnnContent, 'os_asia')

      if (notice.eventStart && notice.eventEnd) {
        expect(notice.eventStart).toBeInstanceOf(Date)
        expect(notice.eventEnd).toBeInstanceOf(Date)
        expect(notice.eventEnd.getTime()).toBeGreaterThan(
          notice.eventStart.getTime(),
        )
      }
    })
  })

  describe('Text Property', () => {
    it('should return text content from paragraphs', () => {
      const annList = createMockDataList()
      const annContent = createMockContentList()
      const enAnnContent = createMockEnContentList()
      const notice = new Notice(annList, annContent, enAnnContent, 'os_asia')

      expect(notice.text).toBeDefined()
      expect(typeof notice.text).toBe('string')
    })
  })

  describe('Different Regions', () => {
    it('should work with os_usa region', () => {
      const annList = createMockDataList()
      const annContent = createMockContentList()
      const enAnnContent = createMockEnContentList()
      const notice = new Notice(annList, annContent, enAnnContent, 'os_usa')

      expect(notice.region).toBe('os_usa')
    })

    it('should work with os_euro region', () => {
      const annList = createMockDataList()
      const annContent = createMockContentList()
      const enAnnContent = createMockEnContentList()
      const notice = new Notice(annList, annContent, enAnnContent, 'os_euro')

      expect(notice.region).toBe('os_euro')
    })

    it('should work with cn_gf01 region', () => {
      const annList = createMockDataList()
      const annContent = createMockContentList()
      const enAnnContent = createMockEnContentList()
      const notice = new Notice(annList, annContent, enAnnContent, 'cn_gf01')

      expect(notice.region).toBe('cn_gf01')
    })
  })

  describe('Different Tag Types', () => {
    it('should handle tag type 1 (!)', () => {
      const annList = createMockDataList({ tag_label: '1' })
      const annContent = createMockContentList()
      const enAnnContent = createMockEnContentList()
      const notice = new Notice(annList, annContent, enAnnContent, 'os_asia')

      expect(notice.tag).toBe(1)
    })

    it('should handle tag type 2 (star)', () => {
      const annList = createMockDataList({ tag_label: '2' })
      const annContent = createMockContentList()
      const enAnnContent = createMockEnContentList()
      const notice = new Notice(annList, annContent, enAnnContent, 'os_asia')

      expect(notice.tag).toBe(2)
    })

    it('should handle tag type 3 (flag)', () => {
      const annList = createMockDataList({ tag_label: '3' })
      const annContent = createMockContentList()
      const enAnnContent = createMockEnContentList()
      const notice = new Notice(annList, annContent, enAnnContent, 'os_asia')

      expect(notice.tag).toBe(3)
    })
  })

  describe('Different Notice Types', () => {
    it('should handle event type (1)', () => {
      const annList = createMockDataList({ type: 1 })
      const annContent = createMockContentList()
      const enAnnContent = createMockEnContentList()
      const notice = new Notice(annList, annContent, enAnnContent, 'os_asia')

      expect(notice.type).toBe(1)
    })

    it('should handle important type (2)', () => {
      const annList = createMockDataList({ type: 2 })
      const annContent = createMockContentList()
      const enAnnContent = createMockEnContentList()
      const notice = new Notice(annList, annContent, enAnnContent, 'os_asia')

      expect(notice.type).toBe(2)
    })
  })

  describe('Subtitle Line Break Handling', () => {
    it('should convert <br> to newline', () => {
      const annList = createMockDataList()
      const annContent = createMockContentList({
        subtitle: 'Line 1<br>Line 2',
      })
      const enAnnContent = createMockEnContentList()
      const notice = new Notice(annList, annContent, enAnnContent, 'os_asia')

      expect(notice.subtitle).toBe('Line 1\nLine 2')
    })

    it('should convert <br/> to newline', () => {
      const annList = createMockDataList()
      const annContent = createMockContentList({
        subtitle: 'Line 1<br/>Line 2',
      })
      const enAnnContent = createMockEnContentList()
      const notice = new Notice(annList, annContent, enAnnContent, 'os_asia')

      expect(notice.subtitle).toBe('Line 1\nLine 2')
    })

    it('should convert <br /> to newline', () => {
      const annList = createMockDataList()
      const annContent = createMockContentList({
        subtitle: 'Line 1<br />Line 2',
      })
      const enAnnContent = createMockEnContentList()
      const notice = new Notice(annList, annContent, enAnnContent, 'os_asia')

      expect(notice.subtitle).toBe('Line 1\nLine 2')
    })
  })

  describe('Content with Images', () => {
    it('should extract reward image if present', () => {
      const annList = createMockDataList()
      const annContent = createMockContentList({
        content: escape(
          '<p>〓Event Duration〓</p><p>2024/01/15 10:00 ~ 2024/01/31 10:00</p><img src="https://example.com/reward.png"/>',
        ),
      })
      const enAnnContent = createMockEnContentList()
      const notice = new Notice(annList, annContent, enAnnContent, 'os_asia')

      expect(notice.rewardImg).toBeInstanceOf(ImageAssets)
    })

    it('should have undefined rewardImg if no image', () => {
      const annList = createMockDataList()
      const annContent = createMockContentList({
        content: escape('<p>No images here</p>'),
      })
      const enAnnContent = createMockEnContentList({
        content: escape('<p>No images here</p>'),
      })
      const notice = new Notice(annList, annContent, enAnnContent, 'os_asia')

      expect(notice.rewardImg).toBeUndefined()
    })
  })
})
