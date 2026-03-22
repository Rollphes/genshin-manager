/**
 *
 */
export interface paths {
  /**
   *
   */
  '/projects/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get a single project */
    get: operations['getProject']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  /**
   *
   */
  '/projects/{id}/repository/commits': {
    /**
     *
     */
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get a project repository commits */
    get: operations['getRepositoryCommits']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  /**
   *
   */
  '/projects/{id}/repository/tree': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get a project repository tree */
    get: operations['getRepositoryTree']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  /**
   *
   */
  '/projects/{id}/repository/files/{file_path}': {
    /**
     *
     */
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get file from repository */
    get: operations['getRepositoryFile']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  /**
   *
   */
  '/projects/{id}/repository/files/{file_path}/raw': {
    /**
     *
     */
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get raw file contents from the repository */
    get: operations['getRepositoryFileRaw']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  /**
   *
   */
  '/projects/{id}/repository/branches': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get a project repository branches */
    get: operations['getRepositoryBranches']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  /**
   *
   */
  '/projects/{id}/repository/tags': {
    /**
     *
     */
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get a project repository tags */
    get: operations['getRepositoryTags']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  /**
   *
   */
  '/projects/{id}/repository/compare': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Compare two branches, tags, or commits */
    get: operations['getRepositoryCompare']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}
/**
 *
 */
export type webhooks = Record<string, never>
/**
 *
 */
export interface components {
  /**
   *
   */
  schemas: {
    Project: {
      id?: number
      name?: string
      description?: string
      name_with_namespace?: string
      path?: string
      path_with_namespace?: string
      /** Format: date-time */
      created_at?: string
      default_branch?: string
      ssh_url_to_repo?: string
      http_url_to_repo?: string
      web_url?: string
      forks_count?: number
      star_count?: number
      /** Format: date-time */
      last_activity_at?: string
      visibility?: string
      archived?: boolean
    }
    Commit: {
      /** @description Full commit SHA */
      id?: string
      /** @description Short commit SHA */
      short_id?: string
      /** Format: date-time */
      created_at?: string
      parent_ids?: string[]
      /** @description Commit title (first line of message) */
      title?: string
      /** @description Full commit message */
      message?: string
      author_name?: string
      author_email?: string
      /** Format: date-time */
      authored_date?: string
      committer_name?: string
      committer_email?: string
      /** Format: date-time */
      committed_date?: string
      /** Format: uri */
      web_url?: string
    }
    /**
     *
     */
    TreeObject: {
      id?: string
      name?: string
      /** @enum {string} */
      type?: 'tree' | 'blob'
      path?: string
      mode?: string
    }
    /**
     *
     */
    FileMetadata: {
      file_name?: string
      file_path?: string
      size?: number
      encoding?: string
      content_sha256?: string
      ref?: string
      blob_id?: string
      commit_id?: string
      last_commit_id?: string
    }
    Branch: {
      name?: string
      commit?: components['schemas']['Commit']
      merged?: boolean
      protected?: boolean
      developers_can_push?: boolean
      developers_can_merge?: boolean
      can_push?: boolean
      default?: boolean
      web_url?: string
    }
    Tag: {
      name?: string
      message?: string
      /** @description Commit SHA */
      target?: string
      commit?: components['schemas']['Commit']
      release?: components['schemas']['TagRelease']
      protected?: boolean
      /** Format: date-time */
      created_at?: string
    }
    /**
     *
     */
    TagRelease: {
      tag_name?: string
      description?: string
    }
    /**
     *
     */
    Compare: {
      commit?: components['schemas']['Commit']
      commits?: components['schemas']['Commit'][]
      diffs?: components['schemas']['Diff'][]
      compare_timeout?: boolean
      compare_same_ref?: boolean
      web_url?: string
    }
    /**
     *
     */
    Diff: {
      diff?: string
      new_path?: string
      old_path?: string
      a_mode?: string
      b_mode?: string
      new_file?: boolean
      renamed_file?: boolean
      deleted_file?: boolean
      generated_file?: boolean
    }
  }
  /**
   *
   */
  responses: never
  /**
   *
   */
  parameters: never
  /**
   *
   */
  requestBodies: never
  /**
   *
   */
  headers: never
  /**
   *
   */
  pathItems: never
}
/**
 *
 */
export type $defs = Record<string, never>
/**
 *
 */
export interface operations {
  /**
   *
   */
  getProject: {
    parameters: {
      query?: never
      header?: never
      /**
       *
       */
      path: {
        /** @description The ID or URL-encoded path of the project */
        id: string | number
      }
      cookie?: never
    }
    requestBody?: never
    /**
     *
     */
    responses: {
      /** @description OK */
      200: {
        headers: Record<string, unknown>
        /**
         *
         */
        content: {
          'application/json': components['schemas']['Project']
        }
      }
      /** @description Not found */
      404: {
        headers: Record<string, unknown>
        content?: never
      }
    }
  }
  /**
   *
   */
  getRepositoryCommits: {
    parameters: {
      query?: {
        /** @description The name of a repository branch or tag */
        ref_name?: string
        /** @description Number of items per page */
        per_page?: number
        /** @description Current page number */
        page?: number
      }
      header?: never
      path: {
        /** @description The ID or URL-encoded path of the project */
        id: string | number
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description OK */
      200: {
        headers: Record<string, unknown>
        content: {
          'application/json': components['schemas']['Commit'][]
        }
      }
      /** @description Not found */
      404: {
        headers: Record<string, unknown>
        content?: never
      }
    }
  }
  /**
   *
   */
  getRepositoryTree: {
    parameters: {
      query?: {
        /** @description The name of a repository branch or tag, if not given the default branch is used */
        ref?: string
        /** @description The path of the tree */
        path?: string
        /** @description Used to get a recursive tree */
        recursive?: boolean
        /** @description Number of items per page */
        per_page?: number
        /** @description Current page number */
        page?: number
        /** @description Specify the pagination method */
        pagination?: 'legacy' | 'keyset' | 'none'
        /** @description Record from which to start the keyset pagination */
        page_token?: string
      }
      header?: never
      path: {
        /** @description The ID or URL-encoded path of the project */
        id: string | number
      }
      cookie?: never
    }
    requestBody?: never
    /**
     *
     */
    responses: {
      /** @description OK */
      200: {
        headers: Record<string, unknown>
        content: {
          'application/json': components['schemas']['TreeObject'][]
        }
      }
      /** @description Not found */
      404: {
        headers: Record<string, unknown>
        content?: never
      }
    }
  }
  /**
   *
   */
  getRepositoryFile: {
    parameters: {
      query: {
        /** @description The name of branch, tag or commit */
        ref: string
      }
      header?: never
      path: {
        /** @description The ID or URL-encoded path of the project */
        id: string | number
        /** @description The URL-encoded path to the file */
        file_path: string
      }
      cookie?: never
    }
    requestBody?: never
    /**
     *
     */
    responses: {
      /** @description OK */
      200: {
        headers: Record<string, unknown>
        content: {
          'application/json': components['schemas']['FileMetadata']
        }
      }
      /** @description Not found */
      404: {
        /**
         *
         */
        headers: Record<string, unknown>
        content?: never
      }
    }
  }
  /**
   *
   */
  getRepositoryFileRaw: {
    parameters: {
      query?: {
        /** @description The name of branch, tag or commit */
        ref?: string
        /** @description Retrieve binary data for a file that is an lfs pointer */
        lfs?: boolean
      }
      header?: never
      path: {
        /** @description The ID or URL-encoded path of the project */
        id: string | number
        /** @description The URL-encoded path to the file */
        file_path: string
      }
      cookie?: never
    }
    requestBody?: never
    /**
     *
     */
    responses: {
      /** @description OK */
      200: {
        headers: Record<string, unknown>
        /**
         *
         */
        content: {
          'text/plain': string
        }
      }
      /** @description Not found */
      404: {
        headers: Record<string, unknown>
        content?: never
      }
    }
  }
  /**
   *
   */
  getRepositoryBranches: {
    /**
     *
     */
    parameters: {
      query?: {
        /** @description Return list of branches matching the search criteria */
        search?: string
        /** @description Number of items per page */
        per_page?: number
        /** @description Current page number */
        page?: number
      }
      header?: never
      path: {
        /** @description The ID or URL-encoded path of the project */
        id: string | number
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description OK */
      200: {
        /**
         *
         */
        headers: Record<string, unknown>
        /**
         *
         */
        content: {
          'application/json': components['schemas']['Branch'][]
        }
      }
      /** @description Not found */
      404: {
        headers: Record<string, unknown>
        content?: never
      }
    }
  }
  /**
   *
   */
  getRepositoryTags: {
    parameters: {
      /**
       *
       */
      query?: {
        /** @description Return tags sorted in asc or desc order */
        sort?: 'asc' | 'desc'
        /** @description Return tags ordered by name, updated, or version */
        order_by?: 'name' | 'updated' | 'version'
        /** @description Return list of tags matching the search criteria */
        search?: string
        /** @description Number of items per page */
        per_page?: number
        /** @description Current page number */
        page?: number
      }
      header?: never
      path: {
        /** @description The ID or URL-encoded path of the project */
        id: string | number
      }
      cookie?: never
    }
    requestBody?: never
    /**
     *
     */
    responses: {
      /** @description OK */
      200: {
        headers: Record<string, unknown>
        content: {
          'application/json': components['schemas']['Tag'][]
        }
      }
      /** @description Not found */
      404: {
        headers: Record<string, unknown>
        content?: never
      }
    }
  }
  /**
   *
   */
  getRepositoryCompare: {
    parameters: {
      query: {
        /** @description The commit, branch name, or tag name to start comparison */
        from: string
        /** @description The commit, branch name, or tag name to stop comparison */
        to: string
        /** @description Comparison method */
        straight?: boolean
        /** @description A diff in a Unified diff format */
        unidiff?: boolean
      }
      header?: never
      path: {
        /** @description The ID or URL-encoded path of the project */
        id: string | number
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description OK */
      200: {
        headers: Record<string, unknown>
        content: {
          'application/json': components['schemas']['Compare']
        }
      }
      /** @description Not found */
      404: {
        /**
         *
         */
        headers: Record<string, unknown>
        content?: never
      }
    }
  }
}
