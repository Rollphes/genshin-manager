import type { Language } from '@genshin-manager/core'
import * as cheerio from 'cheerio'
import type { Element } from 'domhandler'

import { convertToUTC } from '@/parsers/convertToUTC'
import type { ContentList, DataList } from '@/types/api/responses'
import type { Region } from '@/types/Region'

/**
 * Cheerio API type
 */
type CheerioAPI = ReturnType<typeof cheerio.load>

/**
 * Constructor data for Notice
 */
export interface NoticeData {
  /** Notice ID */
  readonly id: number
  /** Notice title */
  readonly title: string
  /** Notice subtitle */
  readonly subtitle: string
  /** Notice banner URL */
  readonly banner: string
  /** Notice type (1:event or 2:important) */
  readonly type: number
  /** Notice type label */
  readonly typeLabel: string
  /** Notice tag (1:! 2:star 3:flag) */
  readonly tag: number
  /** Notice tag icon URL */
  readonly tagIcon: string
  /** Notice remind version */
  readonly version: number
  /** Notice language */
  readonly lang: Language
  /** Notice region */
  readonly region: Region
  /** Notice content (HTML) */
  readonly content: string
  /** English content (HTML) for duration parsing */
  readonly enContent: string
  /** Event start time */
  readonly eventStart: Date | undefined
  /** Event end time */
  readonly eventEnd: Date | undefined
  /** First image URL in content */
  readonly rewardImageURL: string | undefined
}

/**
 * Contains in-game announcement information.
 * Pure DTO with content parsing via Cheerio.
 */
export class Notice {
  private static readonly languageMap: Readonly<Record<string, Language>> = {
    'en-us': 'en' as Language,
    'ru-ru': 'ru' as Language,
    'vi-vn': 'vi' as Language,
    'th-th': 'th' as Language,
    'pt-br': 'pt' as Language,
    'ko-kr': 'ko' as Language,
    'ja-jp': 'ja' as Language,
    'id-id': 'id' as Language,
    'fr-fr': 'fr' as Language,
    'es-es': 'es' as Language,
    'de-de': 'de' as Language,
    'zh-tw': 'zh-tw' as Language,
    'zh-cn': 'zh-cn' as Language,
  }

  private static readonly dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }

  /** Notice ID */
  public readonly id: number
  /** Notice title */
  public readonly title: string
  /** Notice subtitle */
  public readonly subtitle: string
  /** Notice banner URL */
  public readonly banner: string
  /** Notice content DOM (Cheerio) */
  public readonly $: CheerioAPI
  /** Notice type (1:event or 2:important) */
  public readonly type: number
  /** Notice type label */
  public readonly typeLabel: string
  /** Notice tag (1:! 2:star 3:flag) */
  public readonly tag: number
  /** Notice tag icon URL */
  public readonly tagIcon: string
  /** Event start time */
  public readonly eventStart: Date | undefined
  /** Event end time */
  public readonly eventEnd: Date | undefined
  /** Reward image URL */
  public readonly rewardImageURL: string | undefined
  /** Notice remind version */
  public readonly version: number
  /** Notice language */
  public readonly lang: Language
  /** Notice region */
  public readonly region: Region

  private readonly en$: CheerioAPI

  /**
   * Create a Notice
   * @param data - Pre-resolved notice data
   */
  constructor(data: NoticeData) {
    this.id = data.id
    this.title = data.title
    this.subtitle = data.subtitle
    this.banner = data.banner
    this.type = data.type
    this.typeLabel = data.typeLabel
    this.tag = data.tag
    this.tagIcon = data.tagIcon
    this.version = data.version
    this.lang = data.lang
    this.region = data.region
    this.eventStart = data.eventStart
    this.eventEnd = data.eventEnd
    this.rewardImageURL = data.rewardImageURL
    this.$ = cheerio.load(unescape(data.content))
    this.en$ = cheerio.load(unescape(data.enContent))
  }

  /**
   * Get the text of the notice
   * @returns notice all text
   */
  public get text(): string {
    return this.convertLocalDate(
      this.$('p')
        .map((_i, el) => this.$(el).text())
        .get()
        .join('\n'),
    )
  }

  /**
   * Get the duration of the event
   * @returns event duration
   */
  public get eventDuration(): string | undefined {
    if (this.eventStart && this.eventEnd)
      return `${this.eventStart.toLocaleDateString('ja-JP', Notice.dateTimeFormatOptions)} ~ ${this.eventEnd.toLocaleDateString('ja-JP', Notice.dateTimeFormatOptions)}`

    if (this.tag === 2) {
      return this.convertLocalDate(
        this.$('td')
          .toArray()
          .map((el) => this.$(el).text())[3]
          .replace('~', ' ~')
          .replace('—', ' — ')
          .replace('-', ' -'),
      )
    }

    if (!this.$(this.durationTitleElement).next().is('p')) {
      const trFirst = this.$('tr').first()
      const tdList = this.$('td').toArray()

      const colWidths = this.$(trFirst)
        .children()
        .toArray()
        .map((el) => el.attribs['data-colwidth'])

      if (colWidths.length > 2) {
        const startTimeColWidth = colWidths[colWidths.length - 2]
        const endTimeColWidth = colWidths[colWidths.length - 1]
        const startTimeRows = tdList.filter(
          (el) => el.attribs['data-colwidth'] === startTimeColWidth,
        )
        const endTimeRows = tdList.filter(
          (el) => el.attribs['data-colwidth'] === endTimeColWidth,
        )

        const startTime = this.$(startTimeRows[1]).text()
        const endTime = this.$(endTimeRows[endTimeRows.length - 1]).text()
        return `${this.convertLocalDate(startTime)} ~ ${this.convertLocalDate(endTime)}`
      }
    }

    let durationResult = ''
    let nextElement = this.$(this.durationTitleElement).next()

    while (nextElement.length && !nextElement.text().includes('〓')) {
      durationResult += `${nextElement.text()}\n`
      nextElement = nextElement.next()
    }

    if (durationResult.trim() === '') return undefined

    return this.convertLocalDate(durationResult.trim())
  }

  private get durationTitleElement(): Element | undefined {
    const durationTitleElementIndex = this.en$('p')
      .toArray()
      .findIndex((el) =>
        /〓.*?(Time|Duration|Wish).*?〓/g.test(this.en$(el).text()),
      )
    if (durationTitleElementIndex === -1) return undefined
    return this.$('p').toArray()[durationTitleElementIndex]
  }

  /**
   * Build a Notice from API responses
   * @param annList - Announcement list data
   * @param annContent - Announcement content
   * @param enAnnContent - English announcement content
   * @param region - Server region
   * @returns Notice instance
   */
  public static fromResponse(
    annList: DataList,
    annContent: ContentList,
    enAnnContent: ContentList,
    region: Region,
  ): Notice {
    const unescapedContent = unescape(annContent.content)
    const $ = cheerio.load(unescapedContent)

    const unescapedEnContent = unescape(enAnnContent.content)
    const en$ = cheerio.load(unescapedEnContent)

    let eventStart: Date | undefined
    let eventEnd: Date | undefined

    const durationTitleIndex = en$('p')
      .toArray()
      .findIndex((el) => /〓.*?(Time|Duration|Wish).*?〓/g.test(en$(el).text()))
    const durationElement =
      durationTitleIndex !== -1
        ? $('p').toArray()[durationTitleIndex]
        : undefined

    if (durationElement) {
      let durationResult = ''
      let nextElement = $(durationElement).next()

      while (nextElement.length && !nextElement.text().includes('〓')) {
        if (!/shop|reword|Shop|Reword/g.test(nextElement.text()))
          durationResult += `${nextElement.text()}\n`
        nextElement = nextElement.next()
      }

      const timeStrings = durationResult
        .trim()
        .match(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}/g)

      if (
        timeStrings &&
        timeStrings.length >= 2 &&
        !(Number(annList.tag_label) === 3 && !$(durationElement).next().is('p'))
      ) {
        timeStrings.sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime(),
        )
        eventStart = new Date(timeStrings[0])
        eventEnd = new Date(timeStrings[timeStrings.length - 1])
      }
    }

    const rewardImgURL = $('img').attr('src')
    const lang = Notice.languageMap[annContent.lang]

    return new Notice({
      id: annList.ann_id,
      title: annContent.title,
      subtitle: annContent.subtitle
        .replace(/<br.*?>/g, '\n')
        .replace(/\r/g, ''),
      banner: annContent.banner,
      type: annList.type,
      typeLabel: annList.type_label,
      tag: Number(annList.tag_label),
      tagIcon: annList.tag_icon,
      version: annList.remind_ver,
      lang,
      region,
      content: annContent.content,
      enContent: enAnnContent.content,
      eventStart,
      eventEnd,
      rewardImageURL: rewardImgURL ?? undefined,
    })
  }

  /**
   * Convert t tag to region time
   * @param text - text
   * @returns converted text
   */
  private convertLocalDate(text: string): string {
    return text
      .replace(/(?<=<t class="(t_lc|t_gl)".*?>)(.*?)(?=<\/t>)/g, ($1) =>
        convertToUTC($1, this.region).toLocaleString(
          'ja-JP',
          Notice.dateTimeFormatOptions,
        ),
      )
      .replace(/<t class="(t_lc|t_gl).*?">|<\/t>/g, '')
  }
}
