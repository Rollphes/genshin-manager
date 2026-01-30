/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable @typescript-eslint/naming-convention */

import type {
  CommitsResponse,
  TreeItemResponse,
} from '@/types/api/gitlab/responses'

/**
 * GitLab API routes definition
 */
export interface GitLabApiRoutes {
  readonly '/api/v4/projects/:id/repository/commits': {
    readonly params: { readonly id: number }
    readonly query: { readonly per_page: number }
    readonly response: readonly CommitsResponse[]
  }
  readonly '/api/v4/projects/:id/repository/tree': {
    readonly params: { readonly id: number }
    readonly query: {
      readonly path: string
      readonly ref: string
      readonly per_page: number
    }
    readonly response: readonly TreeItemResponse[]
  }
  readonly '/api/v4//projects/:id/repository/files/:file_path/raw': {
    readonly params: { readonly id: number; readonly file_path: string }
    readonly query: { readonly ref: string }
    readonly response: string
  }
}
