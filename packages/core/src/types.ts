//TODO: 移動検討
/**
 * Supported language codes (ISO 639-1 with region)
 */
export enum Language {
  En = 'en',
  Ru = 'ru',
  Vi = 'vi',
  Th = 'th',
  Pt = 'pt',
  Ko = 'ko',
  Ja = 'ja',
  Id = 'id',
  Fr = 'fr',
  Es = 'es',
  De = 'de',
  ZhTw = 'zh-tw',
  ZhCn = 'zh-cn',
}

/**
 * TextMap base name mapping
 * @description Maps language codes to TextMap file base names (without extension or split suffix)
 */
export const TextMapBaseName = {
  [Language.En]: 'TextMapEN',
  [Language.Ru]: 'TextMapRU',
  [Language.Vi]: 'TextMapVI',
  [Language.Th]: 'TextMapTH',
  [Language.Pt]: 'TextMapPT',
  [Language.Ko]: 'TextMapKR',
  [Language.Ja]: 'TextMapJP',
  [Language.Id]: 'TextMapID',
  [Language.Fr]: 'TextMapFR',
  [Language.Es]: 'TextMapES',
  [Language.De]: 'TextMapDE',
  [Language.ZhTw]: 'TextMapCHT',
  [Language.ZhCn]: 'TextMapCHS',
} as const satisfies Record<Language, string>
