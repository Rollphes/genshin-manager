/**
 *
 */
export interface paths {
  /**
   *
   */
  '/api/status': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get status from the last hour */
    get: operations['getStatus']
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
  '/api/now': {
    /**
     *
     */
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get current status */
    get: operations['getCurrentStatus']
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
    EnkaStatus: {
      /** @description Current datetime string */
      now: string
      /** @description Honkai Star Rail stats */
      hsr: components['schemas']['EnkaStat']
      /** @description Genshin Impact stats */
      gi: components['schemas']['EnkaStat']
      /** @description Genshin Guide stats */
      gg: components['schemas']['EnkaStat']
      /** @description Ping status for various endpoints */
      pingu: components['schemas']['EnkaPingu']
    }
    /**
     *
     */
    EnkaStat: {
      /** @description Response time (ms) by region */
      time: Record<string, number>
      /** @description Ping (ms) by region */
      ping: Record<string, number>
      /** @description Request capacity (req/min) by region */
      nodes: Record<string, number>
      /** @description Failure counts by region */
      underruns: Record<string, string>
    }
    /**
     *
     */
    EnkaPingu: {
      cdn: components['schemas']['EnkaPing']
      main: components['schemas']['EnkaPing']
      api: components['schemas']['EnkaPing']
      fox: components['schemas']['EnkaPing']
    }
    EnkaPing: {
      /** @description Response time in milliseconds */
      ms: number
      /** @description HTTP status code */
      status: number
    }
    /**
     *
     */
    ErrorResponse: {
      message?: string
      error?: string
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
  getStatus: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Status data from the last hour */
      200: {
        headers: Record<string, unknown>
        content: {
          'application/json': components['schemas']['EnkaStatus']
        }
      }
      /** @description Error response */
      default: {
        headers: Record<string, unknown>
        /**
         *
         */
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
    }
  }
  /**
   *
   */
  getCurrentStatus: {
    /**
     *
     */
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Current status data */
      200: {
        headers: Record<string, unknown>
        /**
         *
         */
        content: {
          'application/json': components['schemas']['EnkaStatus']
        }
      }
      /** @description Error response */
      default: {
        headers: Record<string, unknown>
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
    }
  }
}
