/* eslint-disable jsdoc/require-jsdoc */

/**
 * GitLab commits API response
 */
export interface CommitsResponse {
  readonly id: string
  readonly short_id: string
  readonly created_at: string
  readonly parent_ids: readonly string[]
  readonly title: string
  readonly message: string
  readonly authored_date: string
  readonly committed_date: string
  readonly web_url: string
}

/**
 * GitLab tree item response
 */
export interface TreeItemResponse {
  readonly id: string
  readonly name: string
  readonly type: 'blob' | 'tree'
  readonly path: string
  readonly mode: string
}
