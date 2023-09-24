import { JSDOM } from 'jsdom'

import { ImageAssets } from '@/models/assets/ImageAssets'
import { Region, ValueOf } from '@/types'
import { ContentList, DataList, NoticeLanguage } from '@/types/GetAnnTypes'
import { convertToUTC } from '@/utils/convertToUTC'

/**
 * Class that summarizes information about a notice in game.
 */
export class Notice {
  /**
   * Notice ID
   */
  public id: number
  /**
   * Notice title
   */
  public title: string
  /**
   * Notice subtitle
   */
  public subtitle: string
  /**
   * Notice banner
   */
  public banner: ImageAssets
  /**
   * Notice content DOM
   * @warning Note that the t tag is not unescaped.
   */
  public dom: Document
  /**
   * Notice type
   * (1:event or 2:important)
   */
  public type: number
  /**
   * Notice type label
   * (event or important)
   */
  public typeLabel: string
  /**
   * Notice tag
   * (1:! 2:flag 3:star)
   */
  public tag: number
  /**
   * Notice tag icon
   */
  public tagIcon: ImageAssets
  /**
   * Event start time
   * If `undefined`, use getEventDuration().
   */
  public eventStart: Date | undefined
  /**
   * Event end time
   * If `undefined`, use getEventDuration().
   */
  public eventEnd: Date | undefined
  /**
   * Reward image
   */
  public rewardImg: ImageAssets | undefined
  /**
   * Notice remind version
   */
  public version: number
  /**
   * Notice language
   */
  public lang: ValueOf<typeof NoticeLanguage>
  private _enDom: Document

  /**
   * Create a Notice
   * @param list AnnList
   * @param content AnnContent
   * @param enContent AnnContent(lang=en)
   * @param region Region
   */
  constructor(
    list: DataList,
    content: ContentList,
    enContent: ContentList,
    region: Region,
  ) {
    if (list.ann_id !== content.ann_id) throw new Error('ID mismatch')
    this.id = list.ann_id

    this.title = content.title
    this.subtitle = content.subtitle
    this.banner = ImageAssets.fromUrl(content.banner)

    //TODO:There is no code to unescape the t tag.
    const unescapedContent = unescape(content.content)
    this.dom = new JSDOM(unescapedContent).window.document

    const unescapedEnContent = unescape(enContent.content)
    this._enDom = new JSDOM(unescapedEnContent).window.document

    const timeStrings = unescapedEnContent.match(
      /\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}/g,
    )
    if (
      timeStrings &&
      timeStrings.length > 1 &&
      (list.tag_label === '3' || (list.tag_label === '2' && list.type === 1))
    ) {
      timeStrings.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      if (list.tag_label === '2') {
        const replacedContent = unescapedEnContent
          .replace(/<tr>/g, '\n<tr>')
          .replace(/<tr.*?>.*?(shop|reword|Shop|Reword).*?<\/tr>/g, '')
        const replacedTimeStrings = replacedContent.match(
          /\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}/g,
        )
        if (replacedTimeStrings && replacedTimeStrings.length > 1) {
          replacedTimeStrings.sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime(),
          )
          this.eventStart = convertToUTC(replacedTimeStrings[0], region)
          this.eventEnd = convertToUTC(
            replacedTimeStrings[replacedTimeStrings.length - 1],
            region,
          )
        }
      }
      this.eventStart = convertToUTC(timeStrings[0], region)
      this.eventEnd = convertToUTC(timeStrings[timeStrings.length - 1], region)
    }

    const rewardImgUrl = this.dom.querySelector('img')?.src
    this.rewardImg = rewardImgUrl
      ? ImageAssets.fromUrl(rewardImgUrl)
      : undefined

    this.lang = content.lang

    this.type = list.type
    this.typeLabel = list.type_label
    this.tag = Number(list.tag_label)
    this.tagIcon = ImageAssets.fromUrl(list.tag_icon)
    this.version = list.remind_ver
  }

  /**
   * Get the text of the notice.
   * @warning This method does not exclude table tags.
   * @returns
   */
  public getText() {
    const elements = this.dom.querySelectorAll('p')
    const texts = Array.from(elements).map((element) => element.textContent)
    return texts.join('\n')
  }

  /**
   * Get the duration of the event.
   * However, this method should only be used when `eventStart` or `eventEnd` cannot be obtained.
   * @return
   */
  public getEventDuration() {
    if (this.tag === 2) return
    const elements = this.dom.querySelectorAll('p')
    const enElements = this._enDom.querySelectorAll('p')
    const indexs = Array.from(enElements)
      .map((enElement, i) =>
        enElement.textContent?.match(/〓.*?(Time|Duration).*?〓/g)
          ? i
          : undefined,
      )
      .filter((index): index is number => index !== undefined)
    if (!indexs.length) return
    if (indexs.length === 1) return elements[indexs[0] + 1].textContent

    const endIndex = indexs[1] - 1
    const duration = []
    for (let i = indexs[0] + 1; i < endIndex; i++) {
      duration.push(elements[i].textContent)
    }
    return duration.join('\n')
  }
}
