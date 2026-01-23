/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable @typescript-eslint/naming-convention */

import type {
  BuildResponse,
  EnkaDataResponse,
  EnkaStatusResponse,
  GameAccountResponse,
  OwnerResponse,
} from '@/types/api/enkaNetwork/responses'

export interface EnkaApiRoutes {
  readonly '/api/uid/:uid': {
    readonly params: { readonly uid: number }
    readonly response: EnkaDataResponse
  }
  readonly '/api/uid/:uid/?info': {
    readonly params: { readonly uid: number }
    readonly response: EnkaDataResponse
  }
  readonly '/api/profile/:username': {
    readonly params: { readonly username: string }
    readonly response: OwnerResponse
  }
  readonly '/api/profile/:username/hoyos': {
    readonly params: { readonly username: string }
    readonly response: Readonly<Record<string, GameAccountResponse>>
  }
  readonly '/api/profile/:username/hoyos/:hash/builds': {
    readonly params: { readonly username: string; readonly hash: string }
    readonly response: Readonly<Record<string, readonly BuildResponse[]>>
  }
}

export interface EnkaStatusApiRoutes {
  readonly '/api/status': {
    readonly response: Readonly<Record<string, EnkaStatusResponse>>
  }
  readonly '/api/now': {
    readonly response: EnkaStatusResponse
  }
}
