import { describe, expect, it } from 'vitest'

import { Notice } from '@/dto/Notice'
import type { ContentList, DataList } from '@/types/api/responses'

describe('Notice', () => {
  const annList: DataList = {
    ann_id: 123,
    title: 'Test Event',
    subtitle: 'Test<br/>Subtitle',
    banner: 'https://example.com/banner.png',
    content: '',
    type_label: 'Event',
    tag_label: '1',
    tag_icon: 'https://example.com/icon.png',
    login_alert: 0,
    lang: 'en-us',
    start_time: '2024-01-01 00:00:00',
    end_time: '2024-01-31 23:59:59',
    type: 1,
    remind: 0,
    alert: 0,
    tag_start_time: '',
    tag_end_time: '',
    remind_ver: 1,
    has_content: true,
    extra_remind: 0,
  }

  const annContent: ContentList = {
    ann_id: 123,
    title: 'Test Event',
    subtitle: 'Test<br/>Subtitle',
    banner: 'https://example.com/banner.png',
    content: '<p>Hello World</p>',
    lang: 'en-us',
  }

  it('should build from API response via fromResponse', () => {
    const notice = Notice.fromResponse(
      annList,
      annContent,
      annContent,
      'os_asia',
    )
    expect(notice.id).toBe(123)
    expect(notice.title).toBe('Test Event')
    expect(notice.subtitle).toBe('Test\nSubtitle')
    expect(notice.banner).toBe('https://example.com/banner.png')
    expect(notice.type).toBe(1)
    expect(notice.typeLabel).toBe('Event')
    expect(notice.tag).toBe(1)
    expect(notice.tagIcon).toBe('https://example.com/icon.png')
    expect(notice.version).toBe(1)
    expect(notice.region).toBe('os_asia')
  })

  it('should create from constructor data', () => {
    const notice = new Notice({
      id: 456,
      title: 'Direct Notice',
      subtitle: 'Sub',
      banner: 'https://example.com/banner2.png',
      type: 2,
      typeLabel: 'Important',
      tag: 2,
      tagIcon: 'https://example.com/icon2.png',
      version: 2,
      lang: 'ja' as never,
      region: 'os_asia' as never,
      content: '<p>Content</p>',
      enContent: '<p>Content</p>',
      eventStart: undefined,
      eventEnd: undefined,
      rewardImageURL: undefined,
    })
    expect(notice.id).toBe(456)
    expect(notice.title).toBe('Direct Notice')
    expect(notice.type).toBe(2)
  })

  it('should extract text from content', () => {
    const notice = Notice.fromResponse(
      annList,
      annContent,
      annContent,
      'os_asia',
    )
    expect(notice.text).toBe('Hello World')
  })
})
