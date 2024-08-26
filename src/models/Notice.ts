import cheerio from 'cheerio'

import { ImageAssets } from '@/models/assets/ImageAssets'
import { ValueOf } from '@/types'
import { NoticeLanguage, Region } from '@/types/sg-hk4e-api'
import { ContentList, DataList } from '@/types/sg-hk4e-api/response'
import { convertToUTC } from '@/utils/convertToUTC'

/**
 * Class for compiling in-game announcement information
 */
export class Notice {
  /**
   * Notice ID
   */
  public readonly id: number
  /**
   * Notice title
   */
  public readonly title: string
  /**
   * Notice subtitle
   */
  public readonly subtitle: string
  /**
   * Notice banner
   */
  public readonly banner: ImageAssets
  /**
   * Notice content DOM(jQuery)
   * @warning This property does not exclude table tags
   */
  public readonly $: cheerio.Root
  /**
   * Notice type (1:event or 2:important)
   */
  public readonly type: number
  /**
   * Notice type label (event or important)
   */
  public readonly typeLabel: string
  /**
   * Notice tag (1:! 2:star 3:flag)
   */
  public readonly tag: number
  /**
   * Notice tag icon
   */
  public readonly tagIcon: ImageAssets
  /**
   * Event start time
   * @description If `undefined`, use getEventDuration()
   */
  public readonly eventStart: Date | undefined
  /**
   * Event end time
   * @description If `undefined`, use getEventDuration()
   */
  public readonly eventEnd: Date | undefined
  /**
   * Reward image
   */
  public readonly rewardImg: ImageAssets | undefined
  /**
   * Notice remind version
   */
  public readonly version: number
  /**
   * Notice language
   */
  public readonly lang: ValueOf<typeof NoticeLanguage>
  /**
   * Notice region
   */
  public readonly region: Region
  private readonly _en$: cheerio.Root

  /**
   * Create a Notice
   * @param annList AnnList
   * @param annContent AnnContent
   * @param enAnnContent AnnContent(lang=en)
   * @param region Region
   */
  constructor(
    annList: DataList,
    annContent: ContentList,
    enAnnContent: ContentList,
    region: Region,
  ) {
    this.region = region
    if (annList.ann_id !== annContent.ann_id) throw new Error('ID mismatch')
    this.id = annList.ann_id
    this.lang = annContent.lang
    this.type = annList.type
    this.typeLabel = annList.type_label
    this.tag = Number(annList.tag_label)
    this.tagIcon = ImageAssets.fromURL(annList.tag_icon)
    this.version = annList.remind_ver

    this.title = annContent.title
    this.subtitle = annContent.subtitle
      .replace(/<br.*?>/g, '\n')
      .replace(/\r/g, '')
    this.banner = ImageAssets.fromURL(annContent.banner)

    const unescapedContent = unescape(annContent.content)
    this.$ = cheerio.load(unescapedContent)

    const unescapedEnContent = unescape(enAnnContent.content)
    this._en$ = cheerio.load(unescapedEnContent)

    const timeStrings = this.convertLocalDate(
      this._en$('p')
        .toArray()
        .map((el) => this._en$(el).text())
        .filter((str) => !/shop|reword|Shop|Reword/g.test(str))
        .join('\n')
        .split(/\n(?=〓)/g)
        .find((text) => /〓.*?(Time|Duration|Wish).*?〓/g.test(text)) ?? '',
    ).match(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}/g)

    if (
      timeStrings &&
      timeStrings?.length >= 2 &&
      !(this.tag === 3 && this.$('td').toArray().length)
    ) {
      timeStrings.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      this.eventStart = new Date(timeStrings[0])
      this.eventEnd = new Date(timeStrings[timeStrings.length - 1])
    }

    const rewardImgURL = this.$('img').attr('src')
    this.rewardImg = rewardImgURL
      ? ImageAssets.fromURL(rewardImgURL)
      : undefined
  }

  /**
   * Get the text of the notice
   * @warning This method does not exclude table tags
   * @returns Notice all text
   */
  public get text(): string {
    return this.convertLocalDate(
      this.$('p')
        .map((i, el) => this.$(el).text())
        .get()
        .join('\n'),
    )
  }

  /**
   * Get the duration of the event
   * @description However, this method should only be used when `eventStart` or `eventEnd` cannot be obtained
   * @returns Event duration
   */
  public get eventDuration(): string | undefined {
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
    if (this.$('td').toArray().length) {
      const trFirst = this.$('tr').first()
      const tdList = this.$('td')
        .toArray()
        .filter((el): el is cheerio.TagElement => el.type === 'tag')

      const colWidths = this.$(trFirst)
        .children()
        .toArray()
        .filter((el): el is cheerio.TagElement => el.type === 'tag')
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

    const textBlocks = this.$('p')
      .map((i, el) => this.$(el).text())
      .get()
      .join('\n')
      .split(/\n(?=〓)/g)
    const enTextBlocks = this._en$('p')
      .map((i, el) => this._en$(el).text())
      .get()
      .join('\n')
      .split(/\n(?=〓)/g)

    const index = enTextBlocks.findIndex((text) =>
      /〓.*?(Time|Duration|Wish).*?〓/g.test(text),
    )
    if (index === -1) return
    return this.convertLocalDate(textBlocks[index].replace(/〓.*?〓\s*\n/g, ''))
  }

  /**
   * Convert t tag to region time
   * @param text Text
   * @returns Converted text
   */
  private convertLocalDate(text: string): string {
    return text
      .replace(/(?<=<t class="(t_lc|t_gl)".*?>)(.*?)(?=<\/t>)/g, ($1) =>
        convertToUTC($1, this.region).toLocaleString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
      )
      .replace(/<t class="(t_lc|t_gl).*?">|<\/t>/g, '')
  }
}
