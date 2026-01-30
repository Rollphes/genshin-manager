import type { Language } from '@genshin-manager/core'

/**
 * Element type
 */
export enum Element {
  Phys = 'Phys',
  Pyro = 'Pyro',
  Electro = 'Electro',
  Cryo = 'Cryo',
  Anemo = 'Anemo',
  Hydro = 'Hydro',
  Geo = 'Geo',
  Dendro = 'Dendro',
}

/**
 * Character voice type (subset of Language with voice acting support)
 */
export type CVType = Language.En | Language.Ja | Language.Ko | Language.ZhCn
